const path = require("path")

/**
 * Returns SSG configuration
 */
let cachedSsgConfiguration
const getSsgConfiguration = () => {
  if (!cachedSsgConfiguration) {
    const ssgConfiguration = require(path.join(process.cwd(), "ssg.json"))
    // Make configuration immutable
    Object.freeze(ssgConfiguration)
    cachedSsgConfiguration = ssgConfiguration
  }
  return cachedSsgConfiguration
}

/**
 * Returns environment configuration
 */
const getEnvConfiguration = (env) => {
  const configuration = getSsgConfiguration().environments[env]

  if (!configuration) {
    throw new Error("Unexpected missing environment configuration")
  }

  return configuration
}

/**
 * Returns list of environments
 */
const getEnvironments = () => Object.keys(getSsgConfiguration().environments)

/**
 * Returns routes for a given environment. If the environment doesn't have any routes,
 * it will return the general configuration's routes
 */
const getEnvRoutes = (env) => {
  const envConfiguration = getEnvConfiguration(env)

  if (envConfiguration.routes) {
    return envConfiguration.routes
  }

  return getSsgConfiguration().routes || []
}

/**
 * Returns assets for a given environment. If the environment doesn't have any assets,
 * it will return the general configuration's assets
 */
const getEnvAssets = (env) => {
  const envConfiguration = getEnvConfiguration(env)

  if (envConfiguration.assets) {
    return envConfiguration.assets
  }

  return getSsgConfiguration().assets || []
}

module.exports = { getSsgConfiguration, getEnvConfiguration, getEnvironments, getEnvRoutes, getEnvAssets }
