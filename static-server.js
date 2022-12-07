const express = require("express")
const path = require("path")
const argv = require("optimist").argv
const { getEnvConfiguration } = require("./client-helpers/environment-helpers")
const environment = require("./jsdom-ssg/flags/get-ssg-environment")()

const app = express()
const envConfiguration = getEnvConfiguration(environment)
const basePath = path.join("dist", envConfiguration.dist.basePath)

app.use(express.static(path.join(__dirname, basePath, envConfiguration.dist.static)))
app.use("*", express.static(path.join(__dirname, basePath, envConfiguration.dist.static, "404")))

app.listen(argv.port || 8080, function () {
  console.log("Example app listening on port ", argv.port || 8080)
})
