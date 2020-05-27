FROM node:10.16.3-alpine as install
WORKDIR /usr/src/app
COPY ./package.json  /usr/src/app
COPY ./node_modules /usr/src/app

FROM install as build
COPY ./.env  /usr/src/app
COPY ./.next  /usr/src/app
COPY ./Dockerfile  /usr/src/app
COPY ./Dockerfile.ok  /usr/src/app
COPY ./Jenkinsfile  /usr/src/app
COPY ./Jenkinsfile-demo  /usr/src/app
COPY ./components  /usr/src/app
COPY ./deploy  /usr/src/app
COPY ./lib  /usr/src/app
COPY ./next.config.js  /usr/src/app
COPY ./pages  /usr/src/app
COPY ./public  /usr/src/app
COPY ./services  /usr/src/app
COPY ./static  /usr/src/app
COPY ./temp  /usr/src/app
COPY ./util  /usr/src/app
RUN npm install
EXPOSE 3000
CMD npm run start
