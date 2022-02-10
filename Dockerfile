FROM node:16-slim AS base

WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN awk '/},/ { p = 0 } { if (!p) { print $0 } } /"devDependencies":/ { p = 1 }' package.json > package.json.tmp \
  && mv package.json.tmp package.json \
  && yarn install --prod --frozen-lockfile \
  && yarn cache clean && rm -rf ~/.cache/*

FROM node:16-slim AS build
WORKDIR /usr/src/app

ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates
COPY package.json yarn.lock ./
COPY db/ ./db/
RUN yarn install --frozen-lockfile --prefer-offline && yarn blitz prisma migrate deploy ; yarn cache clean && rm -rf ~/.cache/*

COPY . .
RUN yarn build

FROM base AS prod
COPY --from=build /usr/src/app/public /usr/src/app/public
COPY --from=build /usr/src/app/.next /usr/src/app/.next
COPY --from=build /usr/src/app/db /usr/src/app/db
COPY --from=build /usr/src/app/.blitz.config.compiled.js /usr/src/app/.blitz.config.compiled.js
COPY --from=build /usr/src/app/node_modules/.prisma/client /usr/src/app/node_modules/.prisma/client

RUN apt-get update && apt-get install -y --no-install-recommends openssl && yarn add prisma@3.9.1
# unsure why but works now

EXPOSE 3000

CMD yarn start -p 3000
