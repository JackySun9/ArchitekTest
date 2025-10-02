/**
 * Auth Team - Playwright Configuration
 * 
 * Owner: @auth-team
 * Maintained by: Authentication Test Team
 * 
 * This config is specific to Auth team's tests and can be modified
 * independently without affecting other teams.
 */

import { defineConfig, devices } from '@playwright/test';
import { baseConfig, getEnvironment } from '../playwright.config.base';
import { ENVIRONMENTS } from '../environments';

const env = getEnvironment();
const authEnv = ENVIRONMENTS.auth[env];

export default defineConfig({
  ...baseConfig,

  // Auth team's test directory
  testDir: '../../teams/auth-team',

  // Auth-specific timeout
  timeout: 30_000,

  // Auth team projects (need all browsers for security testing)
  projects: [
    {
      name: 'auth-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: authEnv.baseURL,
      },
    },
    {
      name: 'auth-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: authEnv.baseURL,
      },
    },
    {
      name: 'auth-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: authEnv.baseURL,
      },
    },
  ],

  // Auth-specific settings
  use: {
    ...baseConfig.use,
    baseURL: authEnv.baseURL,
    
    // Security: always use HTTPS properly
    ignoreHTTPSErrors: false,
    
    // Auth flows can be slow
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  // Auth team metadata
  metadata: {
    team: 'auth',
    owner: '@auth-team',
    slack: '#auth-security-qa',
  },
});

