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

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
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

const findAll = async ({ page = 1, limit = 20, search = '' }) => {
  const skip = (Number(page) - 1) * Number(limit)
  const query = {}

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const users = await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .find(query)
    .skip(skip)
    .limit(Number(limit))
    .toArray()

  return users
}

const countDocuments = async (search = '') => {
  const query = {}

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .countDocuments(query)
}

const updateUser = async (userId, userData) => {
  const allowUserData = _.pick(userData, allowUpdateField)

  await GET_DB().collection(USER_COLLECTION_NAME)
    .updateOne({
      _id: userId
    },
    {
      $set: allowUserData
    })

  const updatedUser = await findOneById(userId)

  return updatedUser
}

export const userModel = {
  USER_COLLECTION_NAME,
  createNewAccount,
  findOneByUsername,
  findOneById,
  findAll,
  countDocuments,
  updateUser
}
