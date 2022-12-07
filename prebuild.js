const stealTools = require("steal-tools")
const path = require("path")
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")

const envConfiguration = getEnvConfiguration("prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

let config = {}

if (envConfiguration.stealConfig) {
  config = readJsonSync(envConfiguration.stealConfig)
}

main()

async function main() {
  await stealTools.build(config, {
    bundleSteal: true,
    dest: path.join(distDir, "dist"),
  })
}
