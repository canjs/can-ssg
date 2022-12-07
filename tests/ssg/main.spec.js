// @ts-check
const { test, expect } = require("@playwright/test")
const verifyStillPrerendered = require("../helpers/verify-still-prerendered")

test.describe("main", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ path: "tests/helpers/prevent-hydration.js" })

    await page.goto("/")
  })

  test.afterEach(async ({ page }) => {
    expect(await verifyStillPrerendered(page)).toBe(true)
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
