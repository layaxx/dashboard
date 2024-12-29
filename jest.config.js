const nextJest = require("@blitzjs/next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["./test/globalSetup.ts"],
  collectCoverageFrom: [
    "lib/**/*.{js,jsx,ts,tsx}",
    "!lib/config/**/*",
    "integration/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "mailers/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/*.test.{js,jsx,ts,tsx}",
  ],
  testTimeout: 30_000,
}

module.exports = createJestConfig(customJestConfig)
