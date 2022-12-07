module.exports = async function (page) {
  await page.evaluate(() => {
    return hydrationHasBeenSkipped()

    function hydrationHasBeenSkipped() {
      if (globalThis.skippedHydrationCanStacheElement) {
        return Promise.resolve()
      }

      return new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
        return hydrationHasBeenSkipped()
      })
    }
  })
}
