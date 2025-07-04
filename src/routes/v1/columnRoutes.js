import express from 'express'
import { columnControllers } from '~/controllers/columnControllers'
import { columnValidations } from '~/validations/columnValidations'

const Router = express.Router()

Router.route('/')
  .post(columnValidations.createNew, columnControllers.createNew)

Router.route('/:id')
  .put(columnValidations.updateColumn, columnControllers.updateColumn)
  .delete(columnValidations.deleteColumn, columnControllers.deleteColumn)

export const columnRouter = Router

