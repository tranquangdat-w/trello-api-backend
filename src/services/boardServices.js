import assert from 'assert'
import { StatusCodes } from 'http-status-codes'
import slug from 'slug'
import { boardModel } from '~/models/boardModel'
import ApiErros from '~/utils/ApiErrors'

const createNew = async (reqBody) => {
  assert(reqBody.title, 'reqBody must have title')

  const rawBoardData = {
    ...reqBody,
    slug: slug(reqBody.title)
  }

  const { error, value } = boardModel.boardSchema.validate(rawBoardData, { abortEarly : false })

  if (error) throw error

  const createdBoard = await boardModel.createNew(value)

  return createdBoard
}

const getAll = async () => {
  const listAllBoards = await boardModel.getAll()

  return listAllBoards
}

const findOneById = async (id) => {
  const board = await boardModel.findOneById(id)

  if (!board) throw new ApiErros(StatusCodes.NOT_FOUND, `Board with id ${id} not found`)

  return board
}

const getBoardDetails = async (id) => {
  const boardDetails = await boardModel.getBoardDetails(id)

  if (!boardDetails) throw new ApiErros(
    StatusCodes.NOT_FOUND,
    `Board with id ${id} not found`)

  const cards = boardDetails.cards

  boardDetails.columns.forEach(column => {
    column.cards = []

    for (let i = cards.length - 1; i >= 0; i--) {
      if (cards[i].columnId != column._id) {
        continue
      }

      column.cards.push(cards[i])
      cards.splice(i, 1)
    }
  })

  delete boardDetails.cards

  return boardDetails
}

const updateBoard = async (boardId, boardData) => {
  const result = await boardModel.updateBoard(boardId, boardData)

  if (result.matchedCount == 0) throw new ApiErros(
    StatusCodes.NOT_FOUND,
    `Not found board with id ${boardId}`)

  return result
}

export const boardService = {
  createNew,
  getAll,
  findOneById,
  getBoardDetails,
  updateBoard
}

