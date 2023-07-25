const sequelize = require('sequelize');
const moment = require('moment-timezone');
const { User, Messages, SendingMessagesStatus } = require('../models');
const { getUserBirthDayAndLocale, saveCronJobStatus } = require('./misc');
const { sendMail } = require('./mailService');

const { Op } = sequelize;

async function findAllUsers() {
  try {
    const users = await User.findAll();
    return {
      error: false,
      users,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      users: [],
      errorMessage: error.toString()
    };
  }
}

async function findMessageByType(messageType) {
  try {
    const message = await Messages.findOne({
      where: {
        messageType
      }
    });
    return {
      error: false,
      message,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      message: {},
      errorMessage: error.toString()
    };
  }
}

async function messageAlreadySentThisYear({ userId, messageId, year }) {
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

async function logSendMessageResult({ user, message, sentStatus }) {
  try {
    const loggingStatus = await SendingMessagesStatus.create({
      userId: user.id,
      messageId: message.id,
      sentStatus: sentStatus.status === 'sent' ? 'success' : 'error',
      sentTime: sentStatus.sentTime
        ? moment(sentStatus.sentTime)
            .tz(user.location)
            .format('YYYY-MM-DD HH:mm:ss')
        : ''
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

async function sendBirthDayMessage(messageType, sendAtHour) {
  await saveCronJobStatus({ sendBirthDayMessage: { finished: false } });

  const findAllUserResult = await findAllUsers();
  console.log('geting all users data...');
  if (findAllUserResult.error) {
    console.error(findAllUserResult.errorMessage);
    return;
  }

  const { users } = findAllUserResult;

  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const { birthDay, locale } = getUserBirthDayAndLocale(user);

    console.log(`### user: ${user.firstName} ###`);

    const shouldSendMessage =
      birthDay.month === locale.month &&
      birthDay.date === locale.date &&
      locale.hour === sendAtHour;

    if (!shouldSendMessage) {
      console.log('will not send message. Condition not satisfied.');
      continue;
    }

    console.log('finding message detail...');
    const messageResult = await findMessageByType(messageType);
    if (messageResult.error) {
      console.error(messageResult.errorMessage);
      continue;
    }

    console.log('checking if messge already sent...');
    const { message } = messageResult;
    const messageAlreadySent = await messageAlreadySentThisYear({
      userId: user.id,
      messageId: message.id,
      year: locale.year
    });

    if (messageAlreadySent.sentAlready) {
      console.log(
        `will not send message. Birthday messge already sent for user ${user.firstName} for year ${locale.year}`
      );
      continue;
    }

    console.log('sending mail through mail service...');
    const messageBody = message.messages.replace(
      '{full_name}',
      `${user.firstName} ${user.lastName}`
    );
    const sendMailResult = await sendMail({
      email: user.email,
      message: messageBody
    });
    if (sendMailResult.error) {
      console.error(sendMailResult.errorMessage);
    }

    console.log('logging send mail status...');
    const sentStatus = {
      status: sendMailResult.error ? 'error' : 'sent',
      sentTime: sendMailResult.error ? '' : sendMailResult.data.sentTime
    };
    const logSendingStatus = await logSendMessageResult({
      user,
      message,
      sentStatus
    });
    if (logSendingStatus.error) {
      console.error(logSendingStatus.errorMessage);
      continue;
    }

    console.log(
      `successfully sent birthday message "${messageBody}" to ${user.firstName}`
    );
  }
  await saveCronJobStatus({ sendBirthDayMessage: { finished: true } });
}

module.exports = {
  sendBirthDayMessage
};
