// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("CounterExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)
  })

  test("clicking increment button", async ({ page }) => {
    const label = await page.getByTestId("counter")

    await expect(label).toHaveText("0")

    const button = await page.getByTestId("counter-button")

    await button.click()

    await expect(label).toHaveText("1")

    await button.click()

    await expect(label).toHaveText("2")
  })
})
