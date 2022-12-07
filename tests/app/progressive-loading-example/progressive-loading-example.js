import StacheElement from "can-stache-element"
import route from "can-route"
import { ssgDefineElement } from "../../../client-helpers/ssg-helpers.js"

class ProgressiveLoadingExample extends StacheElement {
  static view = `
    <h3>Progressive Loading Route</h3>
    <div>
      <a data-testid="nested-root" href="{{ routeUrl(nestedPage='root') }}">Root</a>
      <a data-testid="nested-timeout" href="{{ routeUrl(nestedPage='nested-timeout') }}">Nested Timeout</a>
      <a data-testid="nested-request" href="{{ routeUrl(nestedPage='nested-request') }}">Nested Request</a>
    </div>
    <p data-testid="nested-page-tracker">The current nestedPage is {{ this.nestedPage }}.</p>
    {{# if(this.componentToShow.isPending) }}
        <h2>Nested Route Loading...</h2>
    {{/ if }}
    {{# if(this.componentToShow.isRejected) }}
      <h2>Rejected {{ componentToShow.reason }}</h2>
    {{/ if }}
    {{# if(this.componentToShow.isResolved) }}
      {{ componentToShow.value }}
    {{/ if }}
  `

  static props = {
    routeData: {
      get default() {
        return route.data || "root"
      },
    },
  }

  get nestedPage() {
    return this.routeData.nestedPage || "root"
  }

  get componentToShow() {
    switch (this.nestedPage) {
      case "root":
        const root = document.createElement("h4")
        root.innerHTML = "Nested Root Route"
        return Promise.resolve(root)
      case "nested-request":
        return steal.import(`tests/app/progressive-loading-example/nested-request-example/nested-request-example`).then(() => {
          return document.createElement("can-nested-request-example")
        })
      case "nested-timeout":
        return steal.import(`tests/app/progressive-loading-example/nested-timeout-example/nested-timeout-example`).then(() => {
          return document.createElement("can-nested-timeout-example")
        })
      default:
        const unknown = document.createElement("h4")
        unknown.innerHTML = "Nested Unknown Route"
        return Promise.resolve(unknown)
    }
  }
}

ssgDefineElement("can-progressive-loading-example", ProgressiveLoadingExample)
