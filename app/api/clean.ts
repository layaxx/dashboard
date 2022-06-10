import { BlitzApiRequest, BlitzApiResponse, getSession } from "blitz"

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

  /* TODO:  delete already read entries that are older than X
            delete status entries other tha last X (30 maybe? 50?) */

  /*TODO:   More generally:   - Overview over recently read articles
                              - Options to  - add feed
                                            - edit feed
                                            - remove feed
  */

  response.statusCode = 200
  response.setHeader("Content-Type", "application/json")
  response.end(JSON.stringify({ response: "Hello World" }, undefined, 2))
}
export default handler
