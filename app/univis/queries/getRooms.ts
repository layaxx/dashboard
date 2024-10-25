import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { UnivISClient } from "univis-api"
import { z } from "zod"

const client = new UnivISClient({ domain: "univis.uni-bamberg.de" })

const Input = z.object({
  room: z.string(),
})

export default resolver.pipe(resolver.zod(Input), async ({ room }) => {
  const response = await client.request("rooms", { name: room })
  const rooms = response.UnivIS.Room

  if (!rooms) throw new NotFoundError("Room not found")

  return { rooms: Array.isArray(rooms) ? rooms : [rooms] }
})
