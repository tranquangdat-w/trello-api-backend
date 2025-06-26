import express from 'express'
import { columnControllers } from '~/controllers/columnControllers'
import { columnValidations } from '~/validations/columnValidations'

const Router = express.Router()

Router.route('/')
  .post(columnValidations.createNew, columnControllers.createNew)

export const columnRouter = Router

