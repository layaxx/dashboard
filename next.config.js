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
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = withBlitz(config)
