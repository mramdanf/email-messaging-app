/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
const sequelize = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment-timezone');

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
    const users = await User.findAll();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];

      const birthDay = {
        month: moment(user.birthDayDate).month() + 1,
        date: moment(user.birthDayDate).date()
      };
      const locale = {
        month: moment().tz(user.location).month() + 1,
        date: moment().tz(user.location).date(),
        minute: moment().tz(user.location).minute(),
        hour: moment().tz(user.location).hour(),
        year: moment().tz(user.location).year()
      };

      const shouldSendMessage =
        birthDay.month === locale.month &&
        birthDay.date === locale.date &&
        locale.hour === 12;

      if (!shouldSendMessage) {
        continue;
      }

      const messageForBirthDay = await Messages.findOne({
        where: {
          messageType: 'birth-day'
        }
      });

      const sendingStatus = await SendingMessagesStatus.findAll({
        where: {
          [Op.and]: [
            { userId: user.id },
            { sentStatus: 'success' },
            { messageId: messageForBirthDay.id },
            sequelize.where(
              sequelize.fn('year', sequelize.col('sentTime')),
              locale.year
            )
          ]
        }
      });

      if (sendingStatus && sendingStatus.length) {
        continue;
      }

      // TODO: http post to the send mail service

      await SendingMessagesStatus.create({
        userId: user.id,
        messageId: messageForBirthDay.id,
        sentStatus: 'success',
        sentTime: moment().tz(user.location).format('YYYY-MM-DD HH:mm:ss')
      });
    }

    res.status(200).json({ users: [] });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
}

module.exports = {
  logSendingMessagesStatus,
  getSendingMessagesLog,
  sendBirthDayMessage
};
