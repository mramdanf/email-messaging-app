FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

## Add the wait script to the image
COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN npm install

COPY . .

ARG DB_USERNAME
ARG DB_HOSTNAME
ARG DB_NAME
ARG DB_PASSWORD
ARG DB_DIALECT
ARG DB_PORT

ENV DB_USERNAME=${DB_USERNAME}
ENV DB_HOSTNAME=${DB_HOSTNAME}
ENV DB_NAME=${DB_NAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DIALECT=${DB_DIALECT}
ENV DB_PORT=${DB_PORT}