export function reportError(location: string, url: string | URL, options: any, ...other: any) {
  console.error(
    `ERROR:     ${location}
  Tried to fetch ${url.toString ? url.toString() : url}`,
    options,
    other
  )
  return { ok: false }
}
