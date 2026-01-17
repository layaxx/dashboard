import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import seed from "db/seeds"

const logger = BlitzLogger({ name: "/api/demo/seed" })

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (process.env.NEXT_PUBLIC_IS_DEMO_MODE !== "true") {
    logger.warn("/api/demo/seed called but demo mode is not active")
    response.statusCode = 403
    response.statusMessage = "Demo mode is not active"
    response.end()
    return
  }

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      logger.info("Access to /api/demo/seed granted due to valid api token")
    } else {
      logger.warn("Access to /api/demo/seed denied")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  try {
    await seed()

    response.statusCode = 200
    response.end(`Seeded demo data successfully`)
  } catch {
    response.statusCode = 500
    response.end(`An error occurred during seeding demo data`)
  }
}
export default api(handler)
