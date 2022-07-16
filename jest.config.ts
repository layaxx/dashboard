import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "blitz",
  globalSetup: "./test/globalSetup.ts",
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
}

export default config
