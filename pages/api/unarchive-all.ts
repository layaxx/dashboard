import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import db from "db"

const logger = BlitzLogger({ name: "/api/unarchive-all" })

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (!session.userId) {
    if (process.env.API_TOKEN && request.headers["api-token"] === process.env.API_TOKEN) {
      logger.info("Access to /api/unarchive-all granted due to valid api token")
    } else {
      logger.warn("Access to /api/unarchive-all denied")
      response.statusCode = 403
      response.statusMessage = "Please log in to use this API route"
      response.end()
      return
    }
  }

  try {
    const result = await db.feedentry
      .updateMany({
        where: { isArchived: true },
        data: { isArchived: false },
      })
      .then(({ count }) => {
        logger.info(`Unarchived ${count} feed entries`)
        return count
      })

    response.statusCode = 200
    response.end(`Unarchived ${result} entries`)
  } catch {
    response.statusCode = 500
    response.end(`An error occurred during unarchiving entries`)
  }
}
export default api(handler)
