module.exports = async function (page) {
  await page.waitForSelector("can-app[data-canjs-static-render]", {
    state: "detached",
  })
}
