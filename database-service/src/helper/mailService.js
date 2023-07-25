/* eslint-disable import/no-extraneous-dependencies */
const axios = require('axios');

const baseUrl = 'https://email-service.digitalenvision.com.au';

async function sendMail(payload) {
  return axios.post(`${baseUrl}/send-email`, payload, {
    headers: {
      'Content-type': 'application/json'
    }
  });
}

module.exports = {
  sendMail
};
