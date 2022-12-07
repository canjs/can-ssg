const woop = once(function () {
  setTimeout(() => {
    console.log("beforeExit -> setTimeout")
  }, 1000)
})

process.once("beforeExit", (code) => {
  console.log("Process beforeExit event with code: ", code)

  setTimeout(() => {
    console.log("beforeExit -> setTimeout")
    setTimeout(() => {
      console.log("beforeExit -> nested setTimeout")
    }, 1000)
  }, 1000)

  Promise.resolve().then(() => {
    console.log("promises")
    setTimeout(() => {
      console.log("beforeExit -> nested setTimeout")
    }, 1000)
  })
})

process.on("exit", (code) => {
  console.log("Process exit event with code: ", code)
})

console.log("This message is displayed first.")

setTimeout(() => {
  console.log("setTimeout")
}, 1000)

function once(fn, context) {
  var result

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments)
      fn = null
    }

    return result
  }
}
