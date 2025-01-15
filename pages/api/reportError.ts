import { BlitzLogger } from "blitz"
import { getSession } from "@blitzjs/auth"
import dayjs from "dayjs"
import { NextApiHandler } from "next"
import { api } from "app/blitz-server"
import {
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_OK,
  HTTP_SERVICE_UNAVAILABLE,
} from "lib/serverOnly/consts"

const logger = BlitzLogger({ name: "/api/reportError" })

const handler: NextApiHandler = async (request, response) => {
  const session = await getSession(request, response)

  if (!session.userId) {
    logger.warn("denied Access to /api/loadRSS")
    return response.status(HTTP_FORBIDDEN).send("Please log in to use this API route")
  }

  if (!process.env.ERROR_REPORT_WEBHOOK) {
    logger.error("No error reporting webhook configured")
    return response.status(HTTP_SERVICE_UNAVAILABLE).send("No error reporting webhook configured")
  }

  let url
  try {
    url = new URL(process.env.ERROR_REPORT_WEBHOOK)
  } catch (error) {
    logger.error("Failed to parse URL", error)
    return response
      .status(HTTP_SERVICE_UNAVAILABLE)
      .send("Error reporting is not configured properly")
  }

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      text: `## Error report from the Dashboard Deployment
      ${dayjs().format("YYYY-MM-DD HH:mm:ss")}

      ${JSON.stringify(request.body, undefined, 2)}`,
    }),
  }).catch((error) => {
    logger.error("Failed to report error", error)
    return response.status(HTTP_INTERNAL_SERVER_ERROR).send("Failed to report error")
  })

  response.status(HTTP_OK).send("Successfully reported error")
}
export default api(handler)
