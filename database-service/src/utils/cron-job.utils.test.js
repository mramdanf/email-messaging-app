const {
  cronSendBirthDayMessage,
  cronResendMessageOnError
} = require('./cron-job.utils');
const { checkCronJobFinished } = require('./cron.utils');

jest.mock('./cron.utils');
jest.mock('./send-message.utils');

describe('cron send birth day message', () => {
  beforeEach(() => jest.clearAllMocks());
  it('will not tirgger send message if prev cron job unfinished', async () => {
    const mockLog = jest.fn();
    console.log = mockLog;

    checkCronJobFinished.mockReturnValueOnce({
      sendBirthDayMessage: { finished: false }
    });
    await cronSendBirthDayMessage();

    expect(mockLog).toHaveBeenNthCalledWith(
      1,
      'cancel sending message, prev job not finished yet.'
    );
  });

  it('will tirgger send message if prev cron job finished', async () => {
    const mockLog = jest.fn();
    console.log = mockLog;

    checkCronJobFinished.mockReturnValueOnce({
      sendBirthDayMessage: { finished: true }
    });
    await cronSendBirthDayMessage();

    expect(mockLog).toHaveBeenNthCalledWith(
      2,
      'send birthday message scheduler running...'
    );
  });
});

describe('cron resend message on error', () => {
  beforeEach(() => jest.clearAllMocks());
  it('will not tirgger resend message if prev cron job unfinished', async () => {
    const mockLog = jest.fn();
    console.log = mockLog;

    checkCronJobFinished.mockReturnValueOnce({
      resendingMessageOnError: { finished: false }
    });
    await cronResendMessageOnError();

    expect(mockLog).toHaveBeenNthCalledWith(
      1,
      'cancel resending message on error, prev job not finished yet.'
    );
  });

  it('will tirgger resend message if prev cron job finished', async () => {
    const mockLog = jest.fn();
    console.log = mockLog;

    checkCronJobFinished.mockReturnValueOnce({
      resendingMessageOnError: { finished: true }
    });
    await cronResendMessageOnError();

    expect(mockLog).toHaveBeenNthCalledWith(
      2,
      'resend message scheduler running...'
    );
  });
});
