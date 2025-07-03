const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './automation-tests/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: './automation-tests/reports/html-report' }],
    ['json', { outputFile: './automation-tests/reports/results.json' }],
    ['junit', { outputFile: './automation-tests/reports/results.xml' }]
  ],
  use: {
    baseURL: 'https://mo-admin.dev.pressingly.net/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.CI === 'true',
    viewport: { width: 1920, height: 1080 },
    timeout: 60000,
    actionTimeout: 60000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to test on other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  outputDir: './automation-tests/test-results',
  globalSetup: require.resolve('./automation-tests/config/globalSetup.js'),
  globalTeardown: require.resolve('./automation-tests/config/globalTeardown.js'),
}); 