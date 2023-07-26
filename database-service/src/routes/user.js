const express = require('express');
const { body, query } = require('express-validator');
const { createAndUpdateRules } = require('../utils/misc.utils');

const router = express.Router();
const userController = require('../controllers/userController');

const userIdRules = body('userId')
  .not()
  .isEmpty()
  .withMessage('Should not be empty')
  .isNumeric()
  .withMessage('Should be numeric');

router.post(...createAndUpdateRules(userController.createUser));
router.put(...createAndUpdateRules(userController.updateUser, [userIdRules]));
router.delete('/', userIdRules, userController.deleteUser);

router.get(
  '/by-birthday',
  query('date').isDate({ format: 'YYYY-MM-DD' }),
  userController.getUsersByBirthDay
);

module.exports = router;
