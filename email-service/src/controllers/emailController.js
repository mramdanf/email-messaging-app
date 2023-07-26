const { validationResult } = require('express-validator');
const { faker } = require('@faker-js/faker');
const moment = require('moment');

async function sendEmail(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: true, errorMessage: errors.array() });
    return;
  }

  const shouldResponseError = faker.helpers.maybe(() => true, {
    probability: 0.1
  });
  if (shouldResponseError) {
    res.status(500).json({
      error: true,
      errorMessage: 'Internal server error'
    });
    return;
  }

  const shouldTimeOut = faker.helpers.maybe(() => true, { probability: 0.1 });
  if (shouldTimeOut) {
    await setTimeout(() => {
      res.end();
    }, 100000);
    return;
  }

  res.status(200).json({
    status: 'sent',
    sentTime: moment().toISOString()
  });
}

module.exports = {
  sendEmail
};
