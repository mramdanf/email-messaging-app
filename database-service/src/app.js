require('dotenv').config();
const express = require('express');

const usersRouter = require('./routes/user');
const sendingMessagesRouter = require('./routes/sendingMessage');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/send-message', sendingMessagesRouter);

app.get('/', (req, res) => {
  res.json({ message: JSON.stringify(process.env) });
});

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on http://localhost:${port}`);
});
