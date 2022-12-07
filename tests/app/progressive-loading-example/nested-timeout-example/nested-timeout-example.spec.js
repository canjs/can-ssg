// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../../helpers/wait-for-hydration")

test.describe("NestedTimeoutExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/progressive-loading/nested-timeout")

    await waitForHydration(page)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before nested timeout")
    const label = await page.getByText("after nested timeout")

    await expect(label).toHaveText("after nested timeout")
  })
})
