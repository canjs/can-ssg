/*
scrape.js

loads :defined elements in an iframe, copies them into parent dom and replaces
the :not(:defined) ssg can-app with the live version from the iframe

children are also live 

new ones are also :defined

// TODO: make sure hydrated ones use top level router! (currently doesn't work)

*/

const steal = require("steal")
const setupGlobals = require("./setup-globals")
const { outputFile, existsSync, readFileSync, mkdirSync } = require("fs-extra")

// Get url from args
const args = process.argv.slice(2)
const url = args[0] || "http://127.0.0.1:5501"

// Throw if build takes too long
const timeout = setTimeout(() => {
  throw new Error("timed out ):")
}, 5000).unref()

/**
 * Wait for process to become idle (no async tasks are pending)
 *
 * This is when it is safe to scrape document
 */
process.once("beforeExit", (code) => {
  clearTimeout(timeout)

  // TODO: should we consider code? code === 0?
  scrapeDocument()
})

// Setup JSDOM and global.window, global.document, global.location
let captureSteal = ""
let rootCode = ""

if (existsSync("index.html")) {
  rootCode = readFileSync("index.html", { encoding: "utf8", flag: "r" }) // project"s index.html
    .replace(/(<script[^>]*steal\/steal.*?>.*?<\/script>)/i, (_, stealTag) => {
      captureSteal = stealTag
      return "" // remove steal script tag (re-injected before exit)
    })

  if (!/^<!doctype/i.test(rootCode)) {
    rootCode = "<!doctype html>" + rootCode
  }

  if (rootCode.indexOf("<can-app") === -1) {
    if (rootCode.indexOf("</body") !== -1) {
      rootCode = rootCode.replace("</body", "<can-app></can-app></body")
    } else {
      rootCode += "<can-app></can-app>"
    }
  }
} else {
  rootCode = `<!doctype html><title>CanJS and StealJS</title><can-app></can-app>`
  captureSteal = `<script src="/node_modules/steal/steal.js" main></script>`
}

setupGlobals(rootCode, url)

async function populateDocument() {
  // Run client-side code
  await steal.startup() // loads canjs app
  // disable jsdom script tags?

  console.log("steal - done")
}
populateDocument()

const inject = `
  <script>
    (() => {
      const thisScriptEl = document.currentScript
      const hydrationFrame = document.head.insertBefore(
        Object.assign(
          document.createElement("iframe"),
          {
            id: "canjs-hydration-frame",
            src: "http://localhost:8080/index.html" // TODO: route to current url but not the static version
          }
        ),
        thisScriptEl
      )
      const hydrationWindow = hydrationFrame.contentWindow
  
      const HydrationElement = hydrationWindow.HTMLElement
  
      hydrationWindow.HTMLElement = function HTMLElement () {
        if (new.target.__proto__ === HTMLElement) {
          new.target.__proto__ = globalThis.HTMLElement
        }
        return Reflect.construct(
          HydrationElement,
          arguments,
          new.target
        )
      }
      hydrationWindow.HTMLElement.prototype = HTMLElement.prototype
      hydrationWindow.HTMLElement.__proto__ = Element
  
      const defineQueue = []
      const originalCEDefine = customElements.define
      customElements.define = function () {
        defineQueue.push(arguments)
      }
  
      // hydrationFrame.addEventListener("load", () => {
      setTimeout(() => {
        console.log("LOADED")

        // repalce static app with hydrated already rendered live app
        document.querySelector("can-app").replaceWith(
          document.adoptNode(
            hydrationWindow.document.querySelector("can-app")
          )
        )
  
        // register all the elements that were meant to be registered
        defineQueue.forEach(def => originalCEDefine.apply(customElements, def))
        // now new elements inserted in dom will be upgraded

        // cleanup and restore original define fn
        defineQueue.length = 0
        customElements.define = originalCEDefine

        // document.getElementById("canjs-hydration-frame").remove() // don't. will downgrade the hydrated els
        thisScriptEl.remove()
      }, 2500)
    })()
  </script>
`

/**
 * Once async tasks are completed, scrap document into dist
 */
async function scrapeDocument() {
  // Write scrapped dom to dist
  // window.document.documentElement.outerHTML;
  let html = window.document.documentElement.outerHTML

  // re-inject steal before closing of head tag
  html = html.replace(/(<head[^>]*>)/, "$1" + inject)
  html = html.replace("</head>", captureSteal + "</head>")
  html = html.replace("</body>", "<foobar-test></foobar-test></body>")

  await outputFile(`dist/ssg/${getFilename(url)}.html`, html)
}

/**
 * Create filename based on url
 *
 * TODO: consider query params
 */
function getFilename(url) {
  const path = url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9 /]/g, "_")
    .replace(/^[^/]*?(\/|$)/, "")
  // const [, ...rest] = url.replace("http://", "").replace("https://", "").split("/");

  return path || "index"
}
