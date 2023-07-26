const { checkCronJobFinished } = require('./cron.utils');
const {
  sendBirthDayMessage,
  resendMessageOnError
} = require('./send-message.utils');

async function cronSendBirthDayMessage() {
  const cronStatus = await checkCronJobFinished();
  if (!cronStatus.sendBirthDayMessage.finished) {
    console.log('cancel sending message, prev job not finished yet.');
    return;
  }
  console.log('---------------------');
  console.log('send birthday message scheduler running...');
  sendBirthDayMessage(4);
}

async function cronResendMessageOnError() {
  const {
    resendingMessageOnError: { finished }
  } = await checkCronJobFinished();
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
