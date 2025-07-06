import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secreSignature, tokenLife) => {
  return JWT.sign(userInfo, secreSignature, { algorithm: 'HS256', expiresIn: tokenLife })
}

const verifyToken = async (token, secreSignature) => {
  return JWT.verify(token, secreSignature)
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
