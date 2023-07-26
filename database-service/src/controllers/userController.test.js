const expressValidator = require('express-validator');
const userUtils = require('../utils/user.utils');
const { createUser } = require('./userController');

jest.mock('../utils/user.utils');
jest.mock('express-validator');

describe('create user', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('response with 400 on invalid request body', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: () => false,
      array: () => []
    });
    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    await createUser({}, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: true,
        errors: []
      })
    );
  });
  it('response with 500 on create user error', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: () => true,
      array: () => []
    });
    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    userUtils.createUser.mockReturnValueOnce({
      error: true,
      errorMessage: 'some error'
    });

    await createUser({}, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: true,
        errorMessage: 'some error'
      })
    );
  });
  it('response with 200 on for happy path', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: () => true,
      array: () => []
    });
    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    userUtils.createUser.mockReturnValueOnce({
      error: false,
      errorMessage: '',
      user: { id: 1 }
    });

    await createUser({}, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: false,
        errorMessage: '',
        user: { id: 1 }
      })
    );
  });
});
