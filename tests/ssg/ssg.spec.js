// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../helpers/verify-still-prerendered")
const verifyIfHydrated = require("../helpers/verify-if-hydrated")
const waitForHydration = require("../helpers/wait-for-hydration")
const waitForHydrationToBeSkipped = require("../helpers/wait-for-hydration-to-be-skipped")

test.describe("ssg helpers", () => {
  test("verify hydration prevention", async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")

    await waitForHydrationToBeSkipped(page)

    const getGlobalFlagsScript = await page.evaluate(() => {
      // assuming that the scripts to set global flags are at the top of the html inside of head
      return document.getElementsByTagName("script")[0].innerHTML.replace(/\s|\t|\n/g, "")
    })

    expect(getGlobalFlagsScript).toBe("globalThis.canStacheElementInertPrerendered=true;globalThis.canMooStache=true;")

    const app = page.locator("can-app")

    await expect(app).toBeTruthy()

    expect(await verifyStillPrerendered(page)).toBe(true)

    const currentStateOfGlobalFlags = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    expect(currentStateOfGlobalFlags).toBe(true)
  })

  test("verify detecting hydration", async ({ page }) => {
    await page.goto("/")

    const getGlobalFlagsScript = await page.evaluate(() => {
      // assuming that the scripts to set global flags are at the top of the html inside of head
      return document.getElementsByTagName("script")[0].innerHTML.replace(/\s|\t|\n/g, "")
    })

    expect(getGlobalFlagsScript).toBe("globalThis.canStacheElementInertPrerendered=true;globalThis.canMooStache=true;")

    await waitForHydration(page)

    expect(await verifyIfHydrated(page)).toBe(true)

    const currentStateOfGlobalFlags = await page.evaluate(() => {
      return globalThis.canStacheElementInertPrerendered && globalThis.canMooStache
    })

    // flags should be undefined and not false since they are removed from window
    expect(currentStateOfGlobalFlags).toBeUndefined()
  })
})
