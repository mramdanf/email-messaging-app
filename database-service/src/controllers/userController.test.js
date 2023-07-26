const expressValidator = require('express-validator');
const userUtils = require('../utils/user.utils');
const { createUser, deleteUser, updateUser } = require('./userController');

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

describe('delete user by id', () => {
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

    await deleteUser({}, mockRes);
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

    userUtils.deleteUserById.mockReturnValueOnce({
      error: true,
      errorMessage: 'some error',
      code: 500
    });

    await deleteUser({ body: { userId: 1 } }, mockRes);
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

    userUtils.deleteUserById.mockReturnValueOnce({
      error: false,
      errorMessage: '',
      message: 'Successfully delete user with id 1',
      code: 200
    });

    await deleteUser({ body: { userId: 1 } }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: false,
        errorMessage: '',
        message: 'Successfully delete user with id 1'
      })
    );
  });
});

describe('update user', () => {
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

    await updateUser({}, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: true,
        errors: []
      })
    );
  });
  it('response with 500 on update user error', async () => {
    expressValidator.validationResult.mockReturnValueOnce({
      isEmpty: () => true,
      array: () => []
    });
    const mockRes = {};
    mockRes.json = jest.fn();
    mockRes.status = jest.fn(() => mockRes);

    userUtils.updateUserById.mockReturnValueOnce({
      error: true,
      errorMessage: 'some error',
      code: 500
    });

    await updateUser({ body: { userId: 1, firstName: 'ramdan' } }, mockRes);
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

    userUtils.updateUserById.mockReturnValueOnce({
      error: false,
      errorMessage: '',
      message: 'Successfully update user with id 1',
      code: 200
    });

    await updateUser({ body: { userId: 1, firstName: 'lisda' } }, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(JSON.stringify(mockRes.json.mock.calls[0][0])).toBe(
      JSON.stringify({
        error: false,
        message: 'Successfully update user with id 1',
        errorMessage: ''
      })
    );
  });
});
