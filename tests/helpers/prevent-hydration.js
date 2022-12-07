/**
 * Use to:
 * Sets global flag to prevent hydration
 *
 * ```
 * await page.addInitScript({ path: 'tests/helpers/prevent-hydration.js' })
 * ```
 */
globalThis.skipHydrationCanStacheElement = true
