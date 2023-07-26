const { MESSAGE_TYPES } = require('../contants');
const { saveCronJobStatus } = require('./cron.utils');
const { sendMail } = require('./mail.utils');
const {
  checkSendMessageLogByYear,
  createSendMessageLog,
  findSendMessageErrorLog,
  deleteSendMessageLog
} = require('./message-log.utils');
const { findMessageByType } = require('./message.utils');
const { findAllUsers, getUserBirthDayAndLocale } = require('./user.utils');

async function sendBirthDayMessage(sendAtHour) {
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
    const messageResult = await findMessageByType(MESSAGE_TYPES.BIRTH_DAY);
    if (messageResult.error) {
      console.log(messageResult.errorMessage);
      await saveCronJobStatus({ sendBirthDayMessage: { finished: true } });
      continue;
    }

    console.log('checking if messge already sent...');
    const { message } = messageResult;
    const messageAlreadySent = await checkSendMessageLogByYear({
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
    const sendMailResult = await sendMail({ user, message });
    if (sendMailResult.error) {
      console.log(sendMailResult.errorMessage);
    }

    console.log('logging send mail status...');
    const logSendingStatus = await createSendMessageLog({
      user,
      message,
      sendMailResult
    });
    if (logSendingStatus.error) {
      console.log(logSendingStatus.errorMessage);
      continue;
    }

    if (!sendMailResult.error) {
      console.log(
        `successfully sent birthday message "${sendMailResult.data.messageBody}" to ${user.firstName}`
      );
    }
  }
  await saveCronJobStatus({ sendBirthDayMessage: { finished: true } });
}

async function resendMessageOnError() {
  await saveCronJobStatus({ resendingMessageOnError: { finished: false } });

  const errorSendingMessages = await findSendMessageErrorLog();
  if (errorSendingMessages.error) {
    console.log(
      `will not resend message. ${errorSendingMessages.errorMessage}`
    );
    await saveCronJobStatus({ resendingMessageOnError: { finished: true } });
    return;
  }

  const { logs } = errorSendingMessages;
  for (let index = 0; index < logs.length; index++) {
    const log = logs[index];
    const { user, message } = log;

    console.log(`### user: ${user.firstName} ###`);

    console.log('resending mail through mail service...');
    const resendMailResult = await sendMail({
      user,
      message
    });
    if (resendMailResult.error) {
      console.error(resendMailResult.errorMessage);
      continue;
    }

    console.log('logging resend mail result...');
    const logSendingStatus = await createSendMessageLog({
      user,
      message,
      sendMailResult: resendMailResult
    });
    if (logSendingStatus.error) {
      console.log(logSendingStatus.errorMessage);
      continue;
    }

    console.log(
      `successfully resend birthday message "${resendMailResult.data.messageBody}" to ${user.firstName}`
    );

    console.log('deleting successfully resend message...');
    const deleteMessage = await deleteSendMessageLog(log);
    if (deleteMessage.error) {
      console.log(`Failed to delete message. ${deleteMessage.errorMessage}`);
    }
  }

  await saveCronJobStatus({ resendingMessageOnError: { finished: true } });
}

module.exports = {
  sendBirthDayMessage,
  resendMessageOnError
};
