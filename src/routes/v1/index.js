import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from '~/routes/v1/boardRoutes.js'
import { columnRouter as columnRoutes } from './columnRoutes'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ messeage: 'Api v1 is okey' })
})

Router.use('/boards', boardRoutes)
Router.use('/columns', columnRoutes)

export const APIs_V1 = Router

