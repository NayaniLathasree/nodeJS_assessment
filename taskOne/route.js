const express  = require('express')
const router = express.Router();

router.use('/file',require('./upload'))
router.use('/policy',require('./policy'))


module.exports = router;    