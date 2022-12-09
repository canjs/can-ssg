const jsdom = require("jsdom")
const { JSDOM } = jsdom
const { XMLHttpRequest } = require("w3c-xmlhttprequest")

// source: node_modules/can-zone-jsdom/lib/dom.js

/**
 * A lot of logic stolen from `node_modules/can-zone-jsdom/lib/dom.js`
 */
module.exports = async function (html, requestUrl) {
  const dom = new JSDOM(html, {
    url: requestUrl,
  })

  if (!dom.window.location.protocol) {
    dom.window.location.protocol = "http:"
  }

  // TODO: consider overriding headers for accept language
  // if(request.headers && request.headers["accept-language"]) {
  //     dom.navigator.language = request.headers["accept-language"];
  // }

  global.window = dom.window

  // TODO: Figure out how to access `addEventListener` on global/window without stubbing
  global.addEventListener = function () {}
  global.history = dom.window.history

  global.HTMLElement = dom.window.HTMLElement
  global.DocumentFragment = dom.window.DocumentFragment
  global.NodeFilter = dom.window.NodeFilter
  global.customElements = dom.window.customElements
  global.document = dom.window.document
  global.location = dom.window.location
  global.navigator = dom.window.navigator

  global.Node = window.Node

  global.XMLHttpRequest = XMLHttpRequest
}
