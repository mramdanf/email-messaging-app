const moment = require('moment-timezone');

function getUserBirthDayAndLocale(user) {
  const birthDay = {
    month: moment(user.birthDayDate).month() + 1,
    date: moment(user.birthDayDate).date()
  };

  const locale = {
    month: moment().tz(user.location).month() + 1,
    date: moment().tz(user.location).date(),
    minute: moment().tz(user.location).minute(),
    hour: moment().tz(user.location).hour(),
    year: moment().tz(user.location).year()
  };

  return {
    birthDay,
    locale
  };
}

module.exports = {
  getUserBirthDayAndLocale
};
