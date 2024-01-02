FROM node:20.9.0-alpine3.17

## Build application from source
ENV WORKDIR=/var/www/eunoia/client
ENV NODE_ENV=production

WORKDIR $WORKDIR

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm install serve -g

COPY . .

RUN npm run build

COPY dist .

CMD ["npx", "serve", "dist/", "-p", "4000"]