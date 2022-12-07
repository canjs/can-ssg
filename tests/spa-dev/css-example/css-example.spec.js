// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("CssExample", () => {
  test("css affects page", async ({ page }) => {
    // Avoid race conditions by using Promise.all
    await Promise.all([
      page.waitForResponse("/tests/app/css-example/css-example.css"),
      page.goto("/css").then(() => {
        return waitForHydration(page)
      }),
    ])

    const header = page.getByTestId("css-test")

    const initialColor = await header.evaluate((el) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(initialColor).toBe("rgb(255, 165, 0)") // "orange"
  })
})
