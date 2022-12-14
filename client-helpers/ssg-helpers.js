import Zone from "can-zone"
import xhrZone from "can-zone/xhr"
import RoutePushstate from "can-route-pushstate"

const sharedZone = new Zone({ plugins: [xhrZone] })
export const ssgDefineElement = (...args) => {
  sharedZone.run(() => customElements.define(...args))
}

/**
 * Configures `can-route` to use pushstate to change the
 * window's pathname instead of the hash
 *
 */
export const prepareRouting = (route) => {
  route.urlData = new RoutePushstate()
}

export const ssgEnd = () => {
  sharedZone
    .run(() => {})
    .then(function (data) {
      if (!globalThis.XHR_CACHE && data.xhr) {
        const temp = document.createElement("div")
        temp.innerHTML = `<script>${data.xhr}</script>`
        document.body.appendChild(temp.lastChild)
      }
    })

  if (globalThis.canStacheElementInertPrerendered) {
    new Zone({
      plugins: [xhrZone],
    })
      .run(function () {
        // Check if global flag is set to skip hydration
        // This is required for testing static pages before hydration during e2e
        if (globalThis.skipHydrationCanStacheElement) {
          return
        }

        delete globalThis.canStacheElementInertPrerendered
        const staticapp = document.querySelector("can-app")
        const temp = document.createElement("div")
        temp.innerHTML = "<can-app></can-app>" // TODO: scrape static attrs from page too
        const liveapp = temp.querySelector("can-app")
        liveapp.style.display = "none"
        staticapp.parentNode.insertBefore(liveapp, staticapp)
        return { staticapp, liveapp }
      })
      .then(function (data) {
        // Sets global flag that indicates that hydration has successfully been skipped
        // This is required for testing static pages before hydration during e2e
        if (!data.result) {
          globalThis.skippedHydrationCanStacheElement = true
          return
        }

        delete globalThis.canMooStache
        const { staticapp, liveapp } = data.result
        staticapp.remove()
        liveapp.style.display = ""
      })
  }
}
