import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes.js'
import { columnRouter as columnRoutes } from './columnRoutes'
import { cardRouters } from './cardRoutes'
import { userRoutes } from './userRoutes'
import { invitationRoute } from './invitationRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ messeage: 'Api v1 is okey' })
})

Router.use('/boards', boardRoutes)
Router.use('/columns', columnRoutes)
Router.use('/cards', cardRouters)
Router.use('/users', userRoutes)
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router

