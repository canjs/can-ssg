const express = require("express")
const path = require("path")
const argv = require("optimist").argv
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")
const environment = require("./jsdom-ssg/flags/get-ssg-environment")()

main()

async function main() {
  const app = express()
  const envConfiguration = await getEnvConfiguration(await environment)
  const basePath = path.join("dist", envConfiguration.dist.basePath)

  app.use("/package.json", express.static(path.join(process.cwd(), "package.json")))
  app.use("/node_modules", express.static(path.join(process.cwd(), "node_modules")))
  app.use(express.static(path.join(process.cwd(), basePath, envConfiguration.dist.static)))
  app.use("*", express.static(path.join(process.cwd(), basePath, envConfiguration.dist.static, "404")))

  app.listen(argv.port || 8080, function () {
    console.log("Example app listening on port ", argv.port || 8080)
  })
}
