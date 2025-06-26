import Joi from 'joi'
import env from '~/config/environment'
import { GET_DB, GET_NEW_SESSION } from '~/config/mongodb'
import { boardModel } from './boardModel'
import ApiErros from '~/utils/ApiErrors'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

const COLUMN_COLLECTION_NAME = env.COLUMN_COLLECTION_NAME

const columnSchema = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  cardsOrderIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .default([]),
  title: Joi.string().required(),
  boardId: Joi.string().required().guid({ version: 'uuidv4' }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const createNew = async (columnDataInput) => {
  const { error, value } = columnSchema
    .validate(columnDataInput, { abortEarly: false })

  if (error) throw error

  const session = GET_NEW_SESSION()

  try {
    session.startTransaction()

    // Push columnId to columnsOrderIds
    const board = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .updateOne(
        {
          _id: value.boardId
        },
        {
          $push: { columnsOrderIds: value._id }
        },
        {
          session
        }
      )

    // If not found board with boardId throw new error
    if (!board || board.modifiedCount == 0) throw new ApiErros(
      StatusCodes.NOT_FOUND,
      `Not found board with boardId: ${columnDataInput.boardId}`)

    await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(value, { session })

    await session.commitTransaction()

    return value
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME: COLUMN_COLLECTION_NAME,
  columnSchema: columnSchema,
  createNew
}

