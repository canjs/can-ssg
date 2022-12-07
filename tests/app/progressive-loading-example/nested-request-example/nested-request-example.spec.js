// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../../helpers/wait-for-hydration")

test.describe("NestedRequestExample", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/progressive-loading/nested-request")

    await waitForHydration(page)
  })

  test("label should update", async ({ page }) => {
    await page.getByText("before request")
    const label = await page.getByText("iPhone X")

    await expect(label).toHaveText("iPhone X")
  })
})
