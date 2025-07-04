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

const updateColumn = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length == 0) res.status(StatusCodes.OK).json({ 'message': 'Nothing update because req.body doesn\'t exists' })

    const validUpdateColumnData = Joi.object({
      title: Joi.string()
        .messages({
          'string.base': 'Title must be string',
          'string.empty': 'Title is not allow to be empty'
        }),
      boardId: Joi.string().guid({ version: 'uuidv4' })
        .messages({
          'string.base': 'boardId must be string',
          'string.guid': 'boardId is not valid'
        }),
      cardOrderIds: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' }))
        .messages({
          'string.base': 'cardId must be string',
          'string.guid': 'cardId is not valid',
          'array.base': 'columnOrderIds must be a array'
        })
    })

    await validUpdateColumnData.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteColumn = async (req, res, next) => {
  const validColumnId = Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required()
      .messages({
        'string.base': 'columnId must be string',
        'any.required': 'columnId is requeired',
        'string.guid': 'columnId is in valid format'
      })
  })

  try {
    await validColumnId.validateAsync(req.params)
    next()
  } catch (error) {
    next(error)
  }
}

export const columnValidations = {
  createNew,
  updateColumn,
  deleteColumn
}

