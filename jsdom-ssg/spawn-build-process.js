const path = require("path")
const spawn = require("./util/spawn-promise")

const baseUrl = "http://127.0.0.1:8080/index.html"

module.exports = async function (url = baseUrl) {
  const args = [path.join(__dirname, "scrape.js"), "--url", url]

  return spawn("node", args)
}
