/**
 * Search Team - Playwright Configuration
 * 
 * Owner: @search-team
 * Maintained by: Search Test Automation Team
 * 
 * This config is specific to Search team's tests and can be modified
 * independently without affecting other teams.
 */

import { defineConfig, devices } from '@playwright/test';
import { baseConfig, getEnvironment } from '../playwright.config.base';
import { ENVIRONMENTS } from '../environments';

const env = getEnvironment();
const searchEnv = ENVIRONMENTS.search[env];

export default defineConfig({
  ...baseConfig,

  // Search team's test directory
  testDir: '../../teams/search-team',

  // Search-specific timeout (faster tests)
  timeout: 20_000,

  // Search team projects (focus on chromium for speed)
  projects: [
    {
      name: 'search-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: searchEnv.baseURL,
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'search-mobile',
      use: {
        ...devices['Pixel 5'],
        baseURL: searchEnv.baseURL,
      },
    },
  ],

  // Search-specific settings
  use: {
    ...baseConfig.use,
    baseURL: searchEnv.baseURL,
    
    // Search tests are fast
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },

  // Search team metadata
  metadata: {
    team: 'search',
    owner: '@search-team',
    slack: '#search-qa',
  },
});

