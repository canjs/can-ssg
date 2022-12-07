// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../../helpers/verify-still-prerendered")

test.describe("NestedTimeoutExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/progressive-loading/nested-timeout")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before nested timeout")
    const label = await page.getByText("after nested timeout")

    await expect(label).toHaveText("after nested timeout")
  })
})
