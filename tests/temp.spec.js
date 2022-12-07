// @ts-check
const { test, expect } = require("@playwright/test")

// TODO: This is a temporary file that should be deleted before merging playwright branch

// I'm using this to verify that my match regex works properly between different environments:
// dev-spa vs prod-spa vs dev-ssg vs prod-ssg, etc
test.describe("temp", () => {
  test("should fail", async ({ page }) => {
    expect(false).toBe(true)
  })
})
