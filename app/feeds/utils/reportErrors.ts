export function reportError(
  location: string,
  url: string | URL,
  options: unknown,
  ...other: unknown[]
) {
  console.error(
    `ERROR:     ${location}
  Failed to fetch ${url.toString ? url.toString() : url}`,
    options,
    other,
  )

  throw new Error(
    `ERROR:     ${location}
  Failed to fetch ${url.toString ? url.toString() : url}`,
  )
}
