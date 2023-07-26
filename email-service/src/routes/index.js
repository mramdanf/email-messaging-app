const express = require('express');
const { body } = require('express-validator');

const emailController = require('../controllers/emailController');

const router = express.Router();

router.post(
  '/send-email',
  body('email').not().isEmpty().isEmail(),
  emailController.sendEmail
);

module.exports = router;
