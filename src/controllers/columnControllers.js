import { StatusCodes } from 'http-status-codes'
import { columnServices } from '~/services/columnServices'

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnServices.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

export const columnControllers = {
  createNew
}
