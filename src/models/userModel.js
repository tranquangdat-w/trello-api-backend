/* eslint-disable no-useless-escape */
import Joi from 'joi'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'

export const ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

const allowUpdateField = ['verifyToken', 'updatedAt', 'role', 'avatar', 'email', 'password', 'isActive']

const USER_COLLECTION_NAME = env.USER_COLLECTION_NAME
const userSchemna = Joi.object({
  _id: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  avatar: Joi.string().default(null),
  username: Joi.string().required().strict().trim(),
  password: Joi.string().required(),
  email: Joi.string().required().email(),

  role: Joi.string().valid(...Object.values(ROLES)).default(ROLES.CLIENT),

  verifyToken: Joi.string().guid({ version: 'uuidv4' }).default(() => uuidv4()),
  isActive: Joi.boolean().default(false),

  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)

})

const createNewAccount = async (registerData) => {
  const { error, value } = userSchemna.validate(registerData, { abortEarly: false })

  if (error) throw error

  const createdUser = await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .insertOne(value)

  return createdUser
}

const findOneByUsername = async (username) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ username: username })
}

const findOneById = async (userId) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({ _id: userId })
}

const updateUser = async (userId, userData) => {
  const allowUserData = _.pick(userData, allowUpdateField)

  const result = await GET_DB().collection(USER_COLLECTION_NAME)
    .updateOne({
      _id: userId
    },
    {
      $set: allowUserData
    })

  const updatedUser = await findOneById(userId)

  return updatedUser
}

export const UserModel = {
  createNewAccount,
  findOneByUsername,
  findOneById,
  updateUser
}
