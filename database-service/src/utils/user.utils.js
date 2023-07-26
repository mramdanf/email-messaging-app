const moment = require('moment-timezone');
const { User } = require('../models');

async function findAllUsers() {
  try {
    const users = await User.findAll();
    return {
      error: false,
      users,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      users: [],
      errorMessage: error.toString()
    };
  }
}

async function createUser(payload) {
  try {
    const user = await User.create({ ...payload });
    return {
      error: false,
      errorMessage: '',
      user
    };
  } catch (error) {
    return {
      error: true,
      errorMessage: error.toString(),
      user: {}
    };
  }
}

async function deleteUserById(userId) {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: userId
      }
    });

    if (!deletedUser) {
      return {
        error: true,
        errorMessage: `No user found with id ${userId}`,
        code: 404
      };
    }

    return {
      error: false,
      errorMessage: '',
      code: 200
    };
  } catch (error) {
    return {
      error: true,
      errorMessage: error.toString(),
      code: 500
    };
  }
}

function getUserBirthDayAndLocale(user) {
  const birthDay = {
    month: moment(user.birthDayDate).month() + 1,
    date: moment(user.birthDayDate).date()
  };

  const locale = {
    month: moment().tz(user.location).month() + 1,
    date: moment().tz(user.location).date(),
    hour: moment().tz(user.location).hour(),
    year: moment().tz(user.location).year()
  };

  return {
    birthDay,
    locale
  };
}

module.exports = {
  findAllUsers,
  getUserBirthDayAndLocale,
  createUser,
  deleteUserById
};
