import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiErros from '~/utils/ApiErrors'
import { INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constrants'
import { picker } from '~/utils/picker'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  const inviteeUser = await userModel.findOneByUsername(reqBody.inviteeUserName)

  const inviterUser = await userModel.findOneById(inviterId)
  const board = await boardModel.findOneById(reqBody.boardId)

  if (!inviterUser || !board || !inviteeUser) {
    throw new ApiErros(
      StatusCodes.NOT_FOUND,
      'Invitee user or inviter user or board is not found'
    )
  }

  const newBoardInvitationData = {
    inviterId,
    inviteeId: inviteeUser._id,

    type: INVITATION_TYPES.BOARD,

    boardInvitation: {
      boardId: board._id,
      status: INVITATION_STATUS.PENDING
    }
  }

  const result = await invitationModel.createNewBoardInvitation(newBoardInvitationData)
  const newInvitation = await invitationModel.findOneById(result.insertedId)

  const resInvitation = {
    ...newInvitation,
    boardTitle: board.title,
    inviter: picker.pickUserField(inviterUser),
    invitee: picker.pickUserField(inviteeUser)
  }

  return resInvitation
}

const getBoardInvitationsByUser = async (userId) => {
  const invitationsByUser = await invitationModel.getInvitationsByUser(userId)

  if (invitationsByUser.length > 0) {
    for (let i = 0; i < invitationsByUser.length; i++) {
      invitationsByUser[i].inviter = invitationsByUser[i].inviter[0]
      invitationsByUser[i].boardTitle = invitationsByUser[i].board[0].title
      delete invitationsByUser[i].board
    }
  }

  return invitationsByUser
}

const updateInvitation = async (invitationId, userId, status, options) => {
  const oldInvitation = await invitationModel.findOneById(invitationId)

  if (!oldInvitation) {
    throw new ApiErros(StatusCodes.NOT_FOUND, 'Not found invitation to update')
  }

  const boardId = oldInvitation.boardInvitation.boardId

  const board = await boardModel.findOneById(boardId)

  if (!board) {
    // xoa loi moi
    await invitationModel.deleteInvitation(invitationId)

    throw new ApiErros(StatusCodes.NOT_FOUND, 'Not found board to update')
  }

  if (status === INVITATION_STATUS.ACCEPTED &&
    (board.memberIds.includes(userId) || board.ownerIds.includes(userId))) {
    // delete invitation
    await invitationModel.deleteInvitation(invitationId)

    throw new ApiErros(StatusCodes.BAD_REQUEST,
      'You are already joined in board ' + board.title)
  }

  const updateData = {
    ...oldInvitation,
    boardInvitation: {
      ...oldInvitation.boardInvitation,
      status: status
    }
  }

  // Change status of invitation
  const updatedInvitation = invitationModel.updateInvitation(
    invitationId,
    updateData,
    options
  )

  // Update Board board owners
  await boardModel.pushMemberIds(boardId, userId, options)

  return updatedInvitation

}

export const invitationServies = {
  createNewBoardInvitation,
  getBoardInvitationsByUser,
  updateInvitation
}

