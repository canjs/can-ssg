import StacheElement from "can-stache-element"
import route from "can-route"
import "can-stache-route-helpers"
import { prepareRouting, ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"
import "../css-example/css-example"
import "../not-found-example/not-found-example"
import "../progressive-loading-example/progressive-loading-example"

prepareRouting(route).then(() => {
  // To support express.static, support for trailing `/` must exist
  route.register("{page}", { page: "home" })
  route.register("{page}/", { page: "home" }) // To support trailing `/`
  route.register("progressive-loading/{nestedPage}", { page: "progressive-loading" })
  route.register("progressive-loading/{nestedPage}/", { page: "progressive-loading" }) // To support trailing `/`

  route.start()
})

class RouteExample extends StacheElement {
  static view = `
    <div>
      <a data-testid="home" href="{{ routeUrl(page='home') }}">Home</a>
      <a data-testid="css" href="{{ routeUrl(page='css') }}">Css</a>
      <a data-testid="not-found" href="{{ routeUrl(page='unknown') }}">404</a>
      <a data-testid="progressive-loading" href="{{ routeUrl(page='progressive-loading') }}">Progressive Loading</a>
    </div>
    <p data-testid="page-tracker">The current page is {{ this.routeData.page }}.</p>
    {{ this.componentToShow }}
  `

  static props = {
    routeData: {
      get default() {
        return route.data
      },
    },
  }

  get componentToShow() {
    switch (this.routeData.page) {
      case "home":
        const home = document.createElement("h3")
        home.innerHTML = "Home Route"
        return home
      case "css":
        return document.createElement("can-css-example")
      case "progressive-loading":
        return document.createElement("can-progressive-loading-example")
      default:
        return document.createElement("can-not-found-example")
    }
  }
}

ssgDefineElement("can-route-example", RouteExample)
