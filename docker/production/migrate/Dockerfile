# 1. Install dependencies only when needed
FROM node:20-slim AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN corepack enable && yarn --immutable

# 2. Rebuild the source code only when needed
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl git
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.production.local .env.production

RUN corepack enable


