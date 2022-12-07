const getFlag = require("../util/get-flag")

/**
 * Determines which mode to serve application: spa, ssg
 *
 * When serving using ssg, you can override to spa
 * by prefixing an environment in the url
 */
module.exports = function () {
  return getFlag("SERVER_MODE", "serverMode", "defaultServerMode")
}
