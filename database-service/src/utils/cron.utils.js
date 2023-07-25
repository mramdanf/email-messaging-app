const fs = require('fs/promises');
const path = require('path');
const get = require('lodash/get');

function getCronJobStatusFile() {
  return path.join(process.cwd(), 'src', 'data', 'cronStatus.json');
}

async function checkCronJobFinished() {
  const filePath = getCronJobStatusFile();
  try {
    const fileData = await fs.readFile(filePath);
    const data = JSON.parse(fileData);
    return {
      sendBirthDayMessage: {
        finished: get(data, 'sendBirthDayMessage.finished', true)
      },
      resendingMessageOnError: {
        finished: get(data, 'resendingMessageOnError.finished', true)
      }
    };
  } catch (error) {
    return {
      sendBirthDayMessage: { finished: true },
      resendingMessageOnError: { finished: true }
    };
  }
}

async function saveCronJobStatus(data) {
  try {
    const status = await checkCronJobFinished();
    const allStatus = {
      ...status,
      ...data
    };
    await fs.writeFile(
      getCronJobStatusFile(),
      JSON.stringify(allStatus, null, '\t')
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  checkCronJobFinished,
  saveCronJobStatus
};
