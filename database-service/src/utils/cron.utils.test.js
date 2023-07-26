const fs = require('fs/promises');
const { checkCronJobFinished, saveCronJobStatus } = require('./cron.utils');
const { CRON_STATUS_TYPE } = require('../contants');

jest.mock('fs/promises');

describe('check cron job finished', () => {
  it('return correct value for cron type send birth day', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        sendBirthDayMessage: {
          finished: true
        }
      })
    );
    const res = await checkCronJobFinished(CRON_STATUS_TYPE.SEND_BIRTHDAY);
    expect(res.sendBirthDayMessage.finished).toBeTruthy();
  });

  it('return correct value for cron type resend birth day', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        resendingMessageOnError: {
          finished: true
        }
      })
    );
    const res = await checkCronJobFinished(CRON_STATUS_TYPE.RESEND_BIRTHDAY);
    expect(res.resendingMessageOnError.finished).toBeTruthy();
  });

  it('return default true if file not found (send)', async () => {
    fs.readFile.mockImplementationOnce(() => {
      throw new Error('file not found');
    });
    const res = await checkCronJobFinished(CRON_STATUS_TYPE.SEND_BIRTHDAY);
    expect(res.sendBirthDayMessage.finished).toBeTruthy();
  });

  it('return default true if file not found (resend)', async () => {
    fs.readFile.mockImplementationOnce(() => {
      throw new Error('file not found');
    });
    const res = await checkCronJobFinished(CRON_STATUS_TYPE.RESEND_BIRTHDAY);
    expect(res.resendingMessageOnError.finished).toBeTruthy();
  });
});

describe('save cron job status', () => {
  it('send', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        sendBirthDayMessage: {
          finished: true
        }
      })
    );

    const writeFileMock = jest.fn();
    fs.writeFile = writeFileMock;
    await saveCronJobStatus({
      sendBirthDayMessage: { finished: false },
      type: CRON_STATUS_TYPE.SEND_BIRTHDAY
    });

    expect(
      writeFileMock.mock.calls[0][0].includes(
        `database-service/src/data/cron-status-${CRON_STATUS_TYPE.SEND_BIRTHDAY}.json`
      )
    ).toBeTruthy();
    expect(writeFileMock.mock.calls[0][1]).toBe(
      JSON.stringify(
        {
          sendBirthDayMessage: {
            finished: false
          }
        },
        null,
        '\t'
      )
    );
  });
  it('resend', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        resendingMessageOnError: {
          finished: true
        }
      })
    );

    const writeFileMock = jest.fn();
    fs.writeFile = writeFileMock;
    await saveCronJobStatus({
      resendingMessageOnError: { finished: false },
      type: CRON_STATUS_TYPE.RESEND_BIRTHDAY
    });

    expect(
      writeFileMock.mock.calls[0][0].includes(
        `database-service/src/data/cron-status-${CRON_STATUS_TYPE.RESEND_BIRTHDAY}.json`
      )
    ).toBeTruthy();
    expect(writeFileMock.mock.calls[0][1]).toBe(
      JSON.stringify(
        {
          resendingMessageOnError: {
            finished: false
          }
        },
        null,
        '\t'
      )
    );
  });
});
