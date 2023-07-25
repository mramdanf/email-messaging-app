const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
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

async function deleteUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: true, errors: errors.array() });
      return;
    }

    const { userId } = req.body;

    const deletedUser = await User.destroy({
      where: {
        id: userId
      }
    });

    if (!deletedUser) {
      res
        .status(404)
        .json({ error: true, message: `No user found with id ${userId}` });
      return;
    }

    res.status(200).json({
      error: false,
      message: `Successfully delete user with id ${userId}`
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.toString() });
  }
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

async function getUsersByBirthDay(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: true, errors: errors.array() });
      return;
    }

    const birthDayDate = req.query.date;

    const users = await User.findAll({
      where: {
        birthDayDate: {
          [Op.eq]: new Date(birthDayDate)
        }
      }
    });

    res.status(200).json({
      error: false,
      users
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.toString() });
  }
}

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getUsersByBirthDay
};
