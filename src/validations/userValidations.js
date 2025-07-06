/* eslint-disable no-useless-escape */
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiErros from '~/utils/ApiErrors'

const createNewAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    username: Joi.string().required().strict().trim().messages({
      'any.required': 'Username is required',
      'string.base': 'Username must be string',
      'string.empty': 'Username must not be empty',
      'string.trim': 'Username must not be trim'
    }),
    password: Joi.string().required().min(8)
      .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\(\)])'))
      .messages({
        'any.required': 'Password is required',
        'string.base': 'Password must be string',
        'string.min': 'Password has at least 8 character',
        'string.pattern.base': 'Password must contains at least 1 alpha, 1 number, 1 special symbol',
        'string.empty': 'Password must not be empty'
      }),
    email: Joi.string().required().email()
      .messages({
        'string.base': 'Email must be string',
        'string.email': 'Invalid email',
        'any.required': 'Email is required',
        'string.empty': 'Email must not be empty'
      }),
    confirmPassword: Joi.string().required().min(8)
      .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\(\)])'))
      .messages({
        'any.required': 'ConfirmPassword is required',
        'string.base': 'ConfirmPassword must be string',
        'string.min': 'ConfirmPassword has at least 8 character',
        'string.pattern.base': 'CofirmPassword must contains at least 1 alpha, 1 number, 1 special symbol',
        'string.empty': 'ConfirmPassword must not be empty'
      })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyAccount = async (req, res, next) => {
  const verifyAccountDataValidation = Joi.object({
    username: Joi.string().required().trim().strict().messages({
      'string.base': 'Username must be a string',
      'any.required': 'Username is required',
      'string.empty': 'Username must not be empty',
      'string.trim': 'Username must not be trim'
    }),
    token: Joi.string().required().trim().strict().guid({ version: 'uuidv4' })
      .messages({
        'any.required': 'Token is required',
        'string.base': 'Token must be a string',
        'string.empty': 'Token cannot be empty',
        'string.guid': 'Token is not valid format'
      })
  })

  try {
    await verifyAccountDataValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}


const login = async (req, res, next) => {
  const loginDataValidation = Joi.object({
    username: Joi.string().required().trim().strict().messages({
      'string.base': 'Username must be a string',
      'any.required': 'Username is required',
      'string.empty': 'Username must not be empty',
      'string.trim': 'Username must not be trim'
    }),
    password: Joi.string().required().messages({
      'string.base': 'Password must be string',
      'any.required': 'Password is required'
    })
  })

  try {
    await loginDataValidation.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updatePassword = async (req, res, next) => {
  const updatePasswordDataValidation = Joi.object({
    oldPassword: Joi.string().required().messages({
      'string.base': 'Old Password must be string',
      'any.required': 'Old Password is required'
    }),
    newPassword: Joi.string().required().min(8)
      .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\(\)])'))
      .messages({
        'any.required': 'New password is required',
        'string.base': 'New password must be string',
        'string.min': 'New password has at least 8 character',
        'string.pattern.base': 'New password must contains at least 1 alpha, 1 number, 1 special symbol',
        'string.empty': 'New password must not be empty'
      }),
    confirmPassword: Joi.string().required().min(8)
      .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\(\)])'))
      .messages({
        'any.required': 'New password is required',
        'string.base': 'New password must be string',
        'string.min': 'New password has at least 8 character',
        'string.pattern.base': 'New password must contains at least 1 alpha, 1 number, 1 special symbol',
        'string.empty': 'New password must not be empty'
      })
  })

  try {
    await updatePasswordDataValidation.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(error)
  }
}
export const userValidations = {
  createNewAccount,
  verifyAccount,
  login,
  updatePassword
}

