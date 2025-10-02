/**
 * Adobe Team - Playwright Configuration
 * 
 * Owner: @adobe-team
 * Maintained by: Adobe Test Automation Team
 * 
 * This config is specific to Adobe team's tests and can be modified
 * independently without affecting other teams.
 */

import { defineConfig, devices } from '@playwright/test';
import { baseConfig, getEnvironment } from '../playwright.config.base';
import { ENVIRONMENTS } from '../environments';

const env = getEnvironment();
const adobeEnv = ENVIRONMENTS.adobe[env];

export default defineConfig({
  ...baseConfig,

  // Adobe team's test directory
  testDir: '../../teams/adobe-team',

  // Adobe-specific timeout (longer for complex interactions)
  timeout: 45_000,

  // Adobe team projects
  projects: [
    // Desktop browsers
    {
      name: 'adobe-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: adobeEnv.baseURL,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'adobe-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: adobeEnv.baseURL,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'adobe-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: adobeEnv.baseURL,
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'adobe-mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        baseURL: adobeEnv.baseURL,
      },
    },
    {
      name: 'adobe-mobile-safari',
      use: {
        ...devices['iPhone 13'],
        baseURL: adobeEnv.baseURL,
      },
    },
  ],

  // Adobe-specific settings
  use: {
    ...baseConfig.use,
    baseURL: adobeEnv.baseURL,
    
    // Adobe may need to handle HTTPS differently
    ignoreHTTPSErrors: env === 'dev',
    
    // Extra time for Adobe's complex pages
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  // Adobe team metadata
  metadata: {
    team: 'adobe',
    owner: '@adobe-team',
    slack: '#adobe-test-automation',
    jira: 'https://jira.adobe.com/projects/ATE',
  },
});

