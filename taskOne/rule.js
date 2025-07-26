const Joi = require('joi');
const {validationErrorMessages} = require('../config/constant')

const uploadFileRule = Joi.object({
  file: Joi.object({
    mimetype: Joi.string().valid(
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ).required()
  })
  .required()
  .unknown()
  .label('File')
  .messages({
    '*': validationErrorMessages.uploadFile
  })
});

const searchUserNameRule = Joi.object({
    username: Joi.string().min(3).max(255).required().messages({
      '*': validationErrorMessages.userName
    }),
});

const getAggregatedPoliciesRule = Joi.object({
    userId: Joi.string().min(3).max(255).required().messages({
      '*': validationErrorMessages.userName
    }),
});

const scheduledMessageRule = Joi.object({
  message: Joi.string().trim().required().messages({
    'string.base': 'Message must be a string',
    'any.required': 'Message is required'
  }),

  day: Joi.string()
    .valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
    .required()
    .messages({
      'any.only': 'Invalid day provided',
      'any.required': 'Day is required'
    }),

  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) 
    .required()
    .messages({
      'string.pattern.base': 'Time must be in HH:mm format',
      'any.required': 'Time is required'
    })
});


module.exports = {
    uploadFileRule,searchUserNameRule,getAggregatedPoliciesRule,scheduledMessageRule
}

