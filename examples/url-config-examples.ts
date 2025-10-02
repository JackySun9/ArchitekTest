/**
 * URL Configuration - Practical Examples
 * 
 * This file demonstrates how to use URL configuration in real scenarios
 */

import { test, expect } from '@playwright/test';
import { ADOBE_PAGES, getPageURL, buildURL } from '../config/teams/adobe-urls';
import { AdobePages } from '../teams/adobe-team/adobe-pages.config';
import { ENVIRONMENTS } from '../config/environments';
import { BrandConciergePage } from '../teams/adobe-team/brand-concierge/brand-concierge.page.ts';

// ============================================================================
// EXAMPLE 1: Using Option 1 (Simple Config) in Tests
// ============================================================================

test.describe('Option 1 Examples - Simple Config', () => {
  
  test('Basic navigation using ADOBE_PAGES', async ({ page }) => {
    const env = 'stage';
    const baseURL = ENVIRONMENTS.adobe[env].baseURL;
    const url = getPageURL(baseURL, ADOBE_PAGES.brandConcierge);
    
    await page.goto(url);
    await expect(page).toHaveURL(/brand-concierge/);
  });

  test('Navigate to multiple pages', async ({ page }) => {
    const env = 'stage';
    const baseURL = ENVIRONMENTS.adobe[env].baseURL;
    
    // Go to home page
    await page.goto(getPageURL(baseURL, ADOBE_PAGES.home));
    await expect(page).toHaveURL(baseURL);
    
    // Go to brand concierge
    await page.goto(getPageURL(baseURL, ADOBE_PAGES.brandConcierge));
    await expect(page).toHaveURL(/brand-concierge/);
    
    // Go to login
    await page.goto(getPageURL(baseURL, ADOBE_PAGES.login));
    await expect(page).toHaveURL(/login/);
  });

  test('URL with query parameters', async ({ page }) => {
    const env = 'stage';
    const baseURL = ENVIRONMENTS.adobe[env].baseURL;
    const url = buildURL(baseURL, ADOBE_PAGES.brandConcierge, {
      locale: 'en_US',
      theme: 'dark',
      debug: 'true',
    });
    
    await page.goto(url);
    
    // Verify query params are present
    expect(page.url()).toContain('locale=en_US');
    expect(page.url()).toContain('theme=dark');
    expect(page.url()).toContain('debug=true');
  });

  test('Environment switching', async ({ page }) => {
    const envs: Array<'dev' | 'stage' | 'prod'> = ['dev', 'stage', 'prod'];
    
    for (const env of envs) {
      const baseURL = ENVIRONMENTS.adobe[env].baseURL;
      const url = getPageURL(baseURL, ADOBE_PAGES.home);
      
      console.log(`${env}: ${url}`);
      // dev: https://dev.adobe.com/
      // stage: https://stage.adobe.com/
      // prod: https://www.adobe.com/
    }
  });
});

// ============================================================================
// EXAMPLE 2: Using Option 2 (Pages Class) in Tests
// ============================================================================

test.describe('Option 2 Examples - Pages Class', () => {
  
  test('Basic navigation using AdobePages class', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    await page.goto(pages.brandConcierge());
    await expect(page).toHaveURL(/brand-concierge/);
  });

  test('Navigate to multiple pages with type safety', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    // Type-safe page navigation - IDE autocomplete works!
    await page.goto(pages.home());
    await page.goto(pages.brandConcierge());
    await page.goto(pages.creativityDesign());
    await page.goto(pages.pdfSignatures());
  });

  test('URL with query parameters (cleaner syntax)', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    const url = pages.brandConcierge({ 
      params: { 
        locale: 'en_US',
        theme: 'dark',
        debug: 'true',
      } 
    });
    
    await page.goto(url);
    expect(page.url()).toContain('locale=en_US');
  });

  test('URL with hash fragment', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    const url = pages.brandConcierge({ 
      hash: 'getting-started' 
    });
    
    await page.goto(url);
    expect(page.url()).toContain('#getting-started');
  });

  test('URL with both params and hash', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    const url = pages.brandConcierge({ 
      params: { locale: 'en_US' },
      hash: 'features',
    });
    
    await page.goto(url);
    expect(page.url()).toContain('locale=en_US');
    expect(page.url()).toContain('#features');
  });

  test('Environment switching with Pages class', async ({ page }) => {
    const devPages = new AdobePages('dev');
    const stagePages = new AdobePages('stage');
    const prodPages = new AdobePages('prod');
    
    console.log('Dev:', devPages.brandConcierge());
    console.log('Stage:', stagePages.brandConcierge());
    console.log('Prod:', prodPages.brandConcierge());
  });

  test('API endpoint URLs', async ({ request }) => {
    const pages = new AdobePages('stage');
    
    // Make API request using configured endpoint
    const response = await request.get(
      pages.apiBrandConcierge({ params: { userId: '123' } })
    );
    
    expect(response.ok()).toBeTruthy();
  });
});

// ============================================================================
// EXAMPLE 3: Using with Page Objects
// ============================================================================

test.describe('Using URLs with Page Objects', () => {
  
  test('Page object with environment support', async ({ page }) => {
    const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';
    const brandConcierge = new BrandConciergePage(page, env);
    
    // Page object handles URL internally
    await brandConcierge.navigateToBrandConcierge();
    await brandConcierge.verifyPageLoaded();
  });

  test('Test across multiple environments', async ({ page }) => {
    const environments: Array<'dev' | 'stage' | 'prod'> = ['dev', 'stage'];
    
    for (const env of environments) {
      const brandConcierge = new BrandConciergePage(page, env);
      
      await brandConcierge.navigateToBrandConcierge();
      await brandConcierge.verifyPageLoaded();
      
      console.log(`✅ ${env} environment passed`);
    }
  });
});

