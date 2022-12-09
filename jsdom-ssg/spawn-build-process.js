const path = require("path")
const spawn = require("./util/spawn-promise")

const baseUrl = "http://127.0.0.1:8080/index.html"

let debugport = 9228

module.exports = async function (url = baseUrl) {
  const baseArgs = process.env.DEBUG_WORKERS ? [`--inspect-brk=${++debugport}`] : []
  const args = [...baseArgs, path.join(__dirname, "scrape.js"), "--url", url]

  return spawn("node", args)
}
