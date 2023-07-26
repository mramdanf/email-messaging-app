const axios = require('axios');
const { sendMail } = require('./mail.utils');

jest.mock('axios');

describe('send mail', () => {
  it('return correct value on success', async () => {
    axios.post.mockImplementation(() => ({
      data: { status: 'sent', sentTime: '2023-07-25 13:00:20' }
    }));
    const res = await sendMail({
      user: {
        email: 'test@test.com',
        firstName: 'ramdan',
        lastName: 'firdaus'
      },
      message: {
        messages: 'Hi {full_name}, it`s your birthday'
      }
    });

    expect(res.data.status).toBe('sent');
  });

  it('return correct value on error', async () => {
    axios.post.mockImplementation(() => {
      throw new Error('some error');
    });
    const res = await sendMail({
      user: {
        email: 'test@test.com',
        firstName: 'ramdan',
        lastName: 'firdaus'
      },
      message: {
        messages: 'Hi {full_name}, it`s your birthday'
      }
    });

    expect(res.error).toBeTruthy();
  });
});
