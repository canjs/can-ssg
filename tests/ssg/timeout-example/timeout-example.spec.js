// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")

test.describe("TimeoutExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before timeout")
    const label = await page.getByText("after timeout")

    await expect(label).toHaveText("after timeout")
  })
})
