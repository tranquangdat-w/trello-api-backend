import express from 'express'
import { cardControllers } from '~/controllers/cardControllers'
import { cardValidations } from '~/validations/cardValidations'

const Router = express.Router()

Router.route('/')
  .post(cardValidations.createNew, cardControllers.createNew)

Router.route('/:id')
  .put(cardValidations.updateCard, cardControllers.updateCard)

export const cardRouters = Router
