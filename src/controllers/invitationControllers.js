import { StatusCodes } from 'http-status-codes'
import { START_NEW_SESSION } from '~/config/mongodb'
import { invitationServies } from '~/services/invitationServies'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtEncoded._id
    const resInvitation = await invitationServies
      .createNewBoardInvitation(req.body, userId)

    res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

const getBoardInvitationsByUser = async (req, res, next) => {
  try {
    const userId = req.jwtEncoded._id

    // user duoc moi
    const invitationsOfUser = await invitationServies.getBoardInvitationsByUser(userId)

    res.status(StatusCodes.OK).json(invitationsOfUser)
  } catch (error) {
    next(error)
  }
}

const updateInvitation = async (req, res, next) => {
  const session = START_NEW_SESSION()
  try {
    session.startTransaction()

    const userId = req.jwtEncoded._id

    const { status } = req.body

    const invitationId = req.params['invitationId']

    const updatedInvitation = await invitationServies
      .updateInvitation(invitationId, userId, status, { session })

    await session.commitTransaction()

    res.status(StatusCodes.OK).json(updatedInvitation)
  } catch (error) {
    await session.abortTransaction()

    next(error)
  } finally {
    await session.endSession()
  }
}

export const invitationControllers = {
  createNewBoardInvitation,
  getBoardInvitationsByUser,
  updateInvitation
}
