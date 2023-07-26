require('dotenv').config();
const express = require('express');

const mainRouter = require('./routes');

const app = express();

app.use(express.json());
app.use('/', mainRouter);

const port = process.env.APP_PORT || 3001;
app.listen(port, () => {
  console.log(`email service listening on port ${port}`);
});
