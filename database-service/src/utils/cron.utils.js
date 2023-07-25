const fs = require('fs/promises');
const path = require('path');
const get = require('lodash/get');

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
  checkCronJobFinished,
  saveCronJobStatus
};
