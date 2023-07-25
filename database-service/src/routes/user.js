const express = require('express');
const { body, query } = require('express-validator');

const router = express.Router();
const userController = require('../controllers/userController');

const userIdRules = body('userId')
  .not()
  .isEmpty()
  .withMessage('Should not be empty')
  .isNumeric()
  .withMessage('Should be numeric');
const userBirthDayRules = body('birthDayDate').isDate({ format: 'YYYY-MM-DD' });

const createAndUpdateRules = (controllerFunc, additionalRules = []) => [
  '/',
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('email').isEmail(),
  userBirthDayRules,
  ...additionalRules,
  controllerFunc
];

router.post(...createAndUpdateRules(userController.createUser));

router.delete('/', userIdRules, userController.deleteUser);

router.put(...createAndUpdateRules(userController.updateUser, [userIdRules]));

router.get(
  '/by-birthday',
  query('date').isDate({ format: 'YYYY-MM-DD' }),
  userController.getUsersByBirthDay
);

module.exports = router;
