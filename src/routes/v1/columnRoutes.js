import express from 'express'
import { columnControllers } from '~/controllers/columnControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { columnValidations } from '~/validations/columnValidations'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/')
  .post(
    columnValidations.createNew,
    columnControllers.createNew
  )

Router.route('/:id')
  .put(
    columnValidations.updateColumn,
    columnControllers.updateColumn
  )
  .delete(
    columnValidations.deleteColumn,
    columnControllers.deleteColumn
  )

export const columnRouter = Router

