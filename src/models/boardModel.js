import Joi from 'joi'
import env from '~/config/environment'
import { v4 as uuidv4 } from 'uuid'
import { GET_DB } from '~/config/mongodb'
import { BOARDTYPES } from '~/utils/constrants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

const BOARD_COLLECTION_NAME = env.BOARD_COLLECTION_NAME

const boardSchema = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().trim(),
  slug: Joi.string().min(3).trim().strict().required()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  columnOrderIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .default([]),
  memberIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' })),
  ownerIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' })),
  createdAt: Joi.date().timestamp('javascript').default(() => Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  type: Joi.string().valid(...Object.values(BOARDTYPES)).required()
})

const createNew = async (boardData) => {
  const result = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .insertOne(boardData)

  return result
}

const getBoards = async (userId, page, nBoardPerPage) => {
  const result = GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          $or: [
            { memberIds: userId },
            { ownerIds: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          boardData: [
            { $skip: (page - 1) * nBoardPerPage },
            { $limit: nBoardPerPage }
          ]
        }
      }
    ]).next()

  return result
}

const findOneById = async (id) => {
  return await GET_DB()
    .collection(BOARD_COLLECTION_NAME).findOne({ _id: id })
}

const getBoardDetails = async (id) => {
  const boardDetails = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      }
    },
    {
      $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      }
    }
  ]).next()

  return boardDetails
}

const updateBoard = async (boardId, boardData) => {
  const result = await GET_DB().collection(BOARD_COLLECTION_NAME)
    .updateOne({
      _id: boardId
    },
    {
      $set: boardData
    })

  return result
}

const pullColumnOrderIds = async (boardId, columnId, options) => {
  const result = await GET_DB()
    .collection(BOARD_COLLECTION_NAME)
    .updateOne(
      {
        _id: boardId
      },
      {
        $pull: { columnOrderIds: columnId }
      },
      {
        ...options
      }
    )

  return result
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  boardSchema,
  createNew,
  getBoards,
  findOneById,
  getBoardDetails,
  updateBoard,
  pullColumnOrderIds
}

