FROM node:16-alpine as base

WORKDIR /usr/src/app

ENV NODE_ENV=production
RUN apk update && apk add git
COPY package.json yarn.lock ./
COPY db/ ./db/
RUN yarn install --frozen-lockfile && yarn blitz prisma migrate deploy && yarn cache clean && rm -rf ~/.cache/*

COPY . .
RUN yarn build

EXPOSE 3000

CMD yarn start -p 3000
