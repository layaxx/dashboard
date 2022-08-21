import { getSession } from "@blitzjs/auth"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "app/blitz-server"
import version from "lib/config/version"

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const session = await getSession(request, response)

  if (
    !session.userId &&
    (!request.query.token || !(process.env["API_TOKEN"] === request.query.token))
  ) {
    console.log("denied Access")
    response.statusCode = 403
    response.statusMessage = "Please log in to use this API route"
    return response.end()
  }

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ version }, undefined, 2))
}
export default api(handler)
