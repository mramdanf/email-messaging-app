FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=${APP_PORT}

EXPOSE ${APP_PORT}

RUN npm run db:reset

CMD ["npm", "start"]