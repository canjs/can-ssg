const stealTools = require("steal-tools")
const path = require("path")
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")
const { readJsonSync } = require("fs-extra")

main()

async function main() {
  const envConfiguration = await getEnvConfiguration("prod")

  const distDir = path.join("dist", envConfiguration.dist.basePath)

  let config = {}

  if (envConfiguration.stealConfig) {
    if (typeof envConfiguration.stealConfig === "string") {
      config = readJsonSync(envConfiguration.stealConfig)
    } else {
      config = envConfiguration.stealConfig
    }
  }

  await stealTools.build(config, {
    bundleSteal: true,
    dest: path.join(distDir, "dist"),
  })
}
