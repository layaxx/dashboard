import { NextRouter } from "next/router"

export const getRedirectionParameters = (router: NextRouter) => {
  const {
    query: { next },
  } = router
  const loginParameters = next
    ? {
        next: getRedirectionPath(next),
      }
    : undefined

  return loginParameters
}

export const getRedirectionPath = (next: string | string[]) => {
  return decodeURIComponent(Array.isArray(next) ? next[0] ?? "/" : next)
}
