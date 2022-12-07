const { spawn: __node_spawn__ } = require("child_process")

/**
 * Promise wrapper for child_process.spawn
 */
module.exports = async function (command, args, options = {}, spawnCallback) {
  return new Promise((resolve, reject) => {
    const spawnInstance = __node_spawn__(command, [...args], {
      stdio: "inherit",
      ...options,
    })

    spawnCallback && spawnCallback(spawnInstance)

    let code
    let error

    const setCode = (_code) => {
      code = _code
    }

    const setError = (_error) => {
      error = _error
    }

    spawnInstance.on("exit", (exitCode) => {
      setCode(exitCode)
    })

    spawnInstance.on("error", (spawnError) => {
      setError(spawnError)
    })

    spawnInstance.on("close", (closeCode) => {
      setCode(closeCode)

      spawnInstance.stdin && spawnInstance.stdin.end()

      if (error) {
        return reject(error)
      }

      if (code === 1) {
        return reject("Unexpected spawn failed. Exit code 1")
      }

      return resolve(code)
    })
  })
}
