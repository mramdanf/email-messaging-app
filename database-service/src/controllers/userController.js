const { validationResult } = require('express-validator');
const { User } = require('../models');

async function createUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: true, errors: errors.array() });
      return;
    }

    const user = await User.create(req.body);
    res.status(200).json({
      error: false,
      message: 'Successfully create new user.',
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.toString() });
  }
}

module.exports = {
  createUser
};
