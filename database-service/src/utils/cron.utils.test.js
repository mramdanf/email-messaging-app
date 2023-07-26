const fs = require('fs/promises');
const { checkCronJobFinished, saveCronJobStatus } = require('./cron.utils');

jest.mock('fs/promises');

describe('check cron job finished', () => {
  it('return correct value if cronStatus.json file found', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        sendBirthDayMessage: {
          finished: true
        },
        resendingMessageOnError: {
          finished: true
        }
      })
    );
    const res = await checkCronJobFinished();
    expect(res.sendBirthDayMessage.finished).toBeTruthy();
    expect(res.resendingMessageOnError.finished).toBeTruthy();
  });

  it('return default true if file not found', async () => {
    fs.readFile.mockImplementationOnce(() => {
      throw new Error('file not found');
    });
    const res = await checkCronJobFinished();
    expect(res.sendBirthDayMessage.finished).toBeTruthy();
    expect(res.resendingMessageOnError.finished).toBeTruthy();
  });
});

describe('save cron job status', () => {
  it('will append existing cron status value instead of replace it', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        sendBirthDayMessage: {
          finished: true
        }
      })
    );

    const writeFileMock = jest.fn();
    fs.writeFile = writeFileMock;
    await saveCronJobStatus({ resendingMessageOnError: { finished: false } });

    expect(
      writeFileMock.mock.calls[0][0].includes(
        'database-service/src/data/cronStatus.json'
      )
    ).toBeTruthy();
    expect(writeFileMock.mock.calls[0][1]).toBe(
      JSON.stringify(
        {
          sendBirthDayMessage: {
            finished: true
          },
          resendingMessageOnError: { finished: false }
        },
        null,
        '\t'
      )
    );
  });
  it('will console error if error happened', async () => {
    fs.readFile.mockReturnValueOnce(
      JSON.stringify({
        sendBirthDayMessage: {
          finished: true
        }
      })
    );
    fs.writeFile.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    await saveCronJobStatus({ resendingMessageOnError: { finished: false } });

    expect(mockConsoleError).toHaveBeenCalled();
  });
});
