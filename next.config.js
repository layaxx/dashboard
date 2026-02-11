const { withBlitz } = require("@blitzjs/next")

const config = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/feeds",
        destination: "/feeds/rss",
        permanent: true,
      },
    ]
  },
  output: "standalone",
  env: {
    NEXT_PUBLIC_TARGET_TIME_BETWEEN_LOADS:
      process.env.NEXT_PUBLIC_TARGET_TIME_BETWEEN_LOADS || "10",
  },
}
module.exports = withBlitz(config)
