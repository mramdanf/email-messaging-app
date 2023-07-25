const express = require('express');

const router = express.Router();

const sendingMessagesController = require('../controllers/sendingMessagesController');

router.post('/', sendingMessagesController.logSendingMessagesStatus);
router.post('/today-birthday', sendingMessagesController.sendBirthDayMessage);
router.get('/', sendingMessagesController.getSendingMessagesLog);

module.exports = router;
