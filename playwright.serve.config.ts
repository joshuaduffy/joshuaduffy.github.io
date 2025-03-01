import { defineConfig } from '@playwright/test';
import config from './playwright.config';

const baseURL = 'http://127.0.0.1:4000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Extend the shared configuration from the main playwright.config.ts file */
  ...config,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  /* Run your local dev server before starting the tests */
  webServer: {
      command: 'bundle exec jekyll serve',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
    },
});
