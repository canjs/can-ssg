import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../../client-helpers/ssg-helpers.js"

class NestedTimeoutExample extends StacheElement {
  static view = `
    <p data-testid="nested-timeout-example">{{ this.label }}</p>
  `

  static props = {
    label: "before nested timeout",
  }

  connected() {
    setTimeout(() => {
      this.label = "after nested timeout"
    }, 500)
  }
}

ssgDefineElement("can-nested-timeout-example", NestedTimeoutExample)
