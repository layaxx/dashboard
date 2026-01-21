import { loadEnvConfig } from "@next/env"
import { defineConfig, env } from "prisma/config"

loadEnvConfig(process.cwd())

export default defineConfig({
  schema: "./db/schema.prisma",
  migrations: {
    path: "./db/migrations",
    seed: "tsx ./db/seeds.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
