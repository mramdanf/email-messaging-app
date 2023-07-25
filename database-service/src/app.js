require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { sendBirthDayMessage } = require('./utils/message.utils');
const { checkCronJobFinished } = require('./utils/misc.utils');

const usersRouter = require('./routes/user');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

const port = process.env.APP_PORT || 3000;

cron.schedule('*/10 * * * * *', async () => {
  const { sendBirthDayMessageFinished } = await checkCronJobFinished();
  if (!sendBirthDayMessageFinished) {
    console.log('cancel sending message, prev job not finished yet.');
    return;
  }
  console.log('---------------------');
  console.log('send birthday message scheduler running...');
  sendBirthDayMessage(20);
});

cron.schedule('*/10 * * * * *', async () => {
  const { resendMessageOnError } = await checkCronJobFinished();
  if (!resendMessageOnError) {
    console.log(
      'cancel resending message on error, prev job not finished yet.'
    );
    return;
  }
  console.log('---------------------');
  console.log('send birthday message scheduler running...');
  sendBirthDayMessage(20);
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
