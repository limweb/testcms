FROM node:10.16.3-alpine as install
WORKDIR /usr/src/app
COPY ./package.json  /usr/src/app
COPY ./node_modules /usr/src/app
RUN npm install
EXPOSE 3000
CMD npm run start
