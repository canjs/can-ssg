// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("NotFoundExample", () => {
  test("load image from assets", async ({ page }) => {
    // Avoid race conditions by using Promise.all
    await Promise.all([
      page.waitForResponse("/tests/app/assets/not-found-image.png"),
      page.goto("/not-a-route").then(() => {
        return waitForHydration(page)
      }),
    ])
  })
})
