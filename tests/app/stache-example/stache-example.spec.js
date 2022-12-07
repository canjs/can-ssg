// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("StacheExampleApp", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)
  })

  test("homepage uses stache files", async ({ page }) => {
    const header = page.getByTestId("stache-test")

    await expect(header).toHaveText("Using app.stache works!")
  })
})
