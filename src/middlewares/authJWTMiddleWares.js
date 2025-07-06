import { StatusCodes } from 'http-status-codes'
import { TokenExpiredError } from 'jsonwebtoken'
import env from '~/config/environment.js'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiErros from '~/utils/ApiErrors.js'

const authAccessToken = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken

  if (!accessToken) {
    // Nếu không có token thì logout luôn
    next(new ApiErros(StatusCodes.UNAUTHORIZED,
      'Not Found AccessToken And you will cook'))

    return
  }

  try {
    const jwtEncoded = await JwtProvider.verifyToken(accessToken,
      env.ACCESS_TOKEN_SECRET_KEY)

    req.jwtEncoded = jwtEncoded

    next()
  } catch (error) {
    // Token hết hạn thì ta sẻ trả về mã lỗi để call api refreshtoken
    if (error instanceof TokenExpiredError) {
      next(new ApiErros(StatusCodes.GONE, 'AccessToken is expired!'))

      return
    }

    // Bất kì lỗi nào khác thì cũng đều bị logout
    next(new ApiErros(StatusCodes.UNAUTHORIZED,
      'Your login session is expired, please login again'))
  }
}

const authRefreshToken = async (req, res, next) => {
}

export const authMiddleware = {
  authAccessToken
}
