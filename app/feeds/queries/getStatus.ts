import { resolver } from "blitz"
import dayjs from "dayjs"
import db from "db"

export interface IStatusResult {
  averageLoadTimeInMilliSeconds: number
  averageMinutesBetweenLoads: number
  minutesSinceLastLoad: number
  count: number
  errors: string[]
}

export default resolver.pipe(resolver.authorize(), async () => {
  const status = await db.statusLoad.aggregate({
    take: 10,
    orderBy: { createdAt: "desc" },
    _avg: { loadDuration: true },
    _count: { id: true },
    _min: { loadTime: true },
    _max: { loadTime: true },
  })

  const errors = await db.statusLoad.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { errors: true },
  })

  const allErrors = errors.flatMap((object) => object.errors)

  const results: IStatusResult = {
    averageLoadTimeInMilliSeconds: status._avg.loadDuration ?? Number.MAX_VALUE,
    averageMinutesBetweenLoads:
      dayjs(status._max.loadTime).diff(dayjs(status._min.loadTime), "minutes") / status._count.id,
    minutesSinceLastLoad: dayjs().diff(dayjs(status._max.loadTime), "minutes"),
    count: status._count.id,
    errors: allErrors,
  } as const

  return results
})
