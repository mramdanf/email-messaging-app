const moment = require('moment-timezone');
const sequelize = require('sequelize');
const { SendingMessagesStatus, Messages, User } = require('../models');

const { Op } = sequelize;

async function deleteSendMessageLog(log) {
  try {
    await SendingMessagesStatus.destroy({
      where: {
        id: log.id
      }
    });
    return {
      error: false,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: false,
      errorMessage: error.toString()
    };
  }
}

async function findSendMessageErrorLog() {
  try {
    const logs = await SendingMessagesStatus.findAll({
      where: {
        sentStatus: 'error'
      },
      include: [
        {
          model: Messages,
          as: 'message'
        },
        {
          model: User,
          as: 'user'
        }
      ],
      raw: true,
      nest: true
    });
    return {
      error: false,
      logs,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      logs: [],
      errorMessage: error.toString()
    };
  }
}

async function createSendMessageLog({ user, message, sendMailResult }) {
  try {
    const { error, data, errorMessage } = sendMailResult;
    const loggingStatus = await SendingMessagesStatus.create({
      userId: user.id,
      messageId: message.id,
      sentStatus: error ? 'error' : 'success',
      sentTime: error
        ? ''
        : moment(data.sentTime).tz(user.location).format('YYYY-MM-DD HH:mm:ss'),
      descriptions: error ? errorMessage : ''
    });
    return {
      error: false,
      loggingStatus,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      loggingStatus: null,
      errorMessage: error.toString()
    };
  }
}

async function checkSendMessageLogByYear({ userId, messageId, year }) {
  try {
    const sendingStatus = await SendingMessagesStatus.findAll({
      where: {
        [Op.and]: [
          { userId },
          { sentStatus: 'success' },
          { messageId },
          sequelize.where(sequelize.fn('year', sequelize.col('sentTime')), year)
        ]
      }
    });
    return {
      error: false,
      errorMessage: '',
      sentAlready: sendingStatus && sendingStatus.length
    };
  } catch (error) {
    return {
      error: true,
      sentAlready: false,
      errorMessage: error.toString()
    };
  }
}

module.exports = {
  deleteSendMessageLog,
  findSendMessageErrorLog,
  createSendMessageLog,
  checkSendMessageLogByYear
};
