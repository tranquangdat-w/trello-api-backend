import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
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

const deleteColumn = async (columnId, options) => {
  await columnModel.deleteColumn(columnId, options)
  await cardModel.deleteCardByColumnId(columnId, options)

  const column = await columnModel.findOneById(columnId)
  const boardId = column.boardId

  await boardModel.pullColumnOrderIds(boardId, columnId, options)

  return { message: 'Delete column successfully' }
}

export const columnServices = {
  createNew,
  updateColumn,
  deleteColumnById: deleteColumn
}
