import { StatusCodes } from 'http-status-codes'
import ApiErros from '~/utils/ApiErrors'
import cors from 'cors'
import env from './environment'

const WHITELIST = ['http://localhost:8017', 'http://localhost:5173', 'http://192.168.0.1016:5173']

export const corsOptions = {
  origin: (origin, callback) => {
    if (WHITELIST.indexOf(origin) !== -1) {
      callback(null, true)
      return
    }

    callback(new ApiErros(StatusCodes.FORBIDDEN, `${origin} not allowed by CORS`))
  },
  credentials: true
}

export const corsConfiguration = () => {
  // Allow all domain and credentials for dev
  if (env.MODE == 'dev') {
    return cors({
      origin: (origin, callback) => {
        callback(null, true)
      },

      credentials: true
    })
  }


  // Allow whilelist domain and credentials

  return cors(corsOptions)
}

