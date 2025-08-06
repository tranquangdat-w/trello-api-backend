import Joi from 'joi'
import { v4 as uuidv4 } from 'uuid'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constrants'
import { userModel } from './userModel'
import { boardModel } from './boardModel'

const INVITATION_COLLECTION_NAME = env.INVITATION_COLLECTION_NAME

const invitationSchema = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),

  inviterId: Joi.string().guid({ version: 'uuidv4' }).required(),
  inviteeId: Joi.string().guid({ version: 'uuidv4' }).required(),

  type: Joi.string().valid(...Object.values(INVITATION_TYPES)).required(),

  boardInvitation: Joi.object({
    boardId: Joi.string().guid({ version: 'uuidv4' }).required(),
    status: Joi.string().valid(...Object.values(INVITATION_STATUS)).required()
  }),

  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const findOneById = async (id) => {
  return await GET_DB()
    .collection(INVITATION_COLLECTION_NAME).findOne({ _id: id })
}

const createNewBoardInvitation = async (invitationData) => {
  const { error, value } = invitationSchema.validate(invitationData, { abortEarly: false })

  if (error) throw error

  const result = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .insertOne(value)

  return result
}

const getInvitationsByUser = async (userId) => {
  const result = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME).aggregate([
      {
        $match: {
          inviteeId: userId,
          type: INVITATION_TYPES.BOARD
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'inviter',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      },
      {
        $lookup: {
          from: boardModel.BOARD_COLLECTION_NAME,
          localField: 'boardInvitation.boardId',
          foreignField: '_id',
          as: 'board',
          pipeline: [{ $project: { 'title': 1 } }]
        }
      }
    ]).toArray()

  return result
}

const updateInvitation = async (invitationId, updateData, options) => {
  const updatedInvitation = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: invitationId },
      {
        $set: updateData
      },
      {
        returnDocument: 'after'
      },
      { ...options }
    )

  return updatedInvitation
}

const deleteInvitation = async (invitationId, options) => {
  const result = await GET_DB()
    .collection(INVITATION_COLLECTION_NAME)
    .deleteOne({
      _id: invitationId
    },
    {
      ...options
    })

  return result
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  findOneById,
  createNewBoardInvitation,
  getInvitationsByUser,
  updateInvitation,
  deleteInvitation
}

