module.exports = async function (page) {
  const app = page.locator("can-app")

  const prerendered = await app.getAttribute("data-canjs-static-render")

  // empty string means that element has attribute (just no value)
  // null means that element doesn't have attribute
  return prerendered === null
}
