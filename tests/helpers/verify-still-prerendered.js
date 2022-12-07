module.exports = async function (page) {
  const app = page.locator("can-app")

  // const prerendered = await app.evaluate((el) => {
  //     // null is the return value if no attribute exists
  //     return el.getAttribute("data-canjs-static-render") === ""
  // })
  const prerendered = await app.getAttribute("data-canjs-static-render")

  // empty string means that element has attribute (just no value)
  // null means that element doesn't have attribute
  return prerendered === ""
}
