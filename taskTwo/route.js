const express  = require('express')
const router = express.Router();
const { scheduledMessage } = require('../taskOne/controller');

router.post('/schedule/message', scheduledMessage);

module.exports = router;    