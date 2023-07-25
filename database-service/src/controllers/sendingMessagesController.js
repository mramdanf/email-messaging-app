const { SendingMessagesStatus, Messages, User } = require('../models');

async function logSendingMessagesStatus(req, res) {
  try {
    await SendingMessagesStatus.create(req.body);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
}

async function getSendingMessagesLog(req, res) {
  try {
    const logs = await SendingMessagesStatus.findAll({
      include: [
        { model: Messages, as: 'message' },
        { model: User, as: 'user' }
      ]
    });
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

module.exports = {
  logSendingMessagesStatus,
  getSendingMessagesLog
};
