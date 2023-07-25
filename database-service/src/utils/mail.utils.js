const axios = require('axios');

const baseUrl = 'https://email-service.digitalenvision.com.au';

async function sendMail(payload) {
  try {
    const { data } = await axios.post(`${baseUrl}/send-email`, payload, {
      headers: {
        'Content-type': 'application/json'
      }
    });
    return {
      data,
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
