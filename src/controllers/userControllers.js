import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userServices'

const createNewAccount = async (req, res, next) => {
  try {
    const result = await userServices.createNewAccount(req.body)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userServices.login(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userControllers = {
  createNewAccount,
  verifyAccount,
  login
}
