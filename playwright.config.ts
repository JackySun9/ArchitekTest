import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Multi-Team, Multi-Environment Playwright Configuration
 * 
 * Supports:
 * - Multiple teams (adobe, search, auth, ai, test)
 * - Multiple environments (dev, stage, prod)
 * - Team-specific base URLs and settings
 * - Environment-specific configurations
 */

// Environment configuration
const ENV = process.env.TEST_ENV || 'stage';
const TEAM = process.env.TEST_TEAM || 'all';

// Team-specific environment URLs
const TEAM_URLS = {
  adobe: {
    dev: 'https://dev.adobe.com',
    stage: 'https://www.stage.adobe.com',
    prod: 'https://www.adobe.com'
  },
  search: {
    dev: 'https://dev-search.example.com',
    stage: 'https://stage-search.example.com',
    prod: 'https://search.example.com'
  },
  auth: {
    dev: 'https://dev-auth.example.com',
    stage: 'https://stage-auth.example.com',
    prod: 'https://auth.example.com'
  },
  ai: {
    dev: 'https://dev-ai.example.com',
    stage: 'https://stage-ai.example.com',
    prod: 'https://ai.example.com'
  },
  test: {
    dev: 'https://dev.example.com',
    stage: 'https://stage.example.com',
    prod: 'https://example.com'
  }
};

// Get base URL for a team
function getBaseURL(team: string): string {
  const teamUrls = TEAM_URLS[team as keyof typeof TEAM_URLS];
  if (!teamUrls) {
    console.warn(`⚠️  Unknown team: ${team}, using default`);
    return TEAM_URLS.adobe[ENV as keyof typeof TEAM_URLS.adobe];
  }
  return teamUrls[ENV as keyof typeof teamUrls];
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './teams',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: getBaseURL('adobe'), // Default to adobe team
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshots on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Maximum time each action can take */
    actionTimeout: 10000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers and teams */
  projects: [
    // ============================================================================
    // ADOBE TEAM PROJECTS
    // ============================================================================
    {
      name: 'adobe-chromium',
      testMatch: /teams\/adobe-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: getBaseURL('adobe'),
      },
    },
    {
      name: 'adobe-firefox',
      testMatch: /teams\/adobe-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: getBaseURL('adobe'),
      },
    },
    {
      name: 'adobe-webkit',
      testMatch: /teams\/adobe-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Safari'],
        baseURL: getBaseURL('adobe'),
      },
    },
    
    // ============================================================================
    // SEARCH TEAM PROJECTS
    // ============================================================================
    {
      name: 'search-chromium',
      testMatch: /teams\/search-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: getBaseURL('search'),
      },
    },
    
    // ============================================================================
    // AUTH TEAM PROJECTS
    // ============================================================================
    {
      name: 'auth-chromium',
      testMatch: /teams\/auth-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: getBaseURL('auth'),
      },
    },
    
    // ============================================================================
    // AI TEAM PROJECTS
    // ============================================================================
    {
      name: 'ai-chromium',
      testMatch: /teams\/ai-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: getBaseURL('ai'),
      },
    },
    
    // ============================================================================
    // TEST TEAM PROJECTS
    // ============================================================================
    {
      name: 'test-chromium',
      testMatch: /teams\/test-team\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: getBaseURL('test'),
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'mobile-chrome',
      testMatch: /teams\/.*\.spec\.ts/,
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      testMatch: /teams\/.*\.spec\.ts/,
      use: { 
        ...devices['iPhone 12'],
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'microsoft-edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'google-chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

