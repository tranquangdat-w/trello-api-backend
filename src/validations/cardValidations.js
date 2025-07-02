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

const createNew = async (req, res, next) => {
  try {
    await validCardData.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCard = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length == 0) res.status(StatusCodes.OK).json({ 'message': 'Nothing update because req.body doesn\'t exists' })

    const validUpdateCardData = Joi.object({
      title: Joi.string()
        .messages({
          'string.base': 'Title must be string',
          'string.empty': 'Title is not allow to be empty'
        }),
      columnId: Joi.string().guid({ version: 'uuidv4' })
        .messages({
          'string.base': 'columnId must be string',
          'string.guid': 'columnId is not valid'
        })
    })

    await validUpdateCardData.validateAsync(req.body)
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const cardValidations = {
  createNew,
  updateCard
}
