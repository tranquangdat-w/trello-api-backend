import _ from 'lodash'

const allowUserField = ['_id', 'username', 'email', 'avatar', 'role', 'isActive', 'createdAt', 'updatedAt']

const pickUserField = (user) => {
  return _.pick(user, allowUserField)
}

export const picker = {
  pickUserField
}
