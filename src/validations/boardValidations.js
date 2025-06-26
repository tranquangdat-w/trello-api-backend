import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiErros from '~/utils/ApiErrors'
import { BOARDTYPES } from '~/utils/constrants'

const createNew = async (req, res, next) => {
  const validBoardData = Joi.object({
    title: Joi
      .string()
      .required()
      .min(3)
      .max(50)
      .trim()
      .strict()
      .messages({
        'string.base': 'Title must be string',
        'any.required': 'Title is requeired',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title can not exceed 50 characters',
        'string.trim': 'Title must not have leading or trailling whitespace',
        'any.strict': 'Invalid title format'
      }),
    description: Joi
      .string()
      .required()
      .min(3)
      .max(250)
      .trim()
      .strict()
      .messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required',
        'string.min': 'Description must be at least 3 characters long',
        'string.max': 'Description cannot exceed 250 characters',
        'string.trim': 'Description must not have leading or trailing whitespace',
        'any.strict': 'Invalid description format'
      }),
    type: Joi
      .string()
      .valid(...Object.values(BOARDTYPES))
      .required()
      .messages({
        'string.base': 'Board type must be a string',
        'any.required': 'Board type is required',
        'any.only': 'Board type must be either PUBLIC or PRIVATE'
      })
  })

  try {
    await validBoardData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const boardValidation = {
  createNew
}
