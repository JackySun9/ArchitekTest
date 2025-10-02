/**
 * Base Playwright Configuration
 * 
 * This is the shared configuration that all team-specific configs inherit from.
 * 
 * ⚠️ Important:
 * - Keep this file stable and minimal
 * - Only add truly universal settings here
 * - Team-specific settings belong in config/teams/[teamname].config.ts
 * 
 * Used by: All teams (10+ teams can safely extend this)
 */

import { defineConfig, devices } from '@playwright/test';

// Load environment variables
require('dotenv').config();

/**
 * Base configuration that all teams inherit
 */
export const baseConfig = defineConfig({
  // Root directory for all tests (teams override testDir)
  testDir: '../teams',

  // Test execution settings
  timeout: 30_000,           // Default: 30s per test
  expect: {
    timeout: 5_000,          // Default: 5s for assertions
  },

  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,

  // Retry logic
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  // Output directories
  outputDir: 'test-results/',

  // Global test settings
  use: {
    // Base URL (teams override this)
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'retain-on-failure',
    
    // Trace on first retry
    trace: 'retain-on-failure',

    // Context options
    ignoreHTTPSErrors: true,
    
    // Timeouts
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // Shared browser configurations (teams can use these)
  projects: [], // Teams define their own projects
});

/**
 * Common device configurations for teams to use
 */
export const commonDevices = {
  desktop: {
    chromium: {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    firefox: {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    webkit: {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  },
  mobile: {
    chrome: {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    safari: {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  },
};

/**
 * Environment helper
 */
export function getEnvironment(): 'dev' | 'stage' | 'prod' {
  const env = process.env.TEST_ENV?.toLowerCase();
  if (env === 'stage' || env === 'staging') return 'stage';
  if (env === 'prod' || env === 'production') return 'prod';
  return 'dev';
}

export default baseConfig;

