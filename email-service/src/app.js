require('dotenv').config();
const express = require('express');
const timeout = require('connect-timeout');

const mainRouter = require('./routes');

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

const app = express();

app.use(timeout('5s'));
app.use(express.json());
app.use(haltOnTimedout);
app.use('/', mainRouter);
app.use(haltOnTimedout);

const port = process.env.APP_PORT || 3001;
app.listen(port, () => {
  console.log(`email service listening on port ${port}`);
});
