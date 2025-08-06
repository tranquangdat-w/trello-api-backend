import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiErros from '~/utils/ApiErrors'
import { INVITATION_STATUS } from '~/utils/constrants'

const createNewBoardInvitation = async (req, _res, next) => {
  const validationInvitationData = Joi.object({
    inviteeUserName: Joi.string().required().trim().strict().messages({
      'any.required': 'Invitee username is required',
      'string.base': 'Invitee username must be string',
      'string.trim': 'Invitee username must not trim',
      'string.empty': 'Invitee username is not valid'
    }),
    boardId: Joi.string().empty().guid({ version: 'uuidv4' }).required().messages({
      'any.required': 'BoardId is required',
      'string.base': 'BoardId must be string',
      'string.empty': 'BoardId is not valid',
      'string.guid': 'BoardId must is not valid'
    })
  })

  try {
    await validationInvitationData.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const updateInvitation = async (req, _res, next) => {
  try {
    const updateInvitationValidate = Joi.object({
      status: Joi.string().valid(...Object.values(INVITATION_STATUS)).required()
        .messages({
          'string.base': 'Status type must be a string',
          'any.only': 'Status must be either rejected or accepted'
        }),
      invitationId: Joi.string().empty().guid({ version: 'uuidv4' }).required().messages({
        'any.required': 'InvitationId is required',
        'string.base': 'InvitationId must be string',
        'string.empty': 'InvitationId is not valid',
        'string.guid': 'InvitationId must is not valid'
      })
    })

    await updateInvitationValidate.validateAsync({
      ...req.body,
      invitationId: req.params['invitationId']
    }, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const invitationValidations = {
  createNewBoardInvitation,
  updateInvitation
}
