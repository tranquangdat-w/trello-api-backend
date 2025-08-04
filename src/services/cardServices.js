import { StatusCodes } from 'http-status-codes'
import assert from 'assert'
import { boardModel } from '~/models/boardModel'
import ApiErros from '~/utils/ApiErrors'
import { cardModel } from '~/models/cardModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (cardData, options) => {
  assert(cardData.boardId, 'CardData.boardId must exist')
  const board = await boardModel.findOneById(cardData.boardId)

  if (!board) throw new ApiErros(cardData, options)

  const newCard = await cardModel.createNew(cardData, options)

  return newCard

}

const updateCard = async (cardId, updateCardData, options, coverFile, userData) => {
  if (coverFile) {
    const uploadResult = await cloudinaryProvider.uploadImage(coverFile.buffer, 'cards')

    const url = uploadResult.secure_url

    const result = await cardModel.updateCard(
      cardId,
      { cover: url }
    )

    if (result.matchedCount == 0) throw new ApiErros(
      StatusCodes.NOT_FOUND, `Not found card with id ${cardId}`)

    const cardUpdatedCover = await cardModel.findOneById(cardId)

    return cardUpdatedCover
  }

  // If add a comment to card
  // updateCardData need contains:
  // content
  // userAvatar
  // usreName
  // commentedAt
  if (updateCardData.commentedAt) {
    const newCommentData = {
      ...userData,
      ...updateCardData
    }

    const result = await cardModel.unshiftNewComment(cardId, newCommentData)

    return result
  }

  const result = await cardModel.updateCard(cardId, updateCardData, options)

  if (result.matchedCount == 0) throw new ApiErros(StatusCodes.NOT_FOUND, `Not found card with id ${cardId}`)

  const cardUpdatedCover = await cardModel.findOneById(cardId)

  return cardUpdatedCover
}

const deleteCard = async (cardId) => {
  await cardModel.deleteCardById(cardId)

  return { message: 'Delete card successfully' }
}

const findOneById = async (cardId) => {
  return await cardModel.findOneById(cardId)
}

export const cardServices = {
  createNew,
  updateCard,
  deleteCard,
  findOneById
}
