const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', body('firstName').not().isEmpty(), userController.createUser);

module.exports = router;
