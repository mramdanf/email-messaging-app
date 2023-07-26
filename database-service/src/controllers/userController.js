const { validationResult } = require('express-validator');
const { User } = require('../models');
const {
  createUser: createUserUtil,
  deleteUserById
} = require('../utils/user.utils');

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: true, errors: errors.array() });
    return;
  }

  const { error, user, errorMessage } = await createUserUtil(req.body);
  if (error) {
    res.status(500).json({ error, errorMessage });
    return;
  }

  res.status(200).json({
    error,
    errorMessage: '',
    user
  });
}

async function deleteUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: true, errors: errors.array() });
    return;
  }

  const { userId } = req.body;
  const { error, errorMessage, code } = await deleteUserById(userId);
  if (error) {
    res.status(code).json({
      error,
      errorMessage
    });
    return;
  }

  res.status(200).json({
    error,
    errorMessage,
    message: `Successfully delete user with id ${userId}`
  });
}

async function updateUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: true, errors: errors.array() });
      return;
    }

    const { userId, ...rest } = req.body;

    await User.update(
      { ...rest },
      {
        where: {
          id: userId
        }
      }
    );
    res.status(200).json({
      error: false,
      message: `Successfully update the user with id ${userId}`
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.toString() });
  }
}

module.exports = {
  createUser,
  deleteUser,
  updateUser
};
