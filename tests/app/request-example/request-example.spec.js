// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("RequestExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before request")
    const label = await page.getByText("iPhone 9")

    await expect(label).toHaveText("iPhone 9")
  })
})
