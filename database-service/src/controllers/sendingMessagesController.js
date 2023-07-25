/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
const sequelize = require('sequelize');
const moment = require('moment-timezone');
const { sendMail } = require('../helper/mailService');
const { getUserBirthDayAndLocale } = require('../helper/misc');

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

      const { birthDay, locale } = getUserBirthDayAndLocale(user);

      const shouldSendMessage =
        birthDay.month === locale.month &&
        birthDay.date === locale.date &&
        locale.hour === 13;

      if (!shouldSendMessage) {
        continue;
      }

      const messageForBirthDay = await Messages.findOne({
        where: {
          messageType: 'birth-day'
        }
      });

      // check if already send birthday message for given user on this year
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

      const { data } = await sendMail({
        message: messageForBirthDay.messages.replace(
          '{name}',
          `${user.fistName} ${user.lastName}`
        ),
        email: user.email
      });

      await SendingMessagesStatus.create({
        userId: user.id,
        messageId: messageForBirthDay.id,
        sentStatus: data.status === 'sent' ? 'success' : 'error',
        sentTime: moment(data.sentTime)
          .tz(user.location)
          .format('YYYY-MM-DD HH:mm:ss')
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
