const fs = require('fs/promises');
const path = require('path');
const get = require('lodash/get');
const { CRON_STATUS_TYPE } = require('../contants');

function getCronJobStatusFile(type) {
  return path.join(process.cwd(), 'src', 'data', `cron-status-${type}.json`);
}

async function checkCronJobFinished(type) {
  const filePath = getCronJobStatusFile(type);
  try {
    const fileData = await fs.readFile(filePath);
    const data = JSON.parse(fileData);
    return {
      ...(type === CRON_STATUS_TYPE.SEND_BIRTHDAY
        ? {
            sendBirthDayMessage: {
              finished: get(data, 'sendBirthDayMessage.finished', true)
            }
          }
        : {}),
      ...(type === CRON_STATUS_TYPE.RESEND_BIRTHDAY
        ? {
            resendingMessageOnError: {
              finished: get(data, 'resendingMessageOnError.finished', true)
            }
          }
        : {})
    };
  } catch (error) {
    return {
      ...(type === CRON_STATUS_TYPE.SEND_BIRTHDAY
        ? {
            sendBirthDayMessage: {
              finished: true
            }
          }
        : {}),
      ...(type === CRON_STATUS_TYPE.RESEND_BIRTHDAY
        ? {
            resendingMessageOnError: {
              finished: true
            }
          }
        : {})
    };
  }
}

async function saveCronJobStatus(data) {
  try {
    const { type, ...rest } = data;
    await fs.writeFile(
      getCronJobStatusFile(type),
      JSON.stringify(rest, null, '\t')
    );
  } catch (error) {
    console.log(error);
  }
}

async function saveCronStatusSendBirtdayMessage(finished) {
  await saveCronJobStatus({
    sendBirthDayMessage: { finished },
    type: CRON_STATUS_TYPE.SEND_BIRTHDAY
  });
}

async function saveCronStatusResendBirtdayMessage(finished) {
  await saveCronJobStatus({
    sendBirthDayMessage: { finished },
    type: CRON_STATUS_TYPE.RESEND_BIRTHDAY
  });
}

module.exports = {
  saveCronStatusSendBirtdayMessage,
  saveCronStatusResendBirtdayMessage,
  checkCronJobFinished,
  saveCronJobStatus
};
