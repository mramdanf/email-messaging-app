const fs = require('fs/promises');
const path = require('path');
const moment = require('moment-timezone');
const get = require('lodash/get');

function getUserBirthDayAndLocale(user) {
  const birthDay = {
    month: moment(user.birthDayDate).month() + 1,
    date: moment(user.birthDayDate).date()
  };

  const locale = {
    month: moment().tz(user.location).month() + 1,
    date: moment().tz(user.location).date(),
    hour: moment().tz(user.location).hour(),
    year: moment().tz(user.location).year()
  };

  return {
    birthDay,
    locale
  };
}

function getCronJobStatusFile() {
  return path.join(process.cwd(), 'src', 'data', 'cronStatus.json');
}

async function saveCronJobStatus(data) {
  try {
    await fs.writeFile(
      getCronJobStatusFile(),
      JSON.stringify(data, null, '\t')
    );
  } catch (error) {
    console.error(error);
  }
}

async function checkCronJobFinished() {
  const filePath = getCronJobStatusFile();
  try {
    const fileData = await fs.readFile(filePath);
    const data = JSON.parse(fileData);
    return {
      sendBirthDayMessageFinished: get(data, 'sendBirthDayMessage.finished'),
      resendMessageOnError: get(data, 'resendMessageOnError.finished')
    };
  } catch (error) {
    return {
      sendBirthDayMessageFinished: true,
      resendMessageOnError: true
    };
  }
}

module.exports = {
  getUserBirthDayAndLocale,
  checkCronJobFinished,
  saveCronJobStatus
};
