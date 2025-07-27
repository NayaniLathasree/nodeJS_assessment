const path = require('path');
const Boom = require('@hapi/boom');
const mongoose = require('mongoose'); 
const { Worker } = require('worker_threads');
const { uploadFileRule, searchUserNameRule, getAggregatedPoliciesRule, scheduledMessageRule } = require('./rule');
const { sendBoomError, sendResponse } = require('../utils/helpers');
const User = require('../models/user');
const Policy = require('../models/policy');
const dbQuery = require('./db');
const {strings} = require('../config/constant')

const ScheduledMessage = require('../models/scheduledMessage');

const uploadFile = async (req, res, next) => {
  try {
    const { error } = uploadFileRule.validate({ file: req.file });

    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }
    const filePath = req.file.path;
    const worker = new Worker(path.resolve(__dirname, '../workers/dataProcessing.js'), {
      workerData: {
        filePath,
        fileType: req.file.mimetype,
      },
    });
    worker.on('message', (data) => {
      if (data.success) {
        return sendResponse(res, { message: strings.processingSuccess}, 200, true);
      } else {
         return sendResponse(res, { message: strings.processingFailed}, 422, false);
      }
    });
    worker.on('error', err =>  sendResponse(res, { message: err.message}, 500, false));
    worker.on('exit', (code) => {
      if (code !== 0) {
          return sendResponse(res, { message: strings.processingExit}, 500, false);
      }
    });
  } catch (error) {
    next(error);
  }
};


const getPolicyByUsername = async (req, res, next) => {
  try {
    const { username } = req.query;

    const { error } = searchUserNameRule.validate({ username });
    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }

    const users = await User.find({ firstName: new RegExp(`^${username}`, 'i') });
    if (!users || users.length === 0) {
      return sendResponse(res, { message: strings.userNotFound }, 404, false);
    }

    const userIds = users.map((u) => u._id);
     const policies = await Policy.find({ userId: { $in: userIds } })
      .populate({ path: 'userId', select: 'firstName email' })
      .lean(); 
      const result = policies.map(p => ({
      ...p,
      firstName: p.userId?.firstName || null,
      email: p.userId?.email || null,
      userId: p.userId?._id || null,
    }));
    if (!policies || policies.length === 0) {
      return sendResponse(res, { message: strings.policyNotFound }, 404, false);
    }

    return sendResponse(res, result, 200, true);
  } catch (error) {
    next(error);
  }
};

const getAggregatedPolicies = async (req, res, next) => {
  try {
    const {userId} = req.query; // login userId take from req.USER.Id
    const { error } = getAggregatedPoliciesRule.validate({ userId: userId });
    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
         return sendResponse(res, { message: strings.invalidUserId}, 400, false);
    }
    const users = await User.findOne({ _id: userId });
    if (!users || users.length === 0) {
      return sendResponse(res, { message: strings.userNotFound }, 404, false);
    }
    const result = await dbQuery.policiesAggregation(userId)
    sendResponse(res, result, 200, true)
  } catch (error) {
    next(error);
  }

};

const scheduledMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;
    const { error } = scheduledMessageRule.validate(req.body);
    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }
    const newMessage = new ScheduledMessage({ message, day, time });
    await newMessage.save();
    sendResponse(res, {
      message: strings.messageSchedule
    }, 200, true)
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getPolicyByUsername, getAggregatedPolicies, scheduledMessage };
