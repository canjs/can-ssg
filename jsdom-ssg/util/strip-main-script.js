const { existsSync, readFileSync } = require("fs-extra")

/**
 * Removes steal/main script tag from entry point's rootCode.
 * If there is no steal/main script, a default script tag is returned.
 * If there's no html found at entry point, a general `<can-app>` html file is returned.
 */
module.exports = function (entryPointPath) {
  const defaultMain = '<script src="/node_modules/steal/steal.js" main></script>'
  // TODO: should improve this
  // Remove any script where its last attribute is main
  const mainRegex = /<script.*?\s+main(\s*=".*")?\s*><\/script>/

  let rootCode = ""
  let captureMain = ""

  if (!existsSync(entryPointPath)) {
    return {
      rootCode: "<!doctype html><title>CanJS and StealJS</title><can-app></can-app>",
      captureMain: defaultMain,
    }
  }

  rootCode = readFileSync(entryPointPath, { encoding: "utf8", flag: "r" }) // project"s index.html / production.html
    .replace(mainRegex, (mainTag) => {
      captureMain = mainTag
      return "" // remove steal/main script tag (re-injected before exit)
    })

  if (!/^<!doctype/i.test(rootCode)) {
    rootCode = "<!doctype html>" + rootCode
  }

  if (rootCode.indexOf(`<can-app`) === -1) {
    if (rootCode.indexOf("</body") !== -1) {
      rootCode = rootCode.replace("</body", `<can-app></can-app></body`)
    } else {
      rootCode += `<body><can-app></can-app></body>`
    }
  }

  return { rootCode, captureMain: captureMain || defaultMain }
}
