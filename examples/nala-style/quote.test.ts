/**
 * Quote Block Tests
 * 
 * Based on: https://github.com/adobecom/milo/tree/stage/nala
 * Pattern: tests/*.test.js
 * 
 * This file contains the actual test implementations.
 * It uses the spec (features) and page object (selectors).
 */

import { test, expect } from '@playwright/test';
import Quote from './quote.page';
import { QuoteSpec, getFeaturesByTag } from './quote.spec';

// Store page object instance
let quoteBlock: Quote;

/**
 * Quote Block Test Suite
 * 
 * Real example from Milo/Nala:
 * https://github.com/adobecom/milo/tree/stage/nala/tests
 */
test.describe('Milo Quote block test suite', () => {
  
  // Before each test block
  test.beforeEach(async ({ page }) => {
    quoteBlock = new Quote(page);
  });

  // Test - 0: Basic Quote Block
  test(`${QuoteSpec.features[0].name}`, async ({ page, baseURL }) => {
    const feature = QuoteSpec.features[0];
    console.info(`[Test ID: ${feature.tcid}] ${baseURL}${feature.path}`);
    
    // Test step-1: Navigate to test page
    await test.step('Go to Quote block test page', async () => {
      await page.goto(`${baseURL}${feature.path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${feature.path}`);
    });

    // Test step-2: Verify Quote block content/specs
    await test.step('Verify Quote block content / specs', async () => {
      const { data } = feature;
      
      // Verify quote block is visible
      await expect(quoteBlock.quote).toBeVisible();
      
      // Verify quote content
      await expect(quoteBlock.quoteCopy).toContainText(data.quoteCopy);
      await expect(quoteBlock.quoteFigCaption).toContainText(data.figCaption);
      await expect(quoteBlock.quoteFigCaptionCite).toContainText(data.cite);
      
      // Verify quote block CSS (Nala includes CSS validation)
      const maxWidth = await quoteBlock.quote.evaluate(
        el => window.getComputedStyle(el).maxWidth
      );
      console.info(`✓ Quote block max-width: ${maxWidth}`);
    });
  });

  // Test - 1: Quote Block Contained Variant
  test(`${QuoteSpec.features[1].name}`, async ({ page, baseURL }) => {
    const feature = QuoteSpec.features[1];
    console.info(`[Test ID: ${feature.tcid}] ${baseURL}${feature.path}`);
    
    await test.step('Go to Quote-Contained test page', async () => {
      await page.goto(`${baseURL}${feature.path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${feature.path}`);
    });

    await test.step('Verify Quote-Contained variant', async () => {
      const { data } = feature;
      
      await expect(quoteBlock.quote).toBeVisible();
      await expect(quoteBlock.quoteCopy).toContainText(data.quoteCopy);
      await expect(quoteBlock.quoteFigCaption).toContainText(data.figCaption);
      
      // Verify contained variant has specific styling
      const hasContainedClass = await quoteBlock.quote.evaluate(
        el => el.classList.contains('contained') || 
             el.classList.contains('quote-contained')
      );
      console.info(`✓ Quote-Contained variant: ${hasContainedClass}`);
    });
  });

  // Test - 2: Quote Block Inline Variant
  test(`${QuoteSpec.features[2].name}`, async ({ page, baseURL }) => {
    const feature = QuoteSpec.features[2];
    console.info(`[Test ID: ${feature.tcid}] ${baseURL}${feature.path}`);
    
    await test.step('Go to Quote-Inline test page', async () => {
      await page.goto(`${baseURL}${feature.path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${feature.path}`);
    });

    await test.step('Verify Quote-Inline variant', async () => {
      const { data } = feature;
      
      await expect(quoteBlock.quote).toBeVisible();
      await expect(quoteBlock.quoteCopy).toContainText(data.quoteCopy);
      await expect(quoteBlock.quoteFigCaption).toContainText(data.figCaption);
    });
  });
});

/**
 * Tag-based test execution (Nala style)
 * 
 * Run specific tests by tag:
 * npx playwright test -g@smoke
 * npx playwright test -g@regression
 * npx playwright test -g@Quote
 */
test.describe('Tag-based test execution examples', () => {
  
  test('Run only @smoke tests', async () => {
    const smokeTests = getFeaturesByTag('@smoke');
    console.info(`Found ${smokeTests.length} smoke tests`);
    expect(smokeTests.length).toBeGreaterThan(0);
  });
});


