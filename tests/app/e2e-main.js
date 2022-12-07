import StacheElement from "can-stache-element"

import { ssgDefineElement, ssgEnd } from "../../../client-helpers/ssg-helpers.js"

import "./stache-example/stache-example"
import "./route-example/route-example"
import "./counter-example/counter-example"
import "./timeout-example/timeout-example"
import "./request-example/request-example"

class MyApp extends StacheElement {
  static view = `
    <h1>Hello {{ this.name }}</h1>

    <can-route-example></can-route-example>
    <can-stache-example></can-stache-example>
    <can-counter-example></can-counter-example>
    <can-timeout-example></can-timeout-example>
    <can-request-example></can-request-example>
  `

  static props = {
    name: "Playwright",
  }
}

ssgDefineElement("can-app", MyApp)

ssgEnd()
