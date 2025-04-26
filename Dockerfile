FROM node:20 AS base
RUN npm install --global dotenv-cli
RUN npm i -g @nestjs/cli
WORKDIR /app
COPY package.json yarn.lock ./


FROM base AS builder
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run prisma:generate 
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]