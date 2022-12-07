import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"
import "./not-found-example.css"

class NotFoundExample extends StacheElement {
  static view = `
    <h3>Not Found Route</h3>
    <img data-testid="not-found-image" src="/tests/app/assets/not-found-image.png">
  `
}

ssgDefineElement("can-not-found-example", NotFoundExample)
