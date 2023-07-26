require('dotenv').config();
const express = require('express');
const timeout = require('connect-timeout');
const fs = require('fs');
const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const mainRouter = require('./routes');

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

const swaggerFilePath = path.join(process.cwd(), 'src', 'swagger.yaml');
const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

const app = express();

app.use(timeout('5s'));
app.use(express.json());
app.use(haltOnTimedout);
app.use('/', mainRouter);
app.use(haltOnTimedout);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.APP_PORT || 3001;
app.listen(port, () => {
  console.log(`email service listening on port ${port}`);
});
