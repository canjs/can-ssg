import StacheElement from "can-stache-element"
import "./css-example.css"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class CssExample extends StacheElement {
  static view = `
    <h3>CSS Route</h3>
    <p data-testid="css-test" class="css-test">Does css work?</p>
  `
}

ssgDefineElement("can-css-example", CssExample)
