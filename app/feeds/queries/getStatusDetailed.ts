import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const status = await db.status.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  })

  return { status } as const
})
