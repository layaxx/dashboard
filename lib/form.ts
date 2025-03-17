export function makeParseFunction(
  type: string
): (value: string, name: string) => string | number | null {
  if (type === "number") return (v) => (v === "" ? "" : Number(v))

  // eslint-disable-next-line unicorn/no-null
  return (v) => (v === "" ? null : v)
}
