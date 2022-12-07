const getFlag = require("../util/get-flag")

/**
 * Determines which environment to build/serve, i.e. dev, prod, etc
 */
module.exports = function () {
  return getFlag("SSG_ENVIRONMENT", "environment", "defaultEnv")
}
