/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */
const https = require("https")

const url = process.env.URL

const TIMEOUT = 10_000 // 10 seconds
const SUCCESS_STATUS_CODE = 200

const performHealthCheck = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      return reject(new Error("Missing URL environment variable for healthcheck."))
    }

    const request = https.request(url, (response) => {
      // Drain the response stream to allow the request to complete
      response.on("data", () => {})
      response.on("end", () => {
        if (response.statusCode === SUCCESS_STATUS_CODE) {
          resolve()
        } else {
          reject(new Error(`Non-200 status code: ${response.statusCode}`))
        }
      })
    })

    request.on("error", (error) => {
      reject(error)
    })

    // Set a timeout to avoid hanging indefinitely
    request.setTimeout(TIMEOUT, () => {
      request.destroy()
      reject(new Error("Healthcheck request timed out after 10 seconds"))
    })

    request.end()
  })
}

performHealthCheck(url)
  .then(() => {
    console.log("[HEALTHCHECK]: SUCCESS.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[HEALTHCHECK]: FAILED.", error.message)
    process.exit(1)
  })
