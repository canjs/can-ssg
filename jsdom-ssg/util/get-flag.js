const { getSsgConfiguration } = require("../../client-helpers/environment-helpers")
const argv = require("optimist").argv

/**
 * Check for flag value then once a value is found, it is set as a process env variable
 *
 * Order:
 * 1. process.env:
 * ```
 * SSG_ENVIRONMENT=prod node jsdom-ssg
 * ```
 *
 * 2. node argument:
 * ```
 * node jsdom-ssg --environment prod
 * ```
 *
 * 3. ssgConfigurationProp:
 * ```
 * // ssg.json
 * { defaultEnv: "prod", ... }
 * ```
 */
module.exports = function (processEnv, argument, ssgConfigurationProp) {
  const value = getProcessEnvValue(processEnv) || getArgumentValue(argument) || getSsgConfigurationDefault(ssgConfigurationProp)

  if (!value) {
    throw new Error(`Unexpected missing flag value: ${value}`)
  }

  // Set process env variable so that further node processes can pick up that flag value
  process.env[processEnv] = value
  return value
}

/**
 * Get flag value by process env variable
 */
function getProcessEnvValue(processEnv) {
  if (!processEnv) {
    throw new Error(`Unexpected missing process env variable name: ${processEnv}`)
  }

  return process.env[processEnv]
}

/**
 * Get flag value by node argument
 */
function getArgumentValue(argument) {
  if (!argument) {
    return
  }

  return argv[argument]
}

/**
 * Get flag value by checking SSG configuration
 */
function getSsgConfigurationDefault(prop) {
  if (!prop) {
    return
  }

  return getSsgConfiguration()[prop]
}
