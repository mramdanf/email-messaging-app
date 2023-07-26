const axios = require('axios');

// const baseUrl = 'https://email-service.digitalenvision.com.au';
const baseUrl = 'http://localhost:3001';

async function sendMail({ user, message }) {
  try {
    const messageBody = message.messages.replace(
      '{full_name}',
      `${user.firstName} ${user.lastName}`
    );
    const payload = {
      email: user.email,
      message: messageBody
    };
    const { data } = await axios.post(`${baseUrl}/send-email`, payload, {
      headers: {
        'Content-type': 'application/json'
      }
    });
    return {
      data: {
        ...data,
        messageBody
      },
      error: false,
      errorMessage: ''
    };
  } catch (error) {
    return {
      data: {},
      error: true,
      errorMessage: error.toString()
    };
  }
}

module.exports = {
  sendMail
};
