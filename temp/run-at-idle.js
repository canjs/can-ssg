const async_hooks = require("async_hooks")
const fs = require("fs")
const { fd } = process.stdout

/**
 * Runs callback once there node script is no longer
 * running async logic.
 *
 * Uses [async_hook](https://nodejs.org/api/async_hooks.html#class-asynchook) internally
 *
 * @deprecated use `process.once("beforeExit", (code) => { ... }` instead
 */
module.exports = function (cb) {
  // Used to track pending asyncIds
  const ids = {}

  const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) {
      ids[asyncId] = true
      // const eid = async_hooks.executionAsyncId();
      // fs.writeSync(fd, `${type}(${asyncId}):` + ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
    },
    destroy(asyncId) {
      delete ids[asyncId]
      // fs.writeSync(fd, `destroy:  ${asyncId}\n`);

      checkIfIdle()
    },
    promiseResolve(asyncId) {
      delete ids[asyncId]
      // fs.writeSync(fd, `promiseResolve:  ${asyncId}\n`);

      checkIfIdle()
    },
  })

  // Start listening for async tasks
  hook.enable()

  function checkIfIdle() {
    // Check if async is pending
    if (Object.keys(ids).length) {
      return
    }

    // Stop listening for async tasks
    hook.disable()

    // fs.writeSync(fd, `async_hooks finished\n`);

    // Call callback
    cb()
  }
}
