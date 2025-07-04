import argon2 from 'argon2'
import { StatusCodes } from 'http-status-codes'
import env from '~/config/environment'
import { UserModel } from '~/models/userModel'
import { JwtProvider } from '~/providers/JwtProvider'
import { resendProvider } from '~/providers/sendMailProvider'
import ApiErros from '~/utils/ApiErrors'
import { getHtmlUserRegisterContent } from '~/utils/constrants'
import { picker } from '~/utils/picker'

const createNewAccount = async (registerData) => {
  const username = registerData.username

  if (registerData.password !== registerData.confirmPassword) {
    throw new ApiErros(StatusCodes.BAD_REQUEST, 'ConfirmPassword is not match')
  }

  delete registerData.confirmPassword

  const existsUser = await UserModel.findOneByUsername(username)

  if (existsUser) throw new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Username is exists')

  const hashedPassword = await argon2.hash(registerData.password)

  registerData.password = hashedPassword

  const result = await UserModel.createNewAccount(registerData)
  const newUser = await UserModel.findOneById(result.insertedId)

  const subject = 'TRELLO-DATDZ: Verify your account to using our service'
  const verificationLink = `${env.WEBSITE_DOMAIN_DEV}/users/verification?username=${newUser.username}&token=${newUser.verifyToken}`

  if (env.MODE === 'dev') {
    // eslint-disable-next-line no-console
    console.log(verificationLink)
  } else {
    const htmlMailContent = getHtmlUserRegisterContent(newUser.username, verificationLink)

    await resendProvider.sendMail(newUser.email, subject, htmlMailContent)
  }

  return picker.pickUserField(newUser)
}

const verifyAccount = async (verifyData) => {
  const user = await UserModel.findOneByUsername(verifyData.username)

  if (!user) throw new ApiErros(StatusCodes.NOT_FOUND, 'Username not found')

  if (verifyData.token !== user.verifyToken) throw new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Not valid token')

  await UserModel.updateUser(user._id, {
    verifyToken: null,
    isActive: true
  })

  return { message: 'Verify account successfully' }
}

const login = async (loginData) => {
  const user = await UserModel.findOneByUsername(loginData.username)

  if (!user) throw new ApiErros(StatusCodes.NOT_FOUND, 'Username not found')

  if (!user.isActive) throw new ApiErros(StatusCodes.NOT_ACCEPTABLE,
    'Account doen\'t active, please check your mail to active account.')

  if (!await argon2.verify(user.password, loginData.password)) throw new ApiErros(StatusCodes.BAD_REQUEST, 'Password is not correct')

  const userInfo = { _id: user._id, email: user.email }

  const accessToken = await JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_KEY,
    env.ACCESS_TOKEN_TIME_LIFE
  )

  const refreshToken = await JwtProvider.generateToken(
    userInfo,
    env.REFRESH_TOKEN_SECRET_KEY,
    env.REFRESH_TOKEN_TIME_LIFE
  )

  return { accessToken, refreshToken, ...picker.pickUserField(user) }
}

export const userServices = {
  createNewAccount,
  verifyAccount,
  login
}
