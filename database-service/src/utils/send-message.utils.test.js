const get = require('lodash/get');
const cronUtils = require('./cron.utils');
const userUtils = require('./user.utils');
const messageUtils = require('./message.utils');
const messageLogUtils = require('./message-log.utils');
const mailUtils = require('./mail.utils');
const {
  sendBirthDayMessage,
  resendMessageOnError
} = require('./send-message.utils');

jest.mock('./cron.utils');
jest.mock('./user.utils');
jest.mock('./message.utils');
jest.mock('./message-log.utils');
jest.mock('./mail.utils');

describe('send birth day message', () => {
  function mockCalledFunctions(data) {
    userUtils.findAllUsers.mockReturnValueOnce({
      users: [{ id: 1, firstName: 'ramdan' }],
      error: false
    });
    userUtils.getUserBirthDayAndLocale.mockReturnValueOnce({
      birthDay: {
        month: 2,
        date: 2
      },
      locale: {
        month: 2,
        date: 2,
        hour: 9,
        year: 2023
      },
      ...get(data, 'userBirthDayAndLocale', {})
    });
    messageUtils.findMessageByType.mockReturnValueOnce({
      error: false,
      message: {
        id: 1,
        messages: 'Hi {full_name} it`s your birth day'
      },
      ...get(data, 'findByMessageType', {})
    });
    messageLogUtils.checkSendMessageLogByYear.mockReturnValueOnce({
      sentAlready: false,
      ...get(data, 'messageAlreadySent', {})
    });
    mailUtils.sendMail.mockReturnValueOnce({
      error: false,
      data: {
        status: 'sent',
        sentTime: '2023-07-25 12:00:00'
      },
      ...get(data, 'sendMailResult', {})
    });
    messageLogUtils.createSendMessageLog.mockReturnValueOnce({
      error: false
    });
  }
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('correctly call related function, happy path', async () => {
    // mocking
    mockCalledFunctions();

    // trigger function
    await sendBirthDayMessage(9);

    // matcher
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: false } })
    );
    expect(userUtils.findAllUsers).toHaveBeenCalled();
    expect(userUtils.getUserBirthDayAndLocale).toHaveBeenCalled();
    expect(messageUtils.findMessageByType).toHaveBeenCalled();
    expect(messageLogUtils.checkSendMessageLogByYear).toHaveBeenCalled();
    expect(mailUtils.sendMail).toHaveBeenCalled();
    expect(messageLogUtils.createSendMessageLog).toHaveBeenCalled();
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[1][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: true } })
    );
  });
  it('should not send mail if condition unsatisfied', async () => {
    // is not user birthday
    mockCalledFunctions({
      userBirthDayAndLocale: { birthDay: { month: 1, date: 1 } }
    });

    await sendBirthDayMessage(9);

    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: false } })
    );
    expect(userUtils.findAllUsers).toHaveBeenCalled();
    expect(userUtils.getUserBirthDayAndLocale).toHaveBeenCalled();
    expect(messageUtils.findMessageByType).not.toHaveBeenCalled();
  });
  it('should not send mail if failed to get message detail', async () => {
    mockCalledFunctions({
      findByMessageType: { error: true, errorMessage: 'some error' }
    });

    await sendBirthDayMessage(9);

    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: false } })
    );
    expect(userUtils.findAllUsers).toHaveBeenCalled();
    expect(userUtils.getUserBirthDayAndLocale).toHaveBeenCalled();
    expect(messageUtils.findMessageByType).toHaveBeenCalled();
    expect(messageLogUtils.checkSendMessageLogByYear).not.toHaveBeenCalled();
  });
  it('should not send mail if email already sent', async () => {
    mockCalledFunctions({
      messageAlreadySent: { sentAlready: true }
    });

    await sendBirthDayMessage(9);

    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: false } })
    );
    expect(userUtils.findAllUsers).toHaveBeenCalled();
    expect(userUtils.getUserBirthDayAndLocale).toHaveBeenCalled();
    expect(messageUtils.findMessageByType).toHaveBeenCalled();
    expect(messageLogUtils.checkSendMessageLogByYear).toHaveBeenCalled();
    expect(mailUtils.sendMail).not.toHaveBeenCalled();
  });
  it('should log sending status even if email failed to be sent', async () => {
    mockCalledFunctions({
      sendMailResult: { error: true }
    });

    await sendBirthDayMessage(9);

    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ sendBirthDayMessage: { finished: false } })
    );
    expect(userUtils.findAllUsers).toHaveBeenCalled();
    expect(userUtils.getUserBirthDayAndLocale).toHaveBeenCalled();
    expect(messageUtils.findMessageByType).toHaveBeenCalled();
    expect(messageLogUtils.checkSendMessageLogByYear).toHaveBeenCalled();
    expect(mailUtils.sendMail).toHaveBeenCalled();
    expect(messageLogUtils.createSendMessageLog).toHaveBeenCalled();
  });
});

