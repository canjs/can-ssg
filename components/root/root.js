import StacheElement from "can-stache-element"
import { ssgDefineElement } from "../../client-helpers/ssg-helpers"
import route from "can-route"
import "can-stache-route-helpers"
// import "../moo/moo"// We shouldn't import these since they're progressively loaded
// import "../cow/cow"// We shouldn't import these since they're progressively loaded
import "./root.css"

export class Root extends StacheElement {
  static view = `
    <a href="{{ routeUrl(loadId='cow') }}">Cow</a> <a href="{{ routeUrl(loadId='moo') }}">Moo</a> <a href="{{ routeUrl(loadId='root') }}">Root</a>

    {{# if(this.comp.isPending) }}
        <h2>Loading...</h2>
    {{/ if }}
    {{# if(this.comp.isRejected) }}
      <h2>Rejected {{ comp.reason }}</h2>
    {{/ if }}
    {{# if(this.comp.isResolved) }}
        {{ comp.value }}
    {{/ if }}
  `

  static props = {
    routeData: {
      get default() {
        return route.data
      },
    },
  }

  get comp() {
    const loadId = this.routeData.loadId
    console.log("route.data.loadId", loadId)

    if (!loadId || loadId === "root") {
      const root = document.createElement("h2")
      root.innerHTML = "Welcome Root"
      return Promise.resolve(root)
    }

    if (loadId === "moo") {
      return steal.import(`can-ssg/components/moo/moo`).then(() => {
        return document.createElement("progressive-moo")
      })
    }

    if (loadId === "cow") {
      return steal.import(`can-ssg/components/cow/cow`).then(() => {
        return document.createElement("progressive-cow")
      })
    }

    const unknown = document.createElement("h2")
    unknown.innerHTML = "Progressive Loading 404"
    return Promise.resolve(unknown)
  }
}

ssgDefineElement("progressive-root", Root)
