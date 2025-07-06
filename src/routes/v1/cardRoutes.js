import express from 'express'
import { cardControllers } from '~/controllers/cardControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { cardValidations } from '~/validations/cardValidations'

const Router = express.Router()

Router.use(authMiddleware.authAccessToken)

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

export const cardRouters = Router
