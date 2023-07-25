require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { sendBirthDayMessage } = require('./helper/sendMessageToUsers');
const { MESSAGE_TYPES } = require('./contants');
const { checkCronJobFinished } = require('./helper/misc');

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
  sendBirthDayMessage(MESSAGE_TYPES.BIRTH_DAY, 20);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on http://localhost:${port}`);
});
