import { columnModel } from '~/models/columnModel'

const createNew = async (columnDataInput) => {
  const createdColumn = await columnModel.createNew(columnDataInput)

  // Must return this to render in fontend
  createdColumn.cards = []

  return createdColumn
}

export const columnServices = {
  createNew
}
