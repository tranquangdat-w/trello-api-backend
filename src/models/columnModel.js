import Joi from 'joi'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { boardModel } from './boardModel'
import ApiErros from '~/utils/ApiErrors'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

const COLUMN_COLLECTION_NAME = env.COLUMN_COLLECTION_NAME

const columnSchema = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  cardOrderIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .default([]),
  title: Joi.string().required(),
  boardId: Joi.string().required().guid({ version: 'uuidv4' }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const createNew = async (columnDataInput, options) => {
  const { error, value } = columnSchema
    .validate(columnDataInput, { abortEarly: false })

  if (error) throw error


  // Push columnId to columnsOrderIds
  const result = await GET_DB()
    .collection(boardModel.BOARD_COLLECTION_NAME)
    .updateOne(
      {
        _id: value.boardId
      },
      {
        $push: { columnOrderIds: value._id },
        $set: { updateAt: value.createdAt }
      },
      {
        ...options
      }
    )

  // If not found board with boardId throw new error
  if (!result
    || result.modifiedCount == 0
    || result.matchedCount == 0) throw new ApiErros(
    StatusCodes.NOT_FOUND,
    `Not found board with boardId: ${columnDataInput.boardId}`)

  await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .insertOne(value, { ...options })


  return value
}

const updateColumn = async (columnId, updateColumnData, options) => {
  const result = await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .updateOne(
      {
        _id: columnId
      },
      {
        $set: updateColumnData
      },
      {
        ...options
      }
    )

  return result
}

const deleteColumn = async (columnId, options) => {
  const result = await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .deleteOne({
      _id: columnId
    },
    {
      ...options
    })

  return result
}

const findOneById = async (columnId) => {
  return await GET_DB()
    .collection(COLUMN_COLLECTION_NAME)
    .findOne({ _id: columnId })
}

export const columnModel = {
  COLUMN_COLLECTION_NAME: COLUMN_COLLECTION_NAME,
  columnSchema: columnSchema,
  createNew,
  updateColumn,
  deleteColumn,
  findOneById
}

