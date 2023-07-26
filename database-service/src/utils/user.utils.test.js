const {
  findAllUsers,
  getUserBirthDayAndLocale,
  createUser,
  deleteUserById,
  updateUserById
} = require('./user.utils');
const models = require('../models');

jest.mock('../models');

describe('findAllUsers function', () => {
  it('return all users if no error', async () => {
    models.User.findAll.mockReturnValue([{ id: 1, firstName: 'ramdan' }]);
    const res = await findAllUsers();
    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(res.users.length).toBeTruthy();
  });

  it('return grecefully on error', async () => {
    models.User.findAll.mockImplementation(() => {
      throw new Error('some db error');
    });
    const res = await findAllUsers();
    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
    expect(res.users.length).toBeFalsy();
  });
});

describe('get user birth day and locale data', () => {
  it('return correct value', () => {
    const res = getUserBirthDayAndLocale({
      birthDayDate: '1994-08-05',
      location: 'Asia/Jakarta'
    });
    Object.keys(res.birthDay).forEach((key) => {
      expect(res.birthDay[key]).toBeTruthy();
    });
    Object.keys(res.locale).forEach((key) => {
      expect(res.locale[key]).toBeTruthy();
    });
  });
});

describe('create user', () => {
  it('no success', async () => {
    models.User.create.mockReturnValue({ id: 1, firstName: 'ramdan' });
    const res = await createUser();
    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(Object.keys(res.user).length).toBeTruthy();
  });

  it('on error', async () => {
    models.User.create.mockImplementation(() => {
      throw new Error('some db error');
    });
    const res = await createUser();
    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
    expect(Object.keys(res.user).length).toBeFalsy();
  });
});

describe('delete user by id', () => {
  it('on success', async () => {
    models.User.destroy.mockReturnValue(1);
    const res = await deleteUserById(1);
    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
  });

  it('on error', async () => {
    models.User.destroy.mockImplementation(() => {
      throw new Error('some db error');
    });
    const res = await deleteUserById(1);
    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
  });

  it('on user not found', async () => {
    models.User.destroy.mockReturnValue(0);
    const res = await deleteUserById(10);
    expect(res.error).toBeTruthy();
    expect(res.errorMessage).toBeTruthy();
  });
});

describe('update user by id', () => {
  it('on success', async () => {
    models.User.update.mockReturnValue(1);
    const res = await updateUserById({ userId: 1, firstName: 'test' });
    expect(res.error).toBeFalsy();
    expect(res.errorMessage).toBeFalsy();
    expect(res.code).toBe(200);
    expect(res.message).toBeTruthy();
  });

  it('on error', async () => {
    models.User.update.mockImplementation(() => {
      throw new Error('some db error');
    });
    const res = await updateUserById(1);
    expect(res.error).toBeTruthy();
    expect(res.code).toBe(500);
    expect(res.errorMessage).toBeTruthy();
    expect(res.message).toBeFalsy();
  });

  it('on user not found', async () => {
    models.User.update.mockReturnValue(0);
    const res = await updateUserById({ userId: 2, firstName: 'test' });
    expect(res.error).toBeTruthy();
    expect(res.code).toBe(404);
    expect(res.message).toBeFalsy();
    expect(res.errorMessage).toBeTruthy();
  });
});
