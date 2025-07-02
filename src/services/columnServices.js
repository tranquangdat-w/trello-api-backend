import { StatusCodes } from 'http-status-codes'
import { columnModel } from '~/models/columnModel'
import ApiErros from '~/utils/ApiErrors'

const createNew = async (columnDataInput, options) => {
  const createdColumn = await columnModel.createNew(columnDataInput, options)

  // Must return this to render in fontend
  createdColumn.cards = []

  return createdColumn
}

const updateColumn = async (columnId, updateColumnData, options) => {
  const result = await columnModel.updateColumn(columnId, updateColumnData, options)

  if (result.matchedCount == 0) throw new ApiErros(StatusCodes.NOT_FOUND, `Not found column with id ${columnId}`)

  return result
}

export const columnServices = {
  createNew,
  updateColumn
}
