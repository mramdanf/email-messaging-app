require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const {
  cronSendBirthDayMessage,
  cronResendMessageOnError
} = require('./utils/cron-job.utils');

const usersRouter = require('./routes/user');

const app = express();

const swaggerFilePath = path.join(process.cwd(), 'src', 'swagger.yaml');
const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

app.use(express.json());
app.use('/users', usersRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

cron.schedule('*/10 * * * * *', cronSendBirthDayMessage);
cron.schedule('*/15 * * * * *', cronResendMessageOnError);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
