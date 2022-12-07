// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")
const waitForHydrationToBeSkipped = require("../../helpers/wait-for-hydration-to-be-skipped")

test.describe("CssExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("css affects page", async ({ page }) => {
    // Avoid race conditions by using Promise.all
    await Promise.all([page.waitForResponse("/tests/app/css-example/css-example.css"), page.goto("/css")])

    await waitForHydrationToBeSkipped(page)

    const header = page.getByTestId("css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
