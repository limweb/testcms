
#  FROM node:10.16.3-alpine as install
#  WORKDIR /usr/src/app
#  COPY package.json      /usr/src/app
#  RUN npm install
# FROM install as build
#  COPY ./components   /usr/src/app
#  COPY ./lib   /usr/src/app
#  COPY ./pages   /usr/src/app
#  COPY ./public   /usr/src/app
#  COPY ./services   /usr/src/app
#  COPY ./static   /usr/src/app
#  COPY ./temp   /usr/src/app
#  COPY ./util   /usr/src/app
#  COPY ./.env   /usr/src/app
#  COPY ./.env.demo   /usr/src/app
#  COPY ./.env.dev   /usr/src/app
#  COPY ./next.config.js   /usr/src/app
#  COPY ./.env.production   /usr/src/app

# EXPOSE 3000
# CMD npm run start

FROM node:10.16.3-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
# RUN npm run build:production
EXPOSE 3000
CMD npm run start
