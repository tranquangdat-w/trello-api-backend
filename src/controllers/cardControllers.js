import { StatusCodes } from 'http-status-codes'
import { cardServices } from '~/services/cardServices'
import assert from 'assert'
import { START_NEW_SESSION } from '~/config/mongodb'

const createNew = async (req, res, next) => {
  const session = START_NEW_SESSION()
  try {
    session.startTransaction()

    // { session } for { ...session } in model
    const newCard = await cardServices.createNew(req.body, { session })

    res.status(StatusCodes.CREATED).json(newCard)

    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()

    next(error)
  } finally {
    await session.endSession()
  }
}

const updateCard = async (req, res, next) => {
  try {
    assert(req.params.id, 'req.params.id must exists')

    const cover = req?.file
    const cardId = req.params.id

    const result = await cardServices.updateCard(cardId, req.body, null, cover)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    const cardId = req.params.id

    const result = await cardServices.deleteCard(cardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const cardControllers = {
  createNew,
  updateCard,
  deleteCard
}
