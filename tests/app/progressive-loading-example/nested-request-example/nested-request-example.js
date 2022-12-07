import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../../client-helpers/ssg-helpers.js"

class NestedRequestExample extends StacheElement {
  static view = `
    <p data-testid="nested-request-example">
      {{# if(this.request.isPending) }}
        before nested request
      {{/ if }}
      {{# if(this.request.isRejected) }}
        Rejected {{ this.request.reason }}
      {{/ if }}
      {{# if(this.request.isResolved) }}
        {{ this.request.value }}
      {{/ if }}
    </p>
  `

  get request() {
    return xhrGet("https://dummyjson.com/products/2").then((res) => {
      return res.title
    })
  }
}

function xhrGet(url) {
  return new Promise((res) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.readyState === req.DONE) {
        if (req.status === 200) {
          res(JSON.parse(req.responseText))
        }
      }
    }
    req.open("GET", url)
    req.send()
  })
}

ssgDefineElement("can-nested-request-example", NestedRequestExample)
