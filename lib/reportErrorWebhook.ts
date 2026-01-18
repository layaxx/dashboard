export async function reportErrorWebhook(data: unknown) {
  console.error("webhook-reporting", data)
  return fetch("/api/reportError", { method: "GET" }).catch((error) => {
    console.error("Failed to report error", error)
  })
}
