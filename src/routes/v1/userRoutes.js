import express from 'express'
import { userControllers } from '~/controllers/userControllers'
import { userValidations } from '~/validations/userValidations'

const Router = express.Router()

Router.post('/register', userValidations.createNewAccount, userControllers.createNewAccount)
Router.put('/verify', userValidations.verifyAccount, userControllers.verifyAccount)
Router.post('/login', userValidations.login, userControllers.login)

export const userRoutes = Router
