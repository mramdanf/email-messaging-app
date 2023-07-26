async function sendEmail(req, res) {
  res.status(200).json({
    body: req.body,
    status: 'sent',
    sentTime: '2022-07-01T14:48:00.000Z'
  });
}

module.exports = {
  sendEmail
};
