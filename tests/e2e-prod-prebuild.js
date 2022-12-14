const stealTools = require("steal-tools")
const path = require("path")
const { readJsonSync } = require("fs-extra")
const { getEnvConfiguration } = require("../client-helpers/environment-helpers")

main()

async function main() {
  const envConfiguration = await getEnvConfiguration("e2e-prod")

  const distDir = path.join("dist", envConfiguration.dist.basePath)

  let config = {}

  if (envConfiguration.stealConfig) {
    config = readJsonSync(envConfiguration.stealConfig)
  }

  // TODO: switch bundle to e2e bundles instead of temp app's (maybe?)
  stealTools.build(config, {
    bundleSteal: true,
    dest: path.join(distDir, "dist"),
  })
}
