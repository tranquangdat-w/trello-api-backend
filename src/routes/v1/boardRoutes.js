import express from 'express'
import { boardController } from '~/controllers/boardControllers'
import { boardValidation } from '~/validations/boardValidations.js'

const Router = express.Router()

Router.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Using board Routers')
  next()
})

Router.route('/')
  .get(boardController.getAll)
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getBoardDetails)
  .put()

export const boardRoutes = Router

