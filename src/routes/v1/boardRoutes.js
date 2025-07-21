import express from 'express'
import { boardController } from '~/controllers/boardControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { boardValidation } from '~/validations/boardValidations.js'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/')
  .get(boardValidation.getBoards, boardController.getBoards)

  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getBoardDetails)

  .put(boardValidation.updateBoard, boardController.updateBoard)

Router.put(
  '/supports/moving_card',
  boardValidation.movingCard,
  boardController.movingCard
)

export const boardRoutes = Router

