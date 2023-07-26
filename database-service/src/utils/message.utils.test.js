const models = require('../models');
const { MESSAGE_TYPES } = require('../contants');
const { findMessageByType } = require('./message.utils');

jest.mock('../models');

describe('find message by types', () => {
  it('renturn correct value on success', async () => {
    models.Messages.findOne.mockReturnValueOnce({ id: 1 });
    const res = await findMessageByType(MESSAGE_TYPES.BIRTH_DAY);

    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(res.message.id).toBe(1);
  });

  it('renturn correct value on error', async () => {
    models.Messages.findOne.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const res = await findMessageByType(MESSAGE_TYPES.BIRTH_DAY);

    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
    expect(res.message.id).toBeFalsy();
  });
});
