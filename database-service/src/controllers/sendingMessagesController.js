const sequelize = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');

const { Op } = sequelize;
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

async function sendBirthDayMessage(req, res) {
  try {
    const users = await User.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn('month', sequelize.col('birthDayDate')),
            moment().month() + 1
          ),
          sequelize.where(
            sequelize.fn('day', sequelize.col('birthDayDate')),
            moment().date()
          )
        ]
      }
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
}

module.exports = {
  logSendingMessagesStatus,
  getSendingMessagesLog,
  sendBirthDayMessage
};
