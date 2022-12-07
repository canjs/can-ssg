import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class CounterExample extends StacheElement {
  static view = `
    <p data-testid="counter">{{ this.count }}</p>
    <button data-testid="counter-button" on:click='this.increment()'>+1</button>
  `

  static props = {
    count: 0,
  }

  increment() {
    this.count++
  }
}

ssgDefineElement("can-counter-example", CounterExample)
