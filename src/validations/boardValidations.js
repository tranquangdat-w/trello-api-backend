import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiErros from '~/utils/ApiErrors'
import { BOARD_TYPES } from '~/utils/constrants'

const createNew = async (req, _res, next) => {
  const validBoardData = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict()
      .messages({
        'string.base': 'Title must be string',
        'any.required': 'Title is requeired',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title can not exceed 50 characters',
        'string.trim': 'Title must not have leading or trailling whitespace',
        'any.strict': 'Invalid title format'
      }),
    description: Joi.string().max(250).trim().empty()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 250 characters',
        'string.trim': 'Description must not have leading or trailing whitespace',
        'string.empty': 'Description is not allow empty, if dont want it please remove this file'
      }),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)).required()
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

export const updateBoard = async (req, res, next) => {
  try {
    if (!req.body | Object.keys(req.body).length == 0) {
      res.status(StatusCodes.OK).json({
        message: 'Nothing change because request doesn\'t has body'
      })
    }

    const updateBoardData = Joi.object({
      title: Joi.string().min(3).max(50).trim().strict()
        .messages({
          'string.base': 'Title must be string',
          'string.min': 'Title must be at least 3 characters',
          'string.max': 'Title can not exceed 50 characters',
          'string.trim': 'Title must not have leading or trailling whitespace',
          'any.strict': 'Invalid title format'
        }),
      description: Joi.string().max(250).trim().strict()
        .messages({
          'string.base': 'Description must be a string',
          'string.max': 'Description cannot exceed 250 characters',
          'string.trim': 'Description must not have leading or trailing whitespace',
          'any.strict': 'Invalid description format'
        }),
      type: Joi.string().valid(...Object.values(BOARD_TYPES))
        .messages({
          'string.base': 'Board type must be a string',
          'any.only': 'Board type must be either PUBLIC or PRIVATE'
        }),
      columnOrderIds: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' }))
        .messages({
          'array.base': 'columnOrderIds must be a array',
          'string.base': 'ColumnId must be string',
          'string.guid': 'ColumnId format is not valid'
        })
    })

    await updateBoardData.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const movingCard = async (req, res, next) => {
  try {
    const validMovingCardData = Joi.object({
      currentCardId: Joi.string().guid({ version: 'uuidv4' }).required(),
      prevColumnId: Joi.string().guid({ version: 'uuidv4' }).required(),
      prevCardOrderIds: Joi.array().items(Joi.string().guid({ version: 'uuidv4' }))
        .required(),
      nextColumnId: Joi.string().guid({ version: 'uuidv4' }).required(),
      nextCardOrderIds: Joi.array().items(Joi.string().guid({ version: 'uuidv4' }))
        .required()
    })

    await validMovingCardData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(error)
  }
}

const getBoards = async (req, rest, next) => {
  try {
    const validPaginationBoards = Joi.object({
      page: Joi.number().integer().min(1).messages({
        'number.base': 'Page must be number',
        'number.integer': 'Page must be integer',
        'number.min': 'Page must >= 1'
      }),
      nBoardPerPage: Joi.number().integer().min(1).messages({
        'number.base': 'N board per page must be number',
        'number.integer': 'N board per page must be integer',
        'number.min': 'N board per page must >= 1'
      })
    }).unknown()

    await validPaginationBoards.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(error)
  }
}
export const boardValidation = {
  createNew,
  updateBoard,
  movingCard,
  getBoards
}
