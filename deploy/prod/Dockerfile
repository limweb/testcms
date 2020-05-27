FROM node:10.16.3-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
# RUN npm run build:production
EXPOSE 3000
CMD npm run start