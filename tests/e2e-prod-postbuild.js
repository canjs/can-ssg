const path = require("path")
const { getEnvConfiguration, getEnvAssets, getEnvRoutes } = require("../client-helpers/environment-helpers")
const { copy } = require("fs-extra")
const getEnvironment = require("../jsdom-ssg/flags/get-ssg-environment.js")

const environment = getEnvironment()
const envConfiguration = getEnvConfiguration("e2e-prod")

const distDir = path.join("dist", envConfiguration.dist.basePath)

main()

async function main() {
  const promises = []

  // Read paths to generate static pages
  const routes = getEnvRoutes(environment)

  const staticPath = path.join(distDir, envConfiguration.dist.static)
  // `steal-tools` prefixes where bundles are created with "dist/bundles"
  // This doesn't appear to be customizable,
  // you can change the path to where this directory will be created, but it must start with "dist/bundles"
  const bundlePath = path.join(distDir, "dist/bundles")

  // Copy `steal-tools` bundles to each static page directory
  // This is required since each page expected a relative path to the bundle
  for (const route of routes) {
    const staticBundlePath = path.join(staticPath, route, "dist/bundles")
    promises.push(copy(bundlePath, staticBundlePath))
  }

  const baseAssetsDistPath = envConfiguration.dist.assets ? path.join(distDir, envConfiguration.dist.assets) : distDir
  const baseStaticAssetsDistPath = envConfiguration.dist.assets ? path.join(staticPath, envConfiguration.dist.assets) : staticPath

  const assets = getEnvAssets(environment)

  // Copy assets to each static page directory
  for (const assetPath of assets) {
    const assetsDistPathInDist = path.join(baseAssetsDistPath, assetPath)
    const staticAssetsDistPathInDist = path.join(baseStaticAssetsDistPath, assetPath)

    promises.push(copy(assetsDistPathInDist, staticAssetsDistPathInDist))
  }

  await Promise.all(promises)
}
