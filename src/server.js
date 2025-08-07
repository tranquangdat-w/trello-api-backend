/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import env from './config/environment.js'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb.js'
import { APIs_V1 } from '~/routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddlewares.js'
import cookieParser from 'cookie-parser'
import nocache from 'nocache'
import { Server } from 'socket.io'
import { corsConfiguration, corsOptions } from './config/cors.js'

const START_SERVER = () => {
  const hostname = env.APP_HOST
  const port = env.APP_PORT

  const app = express()

  // disable cache
  app.use(nocache())

  // Sử dụng để đọc được cookie
  app.use(cookieParser())

  // Sử dụng để config cors
  app.use(corsConfiguration())

  app.use(express.json())

  // Use Apis V1
  app.use('/v1', APIs_V1)

  // ErrorHandlers
  app.use(errorHandlingMiddleware)

  const server = app.listen(port, hostname, async () => {
    console.log(`Application running at http://${hostname}:${port}/`)
  })

  const io = new Server(server, { cors: corsOptions })

  io.on('connection', (socket) => {
    socket.on('FE_INVITE_USER_TO_BOARD', (inviteeUserName) => {
      socket.broadcast.emit('receive-message', inviteeUserName)
    })
  })

  exitHook(async () => {
    console.log('\nClosing application...')
    await CLOSE_DB()
  })
}

CONNECT_DB()
  .then('Connected to MongoDB Database')
  .then(() => { START_SERVER() })
  .catch((error) => {
    console.error(error)
    process.exit()
  })

