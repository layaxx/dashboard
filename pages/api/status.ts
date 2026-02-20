import { BlitzLogger } from "blitz"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import db from "db"
import version from "lib/config/version"

const logger = BlitzLogger({ name: "/api/status" })

const handler = async (_request: NextApiRequest, response: NextApiResponse) => {
  logger.info("Received status check request")
  try {
    // check if db is reachable
    await db.$queryRaw`SELECT 1`
  } catch (error) {
    logger.error("Database connection failed", { error })
    response.statusCode = 503
    response.statusMessage = "Service Unavailable: Database connection failed"
    response.end()
    return
  }

  logger.info("Status check successful")

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ status: "ok", version }))
}
export default api(handler)
