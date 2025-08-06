import express from 'express'
import { invitationControllers } from '~/controllers/invitationControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { invitationValidations } from '~/validations/invitationValidations'

const Router = express.Router()

Router.use(authMiddleware.isAuthorized)

Router.route('/')
  .get(invitationControllers.getBoardInvitationsByUser)

Router.route('/:invitationId')
  .put(invitationValidations.updateInvitation, invitationControllers.updateInvitation)

Router.route('/board')
  .post(
    invitationValidations.createNewBoardInvitation,
    invitationControllers.createNewBoardInvitation
  )

export const invitationRoute = Router
