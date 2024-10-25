import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { UnivISClient } from "univis-api"
import { z } from "zod"

const client = new UnivISClient({ domain: "univis.uni-bamberg.de" })

const Input = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(Input), async ({ id }) => {
  const response = await client.request("rooms", { id })
  const rooms = response.UnivIS.Room

  if (!rooms) throw new NotFoundError("Room not found")
  if (Array.isArray(rooms) && rooms.length > 0)
    throw new NotFoundError("Room not uniquely identified")

  return { room: Array.isArray(rooms) ? rooms.at(0) : rooms }
})
