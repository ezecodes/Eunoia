FROM node:20.9.0-alpine3.17
WORKDIR /usr/eunoia/appclient
COPY ./package.json .
RUN npm install --legacy-peer-deps
RUN npm install serve -g
COPY ./ .
