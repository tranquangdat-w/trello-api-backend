import { StatusCodes } from 'http-status-codes'
import assert from 'assert'
import { boardModel } from '~/models/boardModel'
import ApiErros from '~/utils/ApiErrors'
import { cardModel } from '~/models/cardModel'

const createNew = async (cardData, options) => {
  assert(cardData.boardId, 'CardData.boardId must exist')
  const board = await boardModel.findOneById(cardData.boardId)

  if (!board) throw new ApiErros(StatusCodes.NOT_FOUND, `Not found boardId ${cardData.boardId} for create card`)

  const newCard = await cardModel.createNew(cardData, options)

  return newCard

}

const updateCard = async (cardId, updateCardData, options) => {
  const result = await cardModel.updateCard(cardId, updateCardData, options)

  if (result.matchedCount == 0) throw new ApiErros(StatusCodes.NOT_FOUND, `Not found card with id ${cardId}`)

  return result
}

const deleteCard = async (cardId) => {
  await cardModel.deleteCardById(cardId)

  return { message: 'Delete card successfully' }
}

export const cardServices = {
  createNew,
  updateCard,
  deleteCard
}
