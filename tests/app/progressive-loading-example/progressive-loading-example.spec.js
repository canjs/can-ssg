// @ts-check
const { test, expect } = require("@playwright/test")
const waitForHydration = require("../../helpers/wait-for-hydration")

test.describe("ProgressiveLoadingExample", () => {
  test("navigation nested root route example", async ({ page }) => {
    await page.goto("/")

    await waitForHydration(page)

    await page.getByTestId("progressive-loading").click()

    const header = page.locator("h3")

    await expect(header).toHaveText("Progressive Loading Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is progressive-loading.")

    const nestedHeader = page.locator("h4")

    await expect(nestedHeader).toHaveText("Nested Root Route")

    const nestedTracker = page.getByTestId("nested-page-tracker")

    await expect(nestedTracker).toHaveText("The current nestedPage is root.")
  })

  test("refresh to nested root route example", async ({ page }) => {
    await page.goto("/progressive-loading")

    await waitForHydration(page)

    const header = page.locator("h3")

    await expect(header).toHaveText("Progressive Loading Route")

    const tracker = page.getByTestId("page-tracker")

    await expect(tracker).toHaveText("The current page is progressive-loading.")

    const nestedHeader = page.locator("h4")

    await expect(nestedHeader).toHaveText("Nested Root Route")

    const nestedTracker = page.getByTestId("nested-page-tracker")

    await expect(nestedTracker).toHaveText("The current nestedPage is root.")
  })
})
