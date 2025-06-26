import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiErros from '~/utils/ApiErrors'

const createNew = async (req, res, next) => {
  const validColumnData = Joi.object({
    title: Joi
      .string()
      .required()
      .messages({
        'string.base': 'Title must be string',
        'any.required': 'Title is requeired',
        'string.empty': 'Title is not allow to be empty'
      }),
    boardId: Joi
      .string()
      .required()
      .guid({ version: 'uuidv4' })
      .messages({
        'string.base': 'boardId must be string',
        'any.required': 'boardId is required to create new column',
        'string.guid': 'boardId is not valid'
      })
  })

  try {
    await validColumnData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const columnValidations = {
  createNew
}

