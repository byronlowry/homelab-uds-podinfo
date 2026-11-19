/**
 * Copyright 2026 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { defineConfig, devices } from '@playwright/test';

export const playwrightDir = '.playwright';
const browserDevices = new Map([
  ['chromium', devices['Desktop Chrome']],
  ['firefox', devices['Desktop Firefox']],
]);
const browsers = (process.env.PLAYWRIGHT_BROWSERS ?? 'chromium,firefox')
  .split(',')
  .map((browser) => browser.trim());

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail CI if you accidentally leave `test.only` in source
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    // Reporter to use. See https://playwright.dev/docs/test-reporters
    ['html', { outputFolder: `${playwrightDir}/reports`, open: 'never' }],
    ['json', { outputFile: `${playwrightDir}/reports/test-results.json`, open: 'never' }],
    ['list']
  ],

  outputDir: `${playwrightDir}/output`,

  use: {
    // video: 'on',
    baseURL: process.env.BASE_URL || 'https://podinfo.uds.dev', // for `await page.goto('/')` etc
    trace: 'on-first-retry', // collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
  },

  projects: [
    ...browsers.map((browser) => {
      const device = browserDevices.get(browser);
      if (!device) {
        throw new Error(`Unknown PLAYWRIGHT_BROWSERS entry: "${browser}". Use chromium or firefox.`);
      }
      return {
        name: browser,
        use: {
          ...device,
        },
      };
    }),
  ],
});
