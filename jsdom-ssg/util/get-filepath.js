/**
 * Create a normalized file path based on url
 */
module.exports = function (url, filename) {
  const path = url
    .replace(/https?:\/\//, "") // Remove protocol
    .replace(/[#\?].*$/, "") // Remove query params
    .replace(/[^a-zA-Z0-9- \/]/g, "_") // Convert non-alphanumeric excluding "/" and "-" to "_"
    .replace(/^[^/]*?(\/|$)/, "") // Remove domain

  return `${path}/${filename}`.replace(/^\//, "")
}
