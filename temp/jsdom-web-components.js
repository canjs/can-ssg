/**
 * Experimenting with jsdom:
 *
 * Can you mix muliple windows/documents when defining custom elements
 */
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const dom = new JSDOM(`<!DOCTYPE html>`)

const win = dom.window
const doc = dom.window.document

class MyElement extends win.HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = "<p>Hello World</p>"
  }
}

win.customElements.define("my-element", MyElement)

// doc.body.append(doc.createElement("my-element"));
doc.body.innerHTML = "<my-element></my-element>"

console.log(doc.body.innerHTML)

const dom2 = new JSDOM(`<!DOCTYPE html>`)

const win2 = dom2.window
const doc2 = dom2.window.document

// class MyElement extends win2.HTMLElement {
//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         this.innerHTML = "<p>Hello World</p>";
//     }
// }

win2.customElements.define("my-element", MyElement)

doc2.body.append(doc2.createElement("my-element"))
// doc2.body.innerHTML = '<my-element></my-element>';

console.log(doc2.body.innerHTML)
