const { execSync } = require("child_process")
const fs = require("fs")

let version
if (process.argv[2] === "--dev") {
  version = "development"
} else {
  version = execSync("git rev-parse --short HEAD").toString().replace("\n", "")
  console.log("current Commit Hash is " + version)
}
fs.writeFileSync(
  "./lib/config/version.ts",
  `const version = "${version}"
export default version`
)
