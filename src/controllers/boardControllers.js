import { StatusCodes } from 'http-status-codes'
import assert from 'assert'
import { boardService } from '~/services/boardServices'
import { START_NEW_SESSION } from '~/config/mongodb'
import { columnServices } from '~/services/columnServices'
import { cardServices } from '~/services/cardServices'

const createNew = async (req, res, next) => {
  try {
    assert(req.body, 'req for create board must have body')
    const createdBoard = await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      createdBoard
    })
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const listBoard = await boardService.getAll()

    res.status(StatusCodes.OK).json(listBoard)
  } catch (error) {
    next(error)
  }
}

const getBoardDetails = async (req, res, next) => {
  try {
    assert(req.params.id, 'Req params must has id')
    // If not found board with id, then boardService with throw ApiError
    // with be catch in next(error)

    const boardDetails = await boardService.getBoardDetails(req.params.id)

    res.status(StatusCodes.OK).json(boardDetails)
  } catch (error) {
    next(error)
  }

}

const updateBoard = async (req, res, next) => {
  try {
    assert(req.params.id, 'request must has boardId')
    const boardId = req.params.id
    const result = await boardService.updateBoard(boardId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const movingCard = async (req, res, next) => {
  const session = START_NEW_SESSION()
  try {
    session.startTransaction()
    const data = req.body

    await columnServices.updateColumn(
      data.prevColumnId,
      {
        cardOrderIds: data.prevCardOrderIds
      },
      {
        session
      }
    )

    await columnServices.updateColumn(
      data.nextColumnId,
      {
        cardOrderIds: data.nextCardOrderIds
      },
      {
        session
      }
    )

    await cardServices.updateCard(
      data.currentCardId,
      {
        columnId: data.nextColumnId
      },
      {
        session
      }
    )

    await session.commitTransaction()

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    await session.abortTransaction()

    next(error)
  } finally {
    await session.endSession()
  }
}
export const boardController = {
  createNew,
  getAll,
  getBoardDetails,
  updateBoard,
  movingCard
}
