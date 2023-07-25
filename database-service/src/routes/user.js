const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const userController = require('../controllers/userController');

const userIdRules = body('userId')
  .not()
  .isEmpty()
  .withMessage('Should not be empty')
  .isNumeric()
  .withMessage('Should be numeric');

const createAndUpdateRules = (controllerFunc, additionalRules = []) => [
  '/',
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('email').isEmail(),
  body('location').matches(/^[A-Z]\w+(\/[A-Z]\w+)+$/gm),
  body('birthDayDate').isDate({ format: 'YYYY-MM-DD' }),
  ...additionalRules,
  controllerFunc
];

router.post(...createAndUpdateRules(userController.createUser));

router.delete('/', userIdRules, userController.deleteUser);

router.put(...createAndUpdateRules(userController.updateUser, [userIdRules]));

module.exports = router;
