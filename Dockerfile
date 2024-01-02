FROM node:20.9.0-alpine3.17

## Build application from source
ENV WORKDIR=/var/www/eunoia
ENV NODE_ENV=production

WORKDIR $WORKDIR

COPY server/package.json .

RUN npm install

COPY server/ .

COPY client/ .

COPY make_dist.sh .

RUN make_dist.sh

CMD ["node", "index.js"]