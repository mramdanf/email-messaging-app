const { body } = require('express-validator');

function createAndUpdateRules(controllerFunc, additionalRules = []) {
  return [
    '/',
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('email').isEmail(),
    body('birthDayDate').isDate({ format: 'YYYY-MM-DD' }),
    ...additionalRules,
    controllerFunc
  ];
}

module.exports = {
  createAndUpdateRules
};
