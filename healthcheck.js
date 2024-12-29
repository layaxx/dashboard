const https = require("https")

const url = process.env.URL

callback = function (response) {
  const successStatusCode = 200
  if (response.statusCode !== successStatusCode) {
    throw new Error("Received non 200 status Code from supplied production url: " + url)
  }
  console.warn("[HEALTHCHECK]:    SUCCESS")
}

if (url) {
  try {
    https.request(url, callback).end()
  } catch (error) {
    console.warn("[HEALTHCHECK]:    FAILED")
    throw error
  }
} else {
  console.warn("[HEALTHCHECK]:    skipped due to missing URL env variable.")
}
