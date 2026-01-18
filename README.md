# Dashboard

Self-hosted feed/dashboard (+ other utilities) application built with Blitz/Next.js, Prisma and PostgreSQL.

## Overview

This project is mainly a (RSS) feed catcher/reader. It uses Next.js/Blitz for the frontend/backend, Prisma for database modeling, and PostgreSQL as the primary datastore. Docker compose files are included for containerized deployments.

## Key Features

- Feed ingestion and management
- Read lists, read/unread status, and feed entry summaries
- Statistics about feed loading
- an alternative frontend to <univis.uni-bamberg.de> (lecture information for University of Bamberg)

## Repo Layout

- `app/` and `lib/` — application code (components, hooks, utility functions)
- `pages/` the Next Pages
- `db/` — Prisma schema, migrations and seeds
- `docker/` — container deployment configs (demo, staging, production)
- `docker-compose-db-only.yml` — convenience compose file for just the DB

## Demo

A demo deployment is available under <https://demo.dash.y-lang.eu>.
You can log in with (`demo@example.com`, `demo`). The deployment is reset at regular intervals.

## Prerequisites

- Node.js (recommended >= 20)
- Yarn
- optional: Docker & Docker Compose (for running Postgres locally)

## Quickstart (local dev)

### 1. Install dependencies

```bash
yarn
```

### 2. Start Postgres (recommended) using the bundled compose file

```bash
docker-compose -f docker-compose-db-only.yml up -d
```

### 3. Apply Prisma migrations and seed the database

```bash
yarn blitz prisma migrate dev
yarn blitz db seed
```

### 4. Run the app in development

```bash
yarn dev
```

Visit `http://localhost:3000` to open the dashboard.

## Build & Production

Build and start the production server:

```bash
yarn build && yarn start
```

For containerized production, see the files under `docker/production` and the `docker/` directory for compose examples.

## Cron

`crontab -l`

```cron
*/5 \* \* \* _ curl --header "api-token: somesecretstring" https://prod.url/api/loadRSS >/dev/null 2>&1
0 4 * \* * curl --header "api-token: somesecretstring" https://prod.url/api/clean >/dev/null 2>&1
```

## Environment

Create an `.env.local` (or `.env`) in the project root with at least the variables indicated in `.env.example`

Adjust other provider or feature flags as needed.

## Tests

Run the test suite with:

```bash
yarn test
```

## License

See `LICENSE.txt` in the repository root.

## TODO

- [ ] better logging
