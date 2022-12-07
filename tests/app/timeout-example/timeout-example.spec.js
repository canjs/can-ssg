// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("TimeoutExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before timeout")
    const label = await page.getByText("after timeout")

    await expect(label).toHaveText("after timeout")
  })
})
