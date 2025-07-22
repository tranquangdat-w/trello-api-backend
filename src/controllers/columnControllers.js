import { StatusCodes } from 'http-status-codes'
import { columnServices } from '~/services/columnServices'
import assert from 'assert'
import { START_NEW_SESSION } from '~/config/mongodb'

const createNew = async (req, res, next) => {
  const session = START_NEW_SESSION()

  try {
    session.startTransaction()

    const createdColumn = await columnServices.createNew(req.body, { session })

    await session.commitTransaction()
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    await session.abortTransaction()

    next(error)
  } finally {
    await session.endSession()
  }
}

const updateColumn = async (req, res, next) => {
  try {
    assert(req.params.id, 'req.params.id must exists')
    const columnId = req.params.id
    const result = columnServices.updateColumn(columnId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteColumn = async (req, res, next) => {
  const session = START_NEW_SESSION()
  try {
    session.startTransaction()

    const columnId = req.params.id

    const result = await columnServices.deleteColumnById(columnId, { session })

    await session.commitTransaction()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    await session.abortTransaction()

    next(error)
  } finally {
    await session.endSession()
  }
}
export const columnControllers = {
  createNew,
  updateColumn,
  deleteColumn
}
