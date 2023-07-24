const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const userController = require('../controllers/userController');

router.post(
  '/',
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('email').isEmail(),
  body('location').matches(/^[A-Z]\w+(\/[A-Z]\w+)+$/gm),
  body('birthDayDate').isDate({ format: 'YYYY-MM-DD' }),
  userController.createUser
);

router.delete(
  '/',
  body('userId').not().isEmpty().isNumeric(),
  userController.deleteUser
);

module.exports = router;
