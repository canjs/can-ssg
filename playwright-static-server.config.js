// @ts-check
const preset = require("./playwright.preset")

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const PORT = 4204

const WEB_SERVER_COMMANDS = [
  // `node jsdom-ssg/index.js --environment e2e-prod`,
  `node static-server.js --environment e2e-prod --port ${PORT}`,
]

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  ...preset,
  // testMatch: /tests\/app\/.+\.spec\.js/,
  testMatch: /tests\/(app|ssg(-prod)?)\/.+\.spec\.js/,
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/ssg-prod",
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: "playwright-report/ssg-prod" }]],
  use: {
    ...preset.use,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${PORT}`,
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: WEB_SERVER_COMMANDS.join(" && "),
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
}

module.exports = config
