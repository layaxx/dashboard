import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"
import version from "lib/config/version"

const handler = async (request: BlitzApiRequest, response: BlitzApiResponse) => {
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
export default handler
