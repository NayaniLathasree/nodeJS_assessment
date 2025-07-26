const path = require('path');
const Boom = require('@hapi/boom');
const { Worker } = require('worker_threads');
const { uploadFileRule, searchUserNameRule, getAggregatedPoliciesRule, scheduledMessageRule } = require('./rule');
const { sendBoomError, sendResponse } = require('../utils/helpers');
const User = require('../models/user');
const Policy = require('../models/policy');
const dbQuery = require('./db');
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
        return res.status(200).json({ message: 'File processed successfully!' });
      } else {
        return res.status(400).json({ error: 'Processing failed', message: data.message });
      }
    });
    worker.on('error', err => res.status(500).json({ error: err.message }));
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        return res.status(500).json({ error: 'Worker thread exited unexpectedly.' });
      }
    });
  } catch (error) {

    next(error);
  }
};


const getPolicyByUsername = async (req, res, next) => {
  try {
    const { username } = req.query;
    const { error } = searchUserNameRule.validate({ username: username });
    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }
    const user = await User.findOne({ firstName: username });
    if (!user) return sendResponse(res, { message: 'User not found' }, 404, false);
    const policies = await Policy.find({ userId: user._id });
    sendResponse(res, policies, 200, true)
  } catch (error) {
    next(error);
    
  }
};

const getAggregatedPolicies = async (req, res, next) => {
  try {
    const userId = "6884ab4e48913c0f2123573d"

    const { error } = getAggregatedPoliciesRule.validate({ userId: userId });
    if (error) {
      return sendBoomError(res, Boom.badRequest(error.details[0].message));
    }
    const result = await dbQuery.policiesAggregation(userId)
    sendResponse(res, result, 200, true)
  } catch (error) {
    throw error
    next(error)
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
      message: 'Message scheduled successfully'
    }, 200, true)
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getPolicyByUsername, getAggregatedPolicies, scheduledMessage };
