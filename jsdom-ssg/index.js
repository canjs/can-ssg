const { ensureDir, emptyDir, copy, writeFile, readFile } = require("fs-extra")
const path = require("path")
const spawnBuildProcess = require("./spawn-build-process")
const { getEnvConfiguration, getEnvRoutes, getEnvAssets } = require("../client-helpers/environment-helpers")
const spawn = require("./util/spawn-promise")
const getEnvironment = require("./flags/get-ssg-environment")
const stripMainScript = require("./util/strip-main-script")

/**
 * Builds static pages for application
 */
module.exports = async function main(options) {
  const environment = await getEnvironment(options.environment)

  // Get ssg configuration based on environment
  const envConfiguration = await getEnvConfiguration(environment)

  // Get root of dist based on environment
  const distDir = path.join("dist", envConfiguration.dist.basePath)

  await clearDist(distDir)

  const promises = []

  promises.push(generateSpaEntryPoint(environment, envConfiguration, distDir))
  promises.push(copyAssets(environment, envConfiguration, distDir))

  await Promise.all(promises)

  // Check for prebuild property for environment to prepare static pages
  // Useful for preparing production bundles with `steal-tools`
  if (envConfiguration.prebuild) {
    await spawn("node", envConfiguration.prebuild.split(" "))
  }

  await generateStaticPages(environment, envConfiguration)

  // Check for postbuild property for environment to finalize static pages
  // Useful for copying assets / bundles to each static page directory
  // Also can be used to inject code into each index.html file
  if (envConfiguration.postbuild) {
    await spawn("node", envConfiguration.postbuild.split(" "))
  }
}

/**
 * Create and clear dist directory
 */
async function clearDist(distDir) {
  await ensureDir(distDir)
  await emptyDir(distDir)
}

/**
 * Copy assets to dist
 */
async function copyAssets(environment, envConfiguration, distDir) {
  const baseAssetsDistPath = envConfiguration.dist.assets ? path.join(distDir, envConfiguration.dist.assets) : distDir
  const promises = []

  const assets = await getEnvAssets(environment)

  for (const assetPath of assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)

    promises.push(copy(assetPath, assetsDistPathInDist))
  }

  await Promise.all(promises)
}

/**
 * Generate static pages
 */
async function generateStaticPages(environment, envConfiguration) {
  // Read paths to generate static pages
  const routes = await getEnvRoutes(environment)

  // Generate static pages
  const promises = []

  const baseUrl = envConfiguration.staticBaseUrl

  for (const route of routes) {
    promises.push(spawnBuildProcess(`${baseUrl}${path.join("/", route)}`))
  }

  await Promise.all(promises)
}

/**
 * Generate SPA entry point, commonly an index.html
 */
async function generateSpaEntryPoint(environment, envConfiguration, distDir) {
  const entryPointPath = path.join(distDir, envConfiguration.dist.entryPoint || "index.html")

  // If there is a mainTag defined, override steal/main script from original entryPoint
  if (envConfiguration.dist.mainTag) {
    const rootCode = stripMainScript(envConfiguration.entryPoint).rootCode

    await writeFile(entryPointPath, rootCode.replace("</body>", envConfiguration.dist.mainTag + "</body>"))
    return
  }

  const rootCode = await readFile(envConfiguration.entryPoint)

  await writeFile(entryPointPath, rootCode)
}
