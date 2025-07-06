import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userServices'
import ms from 'ms'
import ApiErros from '~/utils/ApiErrors'

const createNewAccount = async (req, res, next) => {
  try {
    const result = await userServices.createNewAccount(req.body)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userServices.login(req.body)

    // Trả về cookie cho trình duyệt
    // Thời gian sống của cookie khác thời gian sống của trình duyệt
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })


    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout successfully' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const newAccessToken = await userServices.refreshToken(req)

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json({ message: 'Refresh access token successfully' })

  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const userId = req?.jwtEncoded?._id
    if (!userId) throw new
    ApiErros(StatusCodes.NOT_FOUND, 'Not found userId in request to updatePassword')

    await userServices.updatePassword(userId, req.body)

    res.status(StatusCodes.OK).json({ message: 'Update password successfully!' })
  } catch (error) {
    next(error)
  }
}

export const userControllers = {
  createNewAccount,
  verifyAccount,
  login,
  logout,
  refreshToken,
  updatePassword
}
