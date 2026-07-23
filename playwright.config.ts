import { defineConfig, devices } from '@playwright/test';

// Allow pointing at a pre-installed Chromium (e.g. sandboxed CI images that ship
// their own browser). CI installs the matching browser via `playwright install`
// and leaves this unset.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

// Mobile-first: the primary e2e project emulates a phone viewport.
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], launchOptions: { executablePath } },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
