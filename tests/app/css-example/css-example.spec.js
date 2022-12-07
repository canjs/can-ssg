// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("CssExample", () => {
  test("css affects page", async ({ page }) => {
    await page.goto("/css")

    await waitForHydration(page)

    const header = page.getByTestId("css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
