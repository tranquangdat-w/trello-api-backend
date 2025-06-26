import Joi from 'joi'
import env from '~/config/environment'

const CARD_COLLECTION_NAME = env.CARD_COLLECTION_NAME

const cardSchema = Joi.object({
  title: Joi
    .string()
    .alphanum()
    .required()
    .min(3)
    .max(50)
    .trim()
    .strict(),
  description: Joi
    .string()
    .alphanum()
    .required()
    .min(3)
    .max(250)
    .trim()
    .strict(),
  slug: Joi
    .string()
    .min(3)
    .trim()
    .strict()
    .required(),
  columnOrderIds: Joi
    .array()
    .items(Joi.string())
    .default([]),
  createdAt: Joi
    .date()
    .timestamp('javascript')
    .default(Date.now()),
  updatedAt: Joi
    .date()
    .timestamp('javascript')
    .default(null),
  _destroy: Joi
    .boolean()
    .default(false)
})

export const cardModel = {
  CARD_COLLECTION_NAME,
  cardSchema
}

