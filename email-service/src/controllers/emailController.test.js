const expressValidator = require('express-validator');
const faker = require('@faker-js/faker');
const { sendEmail } = require('./emailController');

jest.mock('express-validator');
jest.mock('@faker-js/faker', () => ({
  ...jest.requireActual('@faker-js/faker'),
  faker: {
    ...jest.requireActual('@faker-js/faker').faker,
    helpers: {
      maybe: jest.fn()
    }
  }
}));

describe('send email', () => {
  it('return 400 on invalid input', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([])
    });

    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    await sendEmail({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('able to return 500', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });

    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    faker.faker.helpers.maybe.mockReturnValueOnce(true);

    await sendEmail({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

  it('able to simulate time out', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });

    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);
    const mockResEnd = jest.fn();
    mockRes.end = mockResEnd;

    faker.faker.helpers.maybe.mockReturnValueOnce(false);
    faker.faker.helpers.maybe.mockReturnValueOnce(true);

    jest.useFakeTimers();

    await sendEmail({}, mockRes);
    jest.runAllTimers();

    expect(mockResEnd).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
