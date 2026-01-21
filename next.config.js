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
}
module.exports = withBlitz(config)
