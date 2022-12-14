const path = require("path")

/**
 * Returns SSG configuration
 */
let cachedSsgConfigurationPromise
const getSsgConfiguration = async () => {
  if (!cachedSsgConfigurationPromise) {
    cachedSsgConfigurationPromise = Promise.resolve(require(path.join(process.cwd(), "ssg")))
    let ssgConfiguration = await cachedSsgConfigurationPromise
    // Make configuration immutable
    Object.freeze(ssgConfiguration)
  }
  return await cachedSsgConfigurationPromise
}

/**
 * Returns environment configuration
 */
const getEnvConfiguration = async (env) => {
  const configuration = (await getSsgConfiguration()).environments[env]

  if (!configuration) {
    throw new Error("Unexpected missing environment configuration")
  }

  return configuration
}

/**
 * Returns list of environments
 */
const getEnvironments = async () => Object.keys((await getSsgConfiguration()).environments)

/**
 * Returns routes for a given environment. If the environment doesn't have any routes,
 * it will return the general configuration's routes
 */
const getEnvRoutes = async (env) => {
  const envConfiguration = await getEnvConfiguration(env)

  if (envConfiguration.routes) {
    return envConfiguration.routes
  }

  return (await getSsgConfiguration()).routes || []
}

/**
 * Returns assets for a given environment. If the environment doesn't have any assets,
 * it will return the general configuration's assets
 */
const getEnvAssets = async (env) => {
  const envConfiguration = await getEnvConfiguration(env)

  if (envConfiguration.assets) {
    return envConfiguration.assets
  }

  return (await getSsgConfiguration()).assets || []
}

module.exports = { getSsgConfiguration, getEnvConfiguration, getEnvironments, getEnvRoutes, getEnvAssets }
