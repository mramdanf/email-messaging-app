require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const {
  cronSendBirthDayMessage,
  cronResendMessageOnError
} = require('./utils/cron-job.utils');

const usersRouter = require('./routes/user');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);

cron.schedule('*/10 * * * * *', cronSendBirthDayMessage);
cron.schedule('*/15 * * * * *', cronResendMessageOnError);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
