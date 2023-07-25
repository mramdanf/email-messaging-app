const express = require('express');

const router = express.Router();

const sendingMessagesController = require('../controllers/sendingMessagesController');

router.post('/', sendingMessagesController.logSendingMessagesStatus);
router.get('/', sendingMessagesController.getSendingMessagesLog);

module.exports = router;
