FROM node:20.9.0-alpine3.17

## Build application from source
ENV WORKDIR=/var/www/eunoia/server
ENV NODE_ENV=production

WORKDIR $WORKDIR

COPY package.json .

RUN npm install --production

COPY . .

CMD ["node", "index.js"]