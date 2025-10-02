import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from './playwright.config.base';

/**
 * Adobe Team Playwright Configuration
 * 
 * Team-specific settings for Adobe team tests
 * Extends baseConfig with Adobe-specific overrides
 */

const ENV = process.env.TEST_ENV || 'stage';

const ADOBE_URLS = {
  dev: 'https://dev.adobe.com',
  stage: 'https://www.stage.adobe.com',
  prod: 'https://www.adobe.com'
};

export default defineConfig({
  ...baseConfig,
  
  /* Adobe team test directory */
  testDir: './teams/adobe-team',
  
  /* Adobe team may need longer timeouts */
  timeout: 60000,
  
  /* Team-specific use settings */
  use: {
    ...baseConfig.use,
    baseURL: ADOBE_URLS[ENV as keyof typeof ADOBE_URLS],
  },

  /* Adobe team projects */
  projects: [
    {
      name: 'adobe-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: ADOBE_URLS[ENV as keyof typeof ADOBE_URLS],
      },
    },
    {
      name: 'adobe-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: ADOBE_URLS[ENV as keyof typeof ADOBE_URLS],
      },
    },
    {
      name: 'adobe-webkit',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: ADOBE_URLS[ENV as keyof typeof ADOBE_URLS],
      },
    },
  ],
});

