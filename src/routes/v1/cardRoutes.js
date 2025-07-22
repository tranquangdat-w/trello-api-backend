import express from 'express'
import { cardControllers } from '~/controllers/cardControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { cardValidations } from '~/validations/cardValidations'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/')
  .post(
    cardValidations.createNew,
    cardControllers.createNew
  )

Router.route('/:id')
  .put(
    cardValidations.updateCard,
    cardControllers.updateCard
  )

  .delete(
    cardValidations.deleteCard,
    cardControllers.deleteCard
  )

export const cardRouters = Router
