FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG APP_PORT

ENV APP_PORT=${APP_PORT}

CMD [ "npm", "start" ]