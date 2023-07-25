require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const {
  sendBirthDayMessage,
  resendMessageOnError
} = require('./utils/message.utils');
const { checkCronJobFinished } = require('./utils/cron.utils');

const usersRouter = require('./routes/user');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

const port = process.env.APP_PORT || 3000;

cron.schedule('*/10 * * * * *', async () => {
  const {
    sendBirthDayMessage: { finished }
  } = await checkCronJobFinished();
  if (!finished) {
    console.log('cancel sending message, prev job not finished yet.');
    return;
  }
  console.log('---------------------');
  console.log('send birthday message scheduler running...');
  sendBirthDayMessage(3);
});

cron.schedule('*/10 * * * * *', async () => {
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
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
