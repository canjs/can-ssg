// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../helpers/wait-for-hydration")

test.describe("main", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)
  })

  test("homepage has `Playwright is awesome` in title", async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright is awesome/)

    const app = page.locator("can-app")

    await expect(app).toBeTruthy()
  })

  test("homepage has header `Hello Playwright`", async ({ page }) => {
    const header = page.locator("h1")

    await expect(header).toHaveText("Hello Playwright")
  })
})