describe('resend message on error', () => {
  function mockCalledFunctions(data) {
    messageLogUtils.findSendMessageErrorLog.mockReturnValue({
      error: false,
      logs: [
        {
          id: 1,
          messageId: 1,
          user: {
            firstName: 'ramdan',
            lastName: 'firdaus',
            email: 'test@test.com',
            location: 'Asia/Jakarta'
          },
          message: {
            messages: 'Hi {full_name}, it`s your birthday'
          }
        }
      ],
      ...get(data, 'messageErrorLogs', {})
    });

    mailUtils.sendMail.mockReturnValue({
      error: false,
      data: { sentTime: '2023-07-25 12:00:00', messageBody: 'test' },
      ...get(data, 'sendMailResult', {})
    });
    messageLogUtils.createSendMessageLog.mockReturnValue({
      error: false,
      ...get(data, 'logSendingStatus', {})
    });
    messageLogUtils.deleteSendMessageLog.mockReturnValue({
      error: false
    });
  }
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('correctly call related function, happy path', async () => {
    // mock
    mockCalledFunctions();

    // call function
    await resendMessageOnError();

    // matcher
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: false } })
    );
    expect(messageLogUtils.findSendMessageErrorLog).toHaveBeenCalled();
    expect(mailUtils.sendMail).toHaveBeenCalled();
    expect(messageLogUtils.createSendMessageLog).toHaveBeenCalled();
    expect(messageLogUtils.deleteSendMessageLog).toHaveBeenCalled();
    // console.log(cronUtils.saveCronJobStatus.mock.calls[0])
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[1][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: true } })
    );
  });
  it('shold not send mail if there is no message with error', async () => {
    mockCalledFunctions({ messageErrorLogs: { error: true } });

    // call function
    await resendMessageOnError();

    // matcher
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: false } })
    );
    expect(messageLogUtils.findSendMessageErrorLog).toHaveBeenCalled();
    expect(mailUtils.sendMail).not.toHaveBeenCalled();
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[1][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: true } })
    );
  });
  it('do not delete message with error log if send mail still failed', async () => {
    mockCalledFunctions({ sendMailResult: { error: true } });

    // call function
    await resendMessageOnError();

    // matcher
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: false } })
    );
    expect(messageLogUtils.findSendMessageErrorLog).toHaveBeenCalled();
    expect(mailUtils.sendMail).toHaveBeenCalled();
    expect(messageLogUtils.createSendMessageLog).not.toHaveBeenCalled();
    expect(messageLogUtils.deleteSendMessageLog).not.toHaveBeenCalled();
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[1][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: true } })
    );
  });

  it('do not delete message with error log if success message not successfully logged', async () => {
    mockCalledFunctions({ logSendingStatus: { error: true } });

    // call function
    await resendMessageOnError();

    // matcher
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[0][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: false } })
    );
    expect(messageLogUtils.findSendMessageErrorLog).toHaveBeenCalled();
    expect(mailUtils.sendMail).toHaveBeenCalled();
    expect(messageLogUtils.createSendMessageLog).toHaveBeenCalled();
    expect(messageLogUtils.deleteSendMessageLog).not.toHaveBeenCalled();
    expect(JSON.stringify(cronUtils.saveCronJobStatus.mock.calls[1][0])).toBe(
      JSON.stringify({ resendingMessageOnError: { finished: true } })
    );
  });
});
