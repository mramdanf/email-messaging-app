const models = require('../models');
const {
  deleteSendMessageLog,
  findSendMessageErrorLog,
  createSendMessageLog,
  checkSendMessageLogByYear
} = require('./message-log.utils');

jest.mock('../models');

describe('delete send message log', () => {
  it('return correct value on success', async () => {
    models.SendingMessagesStatus.destroy.mockReturnValueOnce(1);
    const res = await deleteSendMessageLog({ id: 1 });

    expect(res.error).toBeFalsy();
  });
  it('return correct value on error', async () => {
    models.SendingMessagesStatus.destroy.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const res = await deleteSendMessageLog({ id: 1 });

    expect(res.error).toBeTruthy();
  });
});

describe('find send messages error log', () => {
  it('return correct value on success', async () => {
    models.SendingMessagesStatus.findAll.mockReturnValueOnce([{ id: 1 }]);
    const res = await findSendMessageErrorLog();

    expect(res.error).toBeFalsy();
    expect(res.logs.length).toBeTruthy();
  });

  it('return correct value on error', async () => {
    models.SendingMessagesStatus.findAll.mockImplementationOnce(() => {
      throw new Error('error');
    });
    const res = await findSendMessageErrorLog();

    expect(res.error).toBeTruthy();
    expect(res.logs.length).toBeFalsy();
    expect(res.errorMessage).toBeTruthy();
  });
});

describe('create send message log', () => {
  it('return correct value on success', async () => {
    models.SendingMessagesStatus.create.mockReturnValueOnce(1);
    const params = {
      user: { id: 1, location: 'Asia/Jakarta' },
      message: { id: 1 },
      sendMailResult: {
        error: false,
        data: { sentTime: '2023-07-25' },
        errorMessage: ''
      }
    };
    const res = await createSendMessageLog(params);

    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(res.loggingStatus).toBeTruthy();
  });

  it('return correct value on error', async () => {
    models.SendingMessagesStatus.create.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const params = {
      user: { id: 1, location: 'Asia/Jakarta' },
      message: { id: 1 },
      sendMailResult: {
        error: false,
        data: { sentTime: '2023-07-25' },
        errorMessage: ''
      }
    };
    const res = await createSendMessageLog(params);

    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
    expect(res.loggingStatus).toBeFalsy();
  });
});

describe('check send message log by year', () => {
  it('return correct value on success', async () => {
    models.SendingMessagesStatus.findAll.mockReturnValueOnce([{ id: 1 }]);
    const res = await checkSendMessageLogByYear({
      userId: 1,
      messageId: 1,
      year: 2023
    });

    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(res.sentAlready).toBeTruthy();
  });

  it('return correct value on error', async () => {
    models.SendingMessagesStatus.findAll.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const res = await checkSendMessageLogByYear({
      userId: 1,
      messageId: 1,
      year: 2023
    });

    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
    expect(res.sentAlready).toBeFalsy();
  });
});
