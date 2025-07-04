import _ from 'lodash'

const allowUserField = ['username', 'email', 'avatar', 'role', 'isActive', 'createAt', 'updateAt']

const pickUserField = (user) => {
  return _.pick(user, allowUserField)
}

export const picker = {
  pickUserField
}
