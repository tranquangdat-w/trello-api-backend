import express from 'express'
import { cardControllers } from '~/controllers/cardControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { multerUploadFileMiddleWare } from '~/middlewares/multerUploadMiddlewares'
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
    multerUploadFileMiddleWare.uploadAvatar,
    cardControllers.updateCard
  )

  .delete(
    cardValidations.deleteCard,
    cardControllers.deleteCard
  )

export const cardRouters = Router
