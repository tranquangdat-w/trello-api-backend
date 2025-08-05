import Joi from 'joi'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { columnModel } from './columnModel'
import { v4 as uuidv4 } from 'uuid'
import ApiErros from '~/utils/ApiErrors'
import { StatusCodes } from 'http-status-codes'

const CARD_COLLECTION_NAME = env.CARD_COLLECTION_NAME

const cardSchema = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  boardId: Joi.string().required().guid({ version: 'uuidv4' }),
  columnId: Joi.string().required().guid({ version: 'uuidv4' }),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().trim().default(''),

  cover: Joi.string().default(null),

  comments: Joi.array().items({
    userId: Joi.string().required().guid({ version: 'uuidv4' }),
    userEmail: Joi.string().required().email(),
    userAvatar: Joi.string(),
    userName: Joi.string(),
    content: Joi.string(),
    commentedAt: Joi.date().timestamp()
  }).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  dueDate: Joi.date().timestamp('javascript').default(null),
  isDone: Joi.boolean().default(false)
})

const createNew = async (cardData, options) => {
  const { error, value } = cardSchema.validate(cardData, { abortEarly: false })

  if (error) throw error

  const result = await GET_DB()
    .collection(columnModel.COLUMN_COLLECTION_NAME)
    .updateOne(
      {
        _id: value.columnId
      },
      {
        $push: { cardOrderIds: value._id },
        $set: { updatedAt: value.createdAt }
      },
      {
        ...options
      }
    )

  // If not found board with boardId throw new error
  if (!result || result.modifiedCount == 0) throw new ApiErros(
    StatusCodes.NOT_FOUND,
    `Not found column with columnId: ${cardData.boardId} to create card`)

  await GET_DB().collection(CARD_COLLECTION_NAME)
    .insertOne(value, { ...options })

  return value
}

const updateCard = async (cardId, updateCardData, options) => {
  const result = await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .updateOne(
      {
        _id: cardId
      },
      {
        $set: updateCardData
      },
      {
        ...options
      }
    )

  return result
}

const unshiftNewComment = async (cardId, commentData) => {
  const result = await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .updateOne(
      {
        _id: cardId
      },
      {
        $push: { comments: { $each: [commentData], $position: 0 } }
      }
    )

  return result
}

const deleteCardByColumnId = async (columnId, options) => {
  const result = await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .deleteMany({
      columnId: columnId
    },
    {
      ...options
    })

  return result
}

const deleteCardById = async (cardId) => {
  const result = await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .deleteOne({
      _id: cardId
    })

  return result
}

const findOneById = async (cardId) => {
  return await GET_DB()
    .collection(CARD_COLLECTION_NAME)
    .findOne({ _id: cardId })
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  createNew,
  updateCard,
  deleteCardByColumnId,
  deleteCardById,
  findOneById,
  unshiftNewComment
}

