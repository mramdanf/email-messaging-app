const get = require('lodash/get');
const cronUtils = require('./cron.utils');
const userUtils = require('./user.utils');
const messageUtils = require('./message.utils');
const messageLogUtils = require('./message-log.utils');
const mailUtils = require('./mail.utils');
const { sendBirthDayMessage } = require('./send-message.utils');

jest.mock('./cron.utils');
jest.mock('./user.utils');
jest.mock('./message.utils');
jest.mock('./message-log.utils');
jest.mock('./mail.utils');

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

describe('send birth day message', () => {
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
