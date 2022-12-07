const express = require("express")
const path = require("path")
const { existsSync } = require("fs-extra")
const { getEnvironments, getEnvConfiguration } = require("./client-helpers/environment-helpers")
const argv = require("optimist").argv
const app = express()
const defaultEnvironment = require("./jsdom-ssg/flags/get-ssg-environment")()
const serverMode = require("./jsdom-ssg/flags/get-server-mode")()

// ssg configuration based on environment
let staticDir = ""
let entryPointDir = ""
let envConfiguration = null

setEnvDirs(defaultEnvironment)

const sendFileOr404 = (req, res, reqPath) => {
  const dest = path.join(__dirname, reqPath)

  if (existsSync(dest)) {
    res.sendFile(dest)
  } else {
    res.status(404)
    res.sendFile(path.join(__dirname, staticDir, "/404/index.html"))
  }
}

const environments = getEnvironments()

app.get("/*", function (req, res) {
  const reqPath = req.path

  const overrideEnvironment = environments.find((env) => reqPath.startsWith(`/${env}`))

  if (overrideEnvironment) {
    setEnvDirs(overrideEnvironment)
    reqPath.replace(`/${overrideEnvironment}`, "")
  }

  // Handle files that are local (node_modules, etc) by checking for file extensions (".")
  if (reqPath.indexOf(".") !== -1) {
    // Simulate hosting all assets, bundles at one directory inside the dist directory
    if (envConfiguration.serveFromDist) {
      sendFileOr404(req, res, path.join(staticDir, reqPath))
      return
    }

    // Serve static files from dist, but assets, node_modules/bundles are loaded outside of dist
    sendFileOr404(req, res, reqPath)

    return
  }

  if (overrideEnvironment || serverMode === "spa") {
    sendFileOr404(req, res, entryPointDir)
    return
  }

  // Host static files
  if (serverMode === "ssg") {
    sendFileOr404(req, res, path.join(staticDir, reqPath, "index.html"))
    return
  }
})

// Handle 404 - Keep this as a last route
app.use(function (req, res, next) {
  res.status(404)
  res.send("404: File Not Found")
})

app.listen(argv.port || 8080, function () {
  console.log("Example app listening on port " + argv.port || 8080)
})

/**
 * Gets environment configuration and overrides global configurations for server
 */
function setEnvDirs(environment) {
  const configuration = getEnvConfiguration(environment)
  envConfiguration = configuration

  const basePath = path.join("dist", configuration.dist.basePath)

  staticDir = path.join(basePath, envConfiguration.dist.static)
  entryPointDir = envConfiguration.serveFromDist ? path.join(basePath, envConfiguration.dist.entryPoint) : envConfiguration.entryPoint

  console.log("server environment:", environment, "mode:", serverMode)
}
