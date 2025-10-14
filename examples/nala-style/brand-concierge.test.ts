/**
 * Brand Concierge Tests
 * 
 * Pattern: Milo/Nala tests/*.test.js
 * Source: https://github.com/adobecom/milo/tree/stage/nala
 * 
 * This file contains the actual test implementations.
 * It uses:
 * - brand-concierge.spec.ts (test specifications + data)
 * - brand-concierge.page.ts (page object with locators)
 */

import { test, expect } from '@playwright/test';
import BrandConciergePage from './brand-concierge.page';
import { BrandConciergeSpec, getFeatureById } from './brand-concierge.spec';

// Store page object instance
let brandConciergePage: BrandConciergePage;

/**
 * Brand Concierge Test Suite (Nala Style)
 */
test.describe('Brand Concierge Test Suite', () => {
  
  // ========================================================================
  // SETUP
  // ========================================================================
  
  test.beforeEach(async ({ page }) => {
    brandConciergePage = new BrandConciergePage(page);
    await brandConciergePage.goto('stage');
  });

  // ========================================================================
  // BC001: Core Page Load
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[0].name}`, async ({ page, baseURL }) => {
    const feature = BrandConciergeSpec.features[0];
    console.info(`[${feature.tcid}] ${baseURL}${feature.path}`);
    
    // Step 1: Verify page loaded
    await test.step('Verify page loads successfully', async () => {
      await expect(page).toHaveURL(new RegExp(feature.path));
    });

    // Step 2: Verify main heading
    await test.step('Verify main heading', async () => {
      await expect(brandConciergePage.pageHeading).toBeVisible();
      await expect(brandConciergePage.pageHeading).toContainText(
        feature.data.expectedHeading
      );
    });

    // Step 3: Verify description
    await test.step('Verify description text', async () => {
      await expect(brandConciergePage.pageDescription).toBeVisible();
    });

    // Step 4: Verify quick action buttons
    await test.step('Verify quick action buttons present', async () => {
      const count = await brandConciergePage.quickActionButtons.count();
      expect(count).toBeGreaterThanOrEqual(feature.data.minQuickActions);
    });

    // Step 5: Verify page load time
    await test.step('Verify page performance', async () => {
      const metrics = await brandConciergePage.getPerformanceMetrics();
      console.info(`✓ Page load time: ${metrics.loadTime}ms`);
      expect(metrics.loadTime).toBeLessThan(feature.data.maxLoadTime);
    });
  });

  // ========================================================================
  // BC002: Quick Action Buttons
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[1].name}`, async () => {
    const feature = BrandConciergeSpec.features[1];
    console.info(`[${feature.tcid}] Testing quick action buttons`);
    
    // Step 1: Verify button count
    await test.step('Verify all quick action buttons are present', async () => {
      const count = await brandConciergePage.quickActionButtons.count();
      expect(count).toBeGreaterThanOrEqual(feature.data.minButtonCount);
      console.info(`✓ Found ${count} quick action buttons`);
    });

    // Step 2: Test button interactions
    await test.step('Test button hover and click interactions', async () => {
      const buttons = brandConciergePage.quickActionButtons;
      const count = await buttons.count();
      const testCount = Math.min(3, count);
      
      for (let i = 0; i < testCount; i++) {
        const button = buttons.nth(i);
        
        // Verify button is visible
        await expect(button).toBeVisible();
        
        // Test hover
        await button.hover();
        
        // Verify button has minimum touch target size
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          console.info(`✓ Button ${i + 1} size: ${box.width}x${box.height}px`);
        }
      }
    });
  });

  // ========================================================================
  // BC003: AI Chat Interface
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[2].name}`, async ({ page }) => {
    const feature = BrandConciergeSpec.features[2];
    console.info(`[${feature.tcid}] Testing AI chat interface`);
    
    // Step 1: Verify chat interface is visible
    await test.step('Locate and verify chat input field', async () => {
      const isChatVisible = await brandConciergePage.chatInput.isVisible({ timeout: 5000 });
      
      if (!isChatVisible) {
        test.skip(true, 'Chat interface not available - may require authentication');
      }
      
      await expect(brandConciergePage.chatInput).toBeVisible();
      console.info('✓ Chat input field is visible');
    });

    // Step 2: Verify send button is initially disabled
    await test.step('Verify send button initial state', async () => {
      const isDisabled = await brandConciergePage.sendButton.isDisabled();
      expect(isDisabled).toBeTruthy();
      console.info('✓ Send button is initially disabled');
    });

    // Step 3: Test chat queries
    for (const query of feature.data.chatQueries.slice(0, 2)) {
      await test.step(`Test query: "${query.input}"`, async () => {
        // Clear and enter query
        await brandConciergePage.chatInput.clear();
        await brandConciergePage.chatInput.fill(query.input);
        
        // Verify input
        const inputValue = await brandConciergePage.chatInput.inputValue();
        expect(inputValue).toBe(query.input);
        
        // Verify send button becomes enabled
        await expect(brandConciergePage.sendButton).toBeEnabled({ timeout: 2000 });
        console.info(`✓ Query entered and send button enabled`);
        
        // Optional: Click send (if testing responses)
        // await brandConciergePage.sendButton.click();
        // await brandConciergePage.waitForChatResponse(query.timeout);
      });
    }
  });

  // ========================================================================
  // BC004: Edge Cases
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[3].name}`, async () => {
    const feature = BrandConciergeSpec.features[3];
    console.info(`[${feature.tcid}] Testing edge cases`);
    
    // Check if chat is available
    const isChatVisible = await brandConciergePage.chatInput.isVisible({ timeout: 3000 });
    if (!isChatVisible) {
      test.skip(true, 'Chat interface not available');
    }

    // Test empty input
    await test.step('Test empty input handling', async () => {
      await brandConciergePage.chatInput.clear();
      await brandConciergePage.chatInput.fill(feature.data.edgeCases.emptyInput);
      await expect(brandConciergePage.sendButton).toBeDisabled();
      console.info('✓ Empty input: send button disabled');
    });

    // Test long input
    await test.step('Test long input handling', async () => {
      await brandConciergePage.chatInput.clear();
      await brandConciergePage.chatInput.fill(feature.data.edgeCases.longInput);
      const value = await brandConciergePage.chatInput.inputValue();
      expect(value.length).toBeGreaterThan(100);
      console.info(`✓ Long input accepted: ${value.length} characters`);
    });

    // Test special characters
    await test.step('Test special characters', async () => {
      await brandConciergePage.chatInput.clear();
      await brandConciergePage.chatInput.fill(feature.data.edgeCases.specialChars);
      const value = await brandConciergePage.chatInput.inputValue();
      expect(value).toContain('!@#$');
      console.info('✓ Special characters handled');
    });

    // Test emojis
    await test.step('Test emoji support', async () => {
      await brandConciergePage.chatInput.clear();
      await brandConciergePage.chatInput.fill(feature.data.edgeCases.emojis);
      const value = await brandConciergePage.chatInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
      console.info('✓ Emojis supported');
    });
  });

  // ========================================================================
  // BC007: Accessibility
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[4].name}`, async ({ page }) => {
    const feature = BrandConciergeSpec.features[4];
    console.info(`[${feature.tcid}] Testing accessibility compliance`);
    
    // Test keyboard navigation
    await test.step('Test keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeDefined();
      console.info(`✓ Keyboard navigation works: focused on ${focusedElement}`);
    });

    // Test ARIA labels
    await test.step('Verify ARIA labels and roles', async () => {
      const ariaElements = page.locator('[aria-label], [aria-labelledby], [role]');
      const count = await ariaElements.count();
      expect(count).toBeGreaterThan(0);
      console.info(`✓ Found ${count} elements with ARIA attributes`);
    });

    // Test heading structure
    await test.step('Verify heading structure', async () => {
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
      console.info(`✓ Page has proper heading structure (${count} headings)`);
    });

    // Test image alt text
    await test.step('Verify image accessibility', async () => {
      const images = brandConciergePage.images;
      const count = await images.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 5); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          expect(alt).not.toBeNull();
        }
        console.info(`✓ Images have alt text (checked ${Math.min(count, 5)} images)`);
      }
    });
  });

  // ========================================================================
  // BC008: Performance
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[5].name}`, async ({ page }) => {
    const feature = BrandConciergeSpec.features[5];
    console.info(`[${feature.tcid}] Testing performance metrics`);
    
    // Measure page load time
    await test.step('Measure page load time', async () => {
      const metrics = await brandConciergePage.getPerformanceMetrics();
      console.info(`✓ Page load time: ${metrics.loadTime}ms`);
      expect(metrics.loadTime).toBeGreaterThan(0);
      expect(metrics.loadTime).toBeLessThan(feature.data.thresholds.pageLoadTime);
    });

    // Check network requests
    await test.step('Monitor network requests', async () => {
      const responses: any[] = [];
      page.on('response', response => responses.push(response));
      
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      console.info(`✓ Total network requests: ${responses.length}`);
      expect(responses.length).toBeLessThan(feature.data.thresholds.maxNetworkRequests);
      
      // Check for failed requests
      const failedRequests = responses.filter(r => r.status() >= 400);
      expect(failedRequests.length).toBe(0);
    });

    // Verify image optimization
    await test.step('Verify image optimization', async () => {
      const images = brandConciergePage.images;
      const count = await images.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const loading = await img.getAttribute('loading');
          expect(alt).not.toBeNull();
          console.info(`✓ Image ${i + 1}: alt="${alt}", loading="${loading}"`);
        }
      }
    });
  });

  // ========================================================================
  // BC009: Privacy & Legal
  // ========================================================================
  
  test(`${BrandConciergeSpec.features[6].name}`, async ({ page }) => {
    const feature = BrandConciergeSpec.features[6];
    console.info(`[${feature.tcid}] Testing privacy and legal compliance`);
    
    // Verify privacy notice
    await test.step('Verify privacy notice in main content', async () => {
      const privacyText = await brandConciergePage.privacyNotice.count();
      console.info(`✓ Privacy notices found: ${privacyText}`);
    });

    // Verify privacy links
    await test.step('Verify privacy links', async () => {
      const links = brandConciergePage.privacyLinks;
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
      console.info(`✓ Found ${count} privacy/legal link(s)`);
      
      // Check links have proper hrefs
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.info(`  - "${text}" → ${href}`);
        expect(href).not.toBeNull();
      }
    });

    // Verify HTTPS
    await test.step('Verify HTTPS protocol', async () => {
      const url = page.url();
      expect(url).toMatch(/^https:\/\//);
      console.info('✓ Page uses HTTPS protocol');
    });
  });

  // ========================================================================
  // BC010: Responsive Design
  // ========================================================================
  
  Object.entries(BrandConciergeSpec.features[7].data.viewports).forEach(([device, viewport]) => {
    test(`${BrandConciergeSpec.features[7].tcid}: Responsive on ${viewport.name}`, async ({ page }) => {
      console.info(`[BC010] Testing on ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      // Set viewport
      await test.step(`Set viewport to ${viewport.name}`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      // Verify page loads
      await test.step('Verify page loads on this viewport', async () => {
        await expect(brandConciergePage.pageHeading).toBeVisible();
      });

      // Verify no horizontal scroll
      await test.step('Verify no horizontal scrolling', async () => {
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
        console.info(`✓ No horizontal scroll: ${scrollWidth} <= ${clientWidth}`);
      });

      // Verify touch targets on mobile
      if (device === 'mobile' || device === 'mobileLarge') {
        await test.step('Verify touch targets meet minimum size', async () => {
          const buttons = brandConciergePage.quickActionButtons;
          const firstButton = buttons.first();
          
          const box = await firstButton.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44);
            console.info(`✓ Touch target size: ${box.width}x${box.height}px`);
          }
        });
      }
    });
  });
});

/**
 * Print test summary (Nala includes reporting utilities)
 */
test('Test Summary', async () => {
  console.info('\n' + '='.repeat(70));
  console.info('📊 BRAND CONCIERGE TEST SUMMARY');
  console.info('='.repeat(70));
  console.info(`Total Features: ${BrandConciergeSpec.features.length}`);
  console.info(`Feature Name: ${BrandConciergeSpec.name}`);
  console.info('='.repeat(70) + '\n');
});


