import { BlitzLogger } from "blitz"
import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from "@blitzjs/auth"
import { setupBlitzServer } from "@blitzjs/next"
import { authConfig } from "./blitz-client"
import db from "db"

BlitzLogger().info("Starting server...")
export const { gSSP, gSP, api, useAuthenticatedBlitzContext } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
})
