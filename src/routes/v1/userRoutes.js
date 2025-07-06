import express from 'express'
import { userControllers } from '~/controllers/userControllers'
import { authMiddleware } from '~/middlewares/authJWTMiddleWares'
import { userServices } from '~/services/userServices'
import { userValidations } from '~/validations/userValidations'

const Router = express.Router()

Router.post('/register', userValidations.createNewAccount, userControllers.createNewAccount)

Router.put('/verify', userValidations.verifyAccount, userControllers.verifyAccount)

Router.post('/login', userValidations.login, userControllers.login)

Router.get('/refresh_token', userControllers.refreshToken, userServices.refreshToken)

Router.delete('/logout', userControllers.logout)

Router.put('/change_password', authMiddleware.authAccessToken, userValidations.updatePassword, userControllers.updatePassword)

export const userRoutes = Router
