const { Messages } = require('../models');

async function findMessageByType(messageType) {
  try {
    const message = await Messages.findOne({
      where: {
        messageType
      }
    });
    return {
      error: false,
      message,
      errorMessage: ''
    };
  } catch (error) {
    return {
      error: true,
      message: {},
      errorMessage: error.toString()
    };
  }
}

module.exports = {
  findMessageByType
};
