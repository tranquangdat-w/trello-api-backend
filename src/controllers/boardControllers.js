import { StatusCodes } from 'http-status-codes'
import assert from 'assert'
import { boardService } from '~/services/boardServices'

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
export const boardController = {
  createNew,
  getAll,
  getBoardDetails
}
