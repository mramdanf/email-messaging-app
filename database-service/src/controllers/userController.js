const { validationResult } = require('express-validator');
const {
  createUser: createUserUtil,
  deleteUserById,
  updateUserById
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
  const { error, errorMessage, code, message } = await deleteUserById(userId);
  if (error) {
    res.status(code).json({
      error,
      errorMessage
    });
    return;
  }

  res.status(code).json({
    error,
    errorMessage,
    message
  });
}

async function updateUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: true, errors: errors.array() });
      return;
    }

    const { error, errorMessage, code, message } = await updateUserById(
      req.body
    );
    if (error) {
      res.status(code).json({
        error,
        errorMessage
      });
      return;
    }

    res.status(code).json({
      error,
      message,
      errorMessage
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
