import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const statusLoad = await db.statusLoad.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  })
  const statusClean = await db.statusClean.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  })

  return { statusLoad, statusClean } as const
})
