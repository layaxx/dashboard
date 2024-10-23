import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import { UnivISClient } from "univis-api"
import { Room } from "univis-api/dist/tsc/types"
import { z } from "zod"
import { Lecture } from "lib/univis/types"

const client = new UnivISClient({ domain: "univis.uni-bamberg.de" })

const Input = z.object({
  lecture: z.string(),
})

export default resolver.pipe(resolver.zod(Input), async ({ lecture }) => {
  const response = await client.request("lectures", { name: lecture })
  const lectures: Lecture[] = (response.UnivIS as unknown as { Lecture: Lecture[] }).Lecture

  if (!lectures) throw new NotFoundError("No lectures found")

  let rooms: Room[]
  if (!response.UnivIS.Room) {
    rooms = []
  } else {
    rooms = Array.isArray(response.UnivIS.Room) ? response.UnivIS.Room : [response.UnivIS.Room]
  }
  return { lectures: Array.isArray(lectures) ? lectures : [lectures], rooms }
})