// ============================================================================
// EXAMPLE 4: Dynamic Environment from ENV Variables
// ============================================================================

test.describe('Using Environment Variables', () => {
  
  test('Get environment from process.env', async ({ page }) => {
    // Set via: TEST_ENV=stage npm test
    const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';
    const pages = new AdobePages(env);
    
    await page.goto(pages.brandConcierge());
    console.log(`Running on ${env} environment`);
  });

  test('CI/CD environment detection', async ({ page }) => {
    // Common CI environment patterns
    const getEnv = (): 'dev' | 'stage' | 'prod' => {
      if (process.env.CI === 'true') {
        return 'stage'; // Use stage for CI
      }
      if (process.env.NODE_ENV === 'production') {
        return 'prod';
      }
      return 'dev'; // Default to dev for local
    };
    
    const env = getEnv();
    const pages = new AdobePages(env);
    
    await page.goto(pages.brandConcierge());
  });
});

// ============================================================================
// EXAMPLE 5: Helper Functions for Complex Scenarios
// ============================================================================

test.describe('Advanced URL Building', () => {
  
  test('Build URL with authentication token', async ({ page }) => {
    const pages = new AdobePages('stage');
    const baseUrl = pages.brandConcierge();
    
    // Add auth token as query param
    const authUrl = `${baseUrl}?token=abc123&redirect=/dashboard`;
    
    await page.goto(authUrl);
  });

  test('Navigate with locale preferences', async ({ page }) => {
    const pages = new AdobePages('stage');
    const locales = ['en_US', 'fr_FR', 'de_DE', 'ja_JP'];
    
    for (const locale of locales) {
      const url = pages.brandConcierge({ 
        params: { locale } 
      });
      
      await page.goto(url);
      console.log(`Testing locale: ${locale}`);
      
      // Verify locale is applied
      const htmlLang = await page.getAttribute('html', 'lang');
      console.log(`HTML lang attribute: ${htmlLang}`);
    }
  });

  test('Deep linking to specific features', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    // Link directly to specific feature sections
    const features = ['templates', 'examples', 'documentation', 'api'];
    
    for (const feature of features) {
      const url = pages.brandConcierge({ 
        hash: feature 
      });
      
      await page.goto(url);
      await page.waitForTimeout(1000); // Wait for scroll/animation
      
      console.log(`Tested feature: ${feature}`);
    }
  });
});

// ============================================================================
// EXAMPLE 6: Testing URL Configuration Itself
// ============================================================================

test.describe('URL Configuration Validation', () => {
  
  test('Verify all Adobe URLs are valid', () => {
    const pages = new AdobePages('stage');
    
    // Test that all page methods return valid URLs
    const urls = [
      pages.home(),
      pages.brandConcierge(),
      pages.creativityDesign(),
      pages.pdfSignatures(),
      pages.login(),
      pages.profile(),
    ];
    
    urls.forEach(url => {
      expect(() => new URL(url)).not.toThrow();
      expect(url).toContain('https://');
      expect(url).toContain('adobe.com');
    });
  });

  test('Verify environment-specific URLs', () => {
    const devPages = new AdobePages('dev');
    const stagePages = new AdobePages('stage');
    const prodPages = new AdobePages('prod');
    
    // Dev should contain 'dev'
    expect(devPages.home()).toContain('dev.adobe.com');
    
    // Stage should contain 'stage'
    expect(stagePages.home()).toContain('stage.adobe.com');
    
    // Prod should be www
    expect(prodPages.home()).toContain('www.adobe.com');
  });

  test('Verify API URLs are different from base URLs', () => {
    const pages = new AdobePages('stage');
    
    const baseURL = pages.getBaseURL();
    const apiURL = pages.getAPIBaseURL();
    
    expect(apiURL).toBeDefined();
    expect(apiURL).not.toBe(baseURL);
    expect(apiURL).toContain('api');
  });
});

// ============================================================================
// EXAMPLE 7: Real-World Test Scenarios
// ============================================================================

test.describe('Real-World Scenarios', () => {
  
  test('Complete user journey with multiple pages', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    // 1. Start at home
    await page.goto(pages.home());
    await expect(page).toHaveURL(pages.home());
    
    // 2. Navigate to brand concierge
    await page.goto(pages.brandConcierge());
    await expect(page).toHaveURL(/brand-concierge/);
    
    // 3. Go to login (simulated)
    await page.goto(pages.login());
    await expect(page).toHaveURL(/login/);
    
    // 4. After login, go to profile
    await page.goto(pages.profile());
    await expect(page).toHaveURL(/profile/);
  });

  test('A/B testing with URL parameters', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    // Test variant A
    await page.goto(pages.brandConcierge({ 
      params: { variant: 'A', experiment: 'new-layout' } 
    }));
    
    // Verify variant A behavior
    // ... assertions
    
    // Test variant B
    await page.goto(pages.brandConcierge({ 
      params: { variant: 'B', experiment: 'new-layout' } 
    }));
    
    // Verify variant B behavior
    // ... assertions
  });

  test('Error page handling', async ({ page }) => {
    const pages = new AdobePages('stage');
    
    // Navigate to non-existent page (should show 404)
    const invalidUrl = `${pages.getBaseURL()}/this-page-does-not-exist`;
    const response = await page.goto(invalidUrl);
    
    expect(response?.status()).toBe(404);
  });
});

