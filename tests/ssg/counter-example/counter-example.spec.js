// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../../helpers/verify-still-prerendered")
const waitForHydrationToBeSkipped = require("../../helpers/wait-for-hydration-to-be-skipped")

test.describe("CounterExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")

    await waitForHydrationToBeSkipped(page)
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
  })

  test("prerendered increment button doesn't increment since it's not hydrated", async ({ page }) => {
    const label = await page.getByTestId("counter")

    await expect(label).toHaveText("0")

    const button = await page.getByTestId("counter-button")

    await button.click()

    // Counter shouldn't change since this is still prerendered
    await expect(label).toHaveText("0")
  })
})
