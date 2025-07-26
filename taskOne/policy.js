const express = require('express');
const {
  getPolicyByUsername,
  getAggregatedPolicies,
} = require('./controller');

const router = express.Router();

router.get('/search', getPolicyByUsername);
router.get('/user', getAggregatedPolicies);

module.exports = router;
