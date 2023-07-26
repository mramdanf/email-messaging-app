require('dotenv').config();
const { CRON_STATUS_TYPE } = require('../contants');
const { checkCronJobFinished } = require('./cron.utils');
const {
  sendBirthDayMessage,
  resendMessageOnError
} = require('./send-message.utils');

async function cronSendBirthDayMessage() {
  const cronStatus = await checkCronJobFinished(CRON_STATUS_TYPE.SEND_BIRTHDAY);
  if (!cronStatus.sendBirthDayMessage.finished) {
    console.log('cancel sending message, prev job not finished yet.');
    return;
  }
  console.log('---------------------');
  console.log('send birthday message scheduler running...');
  sendBirthDayMessage(Number(process.env.SENT_BIRTHDAY_AT_HOUR) || 9);
}

async function cronResendMessageOnError() {
  const {
    resendingMessageOnError: { finished }
  } = await checkCronJobFinished(CRON_STATUS_TYPE.RESEND_BIRTHDAY);
  if (!finished) {
    console.log(
      'cancel resending message on error, prev job not finished yet.'
    );
    return;
  }
  console.log('---------------------');
  console.log('resend message scheduler running...');
  resendMessageOnError();
}

module.exports = {
  cronSendBirthDayMessage,
  cronResendMessageOnError
};
