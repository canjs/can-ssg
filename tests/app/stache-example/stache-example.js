import StacheElement from "can-stache-element"
import view from "./stache-example.stache"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class StacheExampleApp extends StacheElement {
  static view = view
}

ssgDefineElement("can-stache-example", StacheExampleApp)
