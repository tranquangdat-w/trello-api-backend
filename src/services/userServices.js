import argon2 from 'argon2'
import { StatusCodes } from 'http-status-codes'
import env from '~/config/environment'
import { userModel } from '~/models/userModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
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

  const existsUser = await userModel.findOneByUsername(username)

  if (existsUser) throw new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Username is exists')

  const hashedPassword = await argon2.hash(registerData.password)

  registerData.password = hashedPassword

  const result = await userModel.createNewAccount(registerData)
  const newUser = await userModel.findOneById(result.insertedId)

  const subject = 'TRELLO-DATDZ: Verify your account to using our service'
  const verificationLink = `${env.WEBSITE_DOMAIN_DEV}/users/verification?username=
${newUser.username}&token=${newUser.verifyToken}`

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
  const user = await userModel.findOneByUsername(verifyData.username)

  if (!user) throw new ApiErros(StatusCodes.NOT_FOUND, 'Username not found')

  if (verifyData.token !== user.verifyToken) throw new
  ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Not valid token')

  await userModel.updateUser(user._id, {
    verifyToken: null,
    isActive: true
  })

  return { message: 'Verify account successfully' }
}

const login = async (loginData) => {
  const user = await userModel.findOneByUsername(loginData.username)

  if (!user) throw new ApiErros(StatusCodes.NOT_FOUND, 'Username not found')

  if (!user.isActive) throw new
  ApiErros(
    StatusCodes.NOT_ACCEPTABLE,
    'Account doen\'t active, please check your mail to active account.'
  )

  if (!await argon2.verify(user.password, loginData.password)) throw new
  ApiErros(StatusCodes.BAD_REQUEST, 'Password is not correct')

  const userInfo = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt
  }

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

  return { accessToken, refreshToken, ...picker.pickUserField(user), _id: user._id }
}

const refreshToken = async (req) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) throw new ApiErros(StatusCodes.UNAUTHORIZED, 'You need login again')

  try {
    const result = await JwtProvider.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET_KEY)

    const userInfo = {
      _id: result._id,
      email: result.email,
      username: result.username,
      role: result.role,
      createdAt: result.createdAt
    }

    const newAccessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_KEY,
      env.ACCESS_TOKEN_TIME_LIFE
    )

    return newAccessToken
  } catch (error) {
    throw new ApiErros(StatusCodes.FORBIDDEN, 'You need login again')
  }
}

const update = async (userId, updateData, avatarFile) => {
  const user = await userModel.findOneById(userId)

  if (!user) throw new
  ApiErros(StatusCodes.NOT_FOUND, 'Not found userId in request to update password')

  if (!user.isActive) throw new
  ApiErros(StatusCodes.CONFLICT, 'Account is not active')

  let updatedUser = {}

  // Trường hợp update password
  if (updateData.oldPassword && updateData.newPassword && updateData.confirmPassword) {
    if (updateData.oldPassword === updateData.newPassword) throw new
    ApiErros(StatusCodes.BAD_REQUEST, 'New passowrd is same with old password')

    if (!await argon2.verify(user.password, updateData.oldPassword)) throw new
    ApiErros(StatusCodes.BAD_REQUEST, 'Old Password is not correct!')

    if (updateData.newPassword !== updateData.confirmPassword) throw new
    ApiErros(StatusCodes.BAD_REQUEST, 'New passowrd and confirm passowrd is not match')

    const hashedNewPassword = await argon2.hash(updateData.newPassword)

    updatedUser = await userModel.updateUser(
      userId, { password: hashedNewPassword }
    )
  } else if (avatarFile) {
    // pass
    const uploadResult = await cloudinaryProvider.uploadImage(avatarFile.buffer, 'user')

    const url = uploadResult.secure_url

    const userUpdatedAvatar = await userModel.updateUser(userId, {
      avatar: url
    })

    return userUpdatedAvatar
  } else {
    // Không được tự ý update password ở đây
    // Chỉ có thể tuân theo logic phía trên
    if (updateData.password) {
      throw new ApiErros(StatusCodes.BAD_REQUEST, 'Not allow update password with password filed!')
    }

    // Update các dữ liệu khác của user
    updatedUser = await userModel.updateUser(userId, updateData)
  }

  return picker.pickUserField(updatedUser)
}

export const userServices = {
  createNewAccount,
  verifyAccount,
  login,
  refreshToken,
  update
}
