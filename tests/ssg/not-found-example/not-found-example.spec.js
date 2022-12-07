// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("NotFoundExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("load image from assets", async ({ page }) => {
    // Avoid race conditions by using Promise.all
    await Promise.all([page.waitForResponse("/tests/app/assets/not-found-image.png"), page.goto("/not-a-route")])
  })
})
