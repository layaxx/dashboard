export async function reportErrorWebhook(data: unknown) {
  return fetch("/api/reportError", { method: "POST", body: JSON.stringify(data) }).catch(
    (error) => {
      console.error("Failed to report error", error)
    }
  )
}
