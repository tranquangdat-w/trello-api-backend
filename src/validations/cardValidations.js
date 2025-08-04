import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiErros from '~/utils/ApiErrors'

const validCardData = Joi.object({
  title: Joi.string().required().min(3).max(50).trim()
    .messages({
      'string.base': 'Card title must be string',
      'any.required': 'Card title is required',
      'string.min': 'Card title must be at least 3 characters',
      'string.max': 'Card title can not exceed 50 characters',
      'string.trim': 'Card title must not have leading or trailling whitespace'
    }),
  boardId: Joi.string().guid({ version: 'uuidv4' }).required()
    .messages({
      'string.base': 'BoardId for create card must be string',
      'string.guid': 'BoardId for create card is not valid',
      'any.required': 'BoardId is required to created card'
    }),
  columnId: Joi.string().guid({ version: 'uuidv4' }).required()
    .messages({
      'string.base': 'ColumnId for create card must be string',
      'string.guid': 'ColumnId for create card is not valid',
      'any.required': 'ColumnId is required to created card'
    })
})

const createNew = async (req, _, next) => {
  try {
    await validCardData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCard = async (req, res, next) => {
  try {
    const validUpdateCardData = Joi.object({
      description: Joi.string().trim().empty('').messages({
        'string.base': 'Description must be string'
      }),
      title: Joi.string().trim().messages({
        'string.base': 'Title must be string',
        'string.empty': 'Title is not allow to be empty'
      }),
      columnId: Joi.string().guid({ version: 'uuidv4' }).messages({
        'string.base': 'columnId must be string',
        'string.guid': 'columnId is not valid'
      }),
      // content Of comment
      content: Joi.string().trim().empty().messages({
        'string.base': 'Content of commnet must be string',
        'string.empty': 'Content of commnet must not be empty'
      }),
      commentedAt: Joi.date().timestamp().messages({
      }),
      userName: Joi.string().strict().trim().messages({
        'string.base': 'Username must be string',
        'string.empty': 'Username must not be empty',
        'string.trim': 'Username must not be trim'
      }),
      userAvatar: Joi.string().trim().messages({
        'string.base': 'User avatar must be string',
        'string.empty': 'User avatar must not be empty',
        'string.trim': 'User avatar must not be trim'
      })
    })

    await validUpdateCardData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteCard = async (req, _res, next) => {
  try {
    const validDeleteCard = Joi.object({
      id: Joi.string().guid({ version: 'uuidv4' })
        .messages({
          'string.base': 'cardId must be string',
          'string.guid': 'cardId is not valid'
        })
    })

    await validDeleteCard.validateAsync(req.params)
    next()
  } catch (error) {
    next(error)
  }
}

export const cardValidations = {
  createNew,
  updateCard,
  deleteCard
}
