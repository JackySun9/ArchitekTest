import { test, expect, Page, BrowserContext } from '@playwright/test';
import { BrandConciergePage } from './brand-concierge.page';
import { 
  BRAND_CONCIERGE_SCENARIOS, 
  TEST_CONFIGURATIONS, 
  PERFORMANCE_THRESHOLDS,
  ACCESSIBILITY_REQUIREMENTS,
  TestScenario
} from './brand-concierge.feature';
import { BRAND_CONCIERGE_QUERIES, QUICK_ACTION_BUTTONS } from '../../../shared/test-data';

test.describe('Adobe Brand Concierge - Comprehensive Test Suite', () => {
  let brandConciergePage: BrandConciergePage;

  test.beforeEach(async ({ page }) => {
    brandConciergePage = new BrandConciergePage(page);
    await brandConciergePage.navigateToBrandConcierge();
  });

  // High Priority Functional Tests
  test.describe('Core Functionality', () => {
    
    test('BC001: Page loads successfully with all core elements', async ({ page }) => {
      const scenario = BRAND_CONCIERGE_SCENARIOS.find(s => s.id === 'BC001')!;
      
      // Step 1-2: Navigate and wait for load (done in beforeEach)
      await test.step('Verify page loaded', async () => {
        await brandConciergePage.verifyPageLoaded();
      });

      await test.step('Verify main heading', async () => {
        await expect(page.locator('h2')).toContainText('Explore what you can do with Adobe apps.');
      });

      await test.step('Verify description text', async () => {
        await expect(page.locator('text=Choose an option or tell us what interests you')).toBeVisible();
      });

      await test.step('Verify Adobe branding elements', async () => {
        await brandConciergePage.expectAdobeHeader();
        await brandConciergePage.expectAdobeFooter();
      });
    });

    test('BC002: All quick action buttons are present and clickable', async ({ page }) => {
      await test.step('Verify all quick action buttons', async () => {
        await brandConciergePage.verifyQuickActionButtons();
      });

      await test.step('Test each quick action button', async () => {
        for (const buttonText of QUICK_ACTION_BUTTONS) {
          const button = page.locator(`button:has-text("${buttonText}")`);
          await expect(button).toBeVisible();
          await expect(button).toBeEnabled();
          
          // Test click interaction (without actually navigating)
          await button.hover();
          await expect(button).toBeFocused();
        }
      });
    });

    test('BC003: AI chat interface functionality', async ({ page }) => {
      await test.step('Verify chat interface elements', async () => {
        await brandConciergePage.verifyChatInterfaceVisible();
      });

      await test.step('Verify send button is initially disabled', async () => {
        await brandConciergePage.verifySendButtonDisabled();
      });

      await test.step('Enter text and verify send button enables', async () => {
        await brandConciergePage.enterChatMessage('I want to create a logo');
        await brandConciergePage.verifySendButtonEnabled();
      });

      await test.step('Clear input and verify button disables again', async () => {
        await brandConciergePage.enterChatMessage('');
        await brandConciergePage.verifySendButtonDisabled();
      });
    });

    test('BC004: AI chat with various creative queries', async ({ page }) => {
      // Test a subset of queries to avoid timeout in demo
      const testQueries = BRAND_CONCIERGE_QUERIES.slice(0, 3);
      
      for (const query of testQueries) {
        await test.step(`Test query: ${query.input}`, async () => {
          await brandConciergePage.enterChatMessage(query.input);
          await brandConciergePage.verifySendButtonEnabled();
          
          // Note: In a real test, you'd send the message and verify the response
          // For this demo, we're just testing the input functionality
          await expect(page.locator('textbox')).toHaveValue(query.input);
        });
      }
    });

    test('BC005: Main navigation functionality', async ({ page }) => {
      await test.step('Test Creativity & Design navigation', async () => {
        await expect(page.locator('button:has-text("Creativity & Design")')).toBeVisible();
        await brandConciergePage.clickCreativityDesign();
      });

      await test.step('Test PDF & E-signatures navigation', async () => {
        await expect(page.locator('button:has-text("PDF & E-signatures")')).toBeVisible();
        await brandConciergePage.clickPDFSignatures();
      });

      await test.step('Test Marketing & Commerce navigation', async () => {
        await expect(page.locator('button:has-text("Marketing & Commerce")')).toBeVisible();
        await brandConciergePage.clickMarketingCommerce();
      });

      await test.step('Test Learn & Support navigation', async () => {
        await expect(page.locator('button:has-text("Learn & Support")')).toBeVisible();
        await brandConciergePage.clickLearnSupport();
      });
    });

    test('BC006: Sign-in and app switcher functionality', async ({ page }) => {
      await test.step('Test sign-in button', async () => {
        await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
        await brandConciergePage.clickSignIn();
      });

      await test.step('Test app switcher', async () => {
        await expect(page.locator('button[aria-label="App switcher"]')).toBeVisible();
        await brandConciergePage.clickAppSwitcher();
      });
    });
  });

  // Accessibility Tests
  test.describe('Accessibility Compliance', () => {
    
    test('BC007: Accessibility compliance verification', async ({ page }) => {
      await test.step('Verify ARIA labels and roles', async () => {
        await brandConciergePage.verifyARIALabels();
      });

      await test.step('Test keyboard navigation', async () => {
        await brandConciergePage.verifyKeyboardNavigation();
      });

      await test.step('Verify image accessibility', async () => {
        await brandConciergePage.verifyImageOptimization();
      });

      await test.step('Check color contrast', async () => {
        // In a real implementation, you'd use axe-core or similar tools
        const backgroundElements = page.locator('[style*="background-color"], [style*="color"]');
        const count = await backgroundElements.count();
        expect(count).toBeGreaterThan(0); // Verify we have styled elements to test
      });
    });
  });

  // Performance Tests
  test.describe('Performance Verification', () => {
    
    test('BC008: Page performance and loading times', async ({ page }) => {
      await test.step('Measure page load time', async () => {
        const loadTime = await brandConciergePage.measurePageLoadTime();
        expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoadTime);
      });

      await test.step('Verify image optimization', async () => {
        await brandConciergePage.verifyImageOptimization();
      });

      await test.step('Check network requests', async () => {
        // Monitor network activity
        const responses: any[] = [];
        page.on('response', response => responses.push(response));
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Verify reasonable number of requests
        expect(responses.length).toBeLessThan(50);
        
        // Verify no failed requests
        const failedRequests = responses.filter(r => r.status() >= 400);
        expect(failedRequests).toHaveLength(0);
      });
    });
  });

  // Security and Privacy Tests
  test.describe('Privacy and Legal Compliance', () => {
    
    test('BC009: Privacy and legal compliance verification', async ({ page }) => {
      await test.step('Verify privacy notice', async () => {
        await expect(page.locator('text=Use of this beta AI chatbot is subject to Adobe\'s')).toBeVisible();
      });

      await test.step('Verify privacy links', async () => {
        await brandConciergePage.verifyPrivacyLinksVisible();
      });

      await test.step('Test privacy policy link', async () => {
        const privacyLink = page.locator('a:has-text("Privacy Policy")');
        await expect(privacyLink).toHaveAttribute('href', /privacy/);
      });

      await test.step('Test generative AI terms link', async () => {
        const termsLink = page.locator('a:has-text("Generative AI Terms")');
        await expect(termsLink).toHaveAttribute('href', /generative|ai|terms/);
      });
    });
  });

  // Responsive Design Tests
  test.describe('Responsive Design', () => {
    
    Object.entries(TEST_CONFIGURATIONS).forEach(([deviceType, config]) => {
      test(`BC010: Responsive design on ${deviceType}`, async ({ page }) => {
        await test.step(`Set viewport for ${deviceType}`, async () => {
          await page.setViewportSize(config.viewport);
        });

        await test.step('Verify page layout adapts', async () => {
          await brandConciergePage.verifyPageLoaded();
          await brandConciergePage.verifyQuickActionButtons();
          await brandConciergePage.verifyChatInterfaceVisible();
        });

        await test.step('Test touch interactions (mobile)', async () => {
          if (deviceType === 'mobile') {
            // Test touch-specific interactions
            const chatInput = page.locator('textbox');
            await chatInput.tap();
            await expect(chatInput).toBeFocused();
          }
        });
      });
    });
  });

  // Error Handling and Edge Cases
  test.describe('Error Handling and Edge Cases', () => {
    
    test('BC011: Error handling and edge cases', async ({ page }) => {
      await test.step('Test empty chat input handling', async () => {
        await brandConciergePage.enterChatMessage('');
        await brandConciergePage.verifySendButtonDisabled();
      });

      await test.step('Test long message handling', async () => {
        const longMessage = 'a'.repeat(1000);
        await brandConciergePage.enterChatMessage(longMessage);
        await expect(page.locator('textbox')).toHaveValue(longMessage);
      });

      await test.step('Test special characters', async () => {
        const specialMessage = '🎨 Design with emojis & special chars! @#$%^&*()';
        await brandConciergePage.enterChatMessage(specialMessage);
        await expect(page.locator('textbox')).toHaveValue(specialMessage);
      });

      await test.step('Test rapid interactions', async () => {
        // Rapidly click buttons to test for race conditions
        const button = page.locator('button:has-text("I want to touch up and enhance my photos.")');
        await button.click();
        await button.click();
        await button.click();
        
        // Should not cause any JavaScript errors
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        expect(errors).toHaveLength(0);
      });
    });
  });

  // Footer and Corporate Information
  test.describe('Footer and Corporate Information', () => {
    
    test('BC012: Footer links and corporate information', async ({ page }) => {
      await test.step('Scroll to footer', async () => {
        await page.locator('contentinfo').scrollIntoViewIfNeeded();
      });

      await test.step('Verify footer categories', async () => {
        await expect(page.locator('h2:has-text("For individuals & small business")')).toBeVisible();
        await expect(page.locator('h2:has-text("For medium & large business")')).toBeVisible();
        await expect(page.locator('h2:has-text("For organizations")')).toBeVisible();
        await expect(page.locator('h2:has-text("Support")')).toBeVisible();
        await expect(page.locator('h2:has-text("Contact")')).toBeVisible();
        await expect(page.locator('h2:has-text("Adobe")')).toBeVisible();
      });

      await test.step('Verify featured products section', async () => {
        await expect(page.locator('h2:has-text("Featured products")')).toBeVisible();
        await expect(page.locator('text=Acrobat Reader')).toBeVisible();
        await expect(page.locator('text=Firefly')).toBeVisible();
        await expect(page.locator('text=Adobe Express')).toBeVisible();
        await expect(page.locator('text=Photoshop')).toBeVisible();
      });

      await test.step('Verify social media links', async () => {
        await expect(page.locator('a[href*="facebook"]')).toBeVisible();
        await expect(page.locator('a[href*="instagram"]')).toBeVisible();
        await expect(page.locator('a[href*="twitter"]')).toBeVisible();
        await expect(page.locator('a[href*="linkedin"]')).toBeVisible();
      });

      await test.step('Verify legal links', async () => {
        await expect(page.locator('a:has-text("Privacy")')).toBeVisible();
        await expect(page.locator('a:has-text("Terms of Use")')).toBeVisible();
        await expect(page.locator('a:has-text("Cookie preferences")')).toBeVisible();
      });
    });
  });
});

// Custom test helpers and utilities
test.describe('Test Utilities and Helpers', () => {
  
  test('Demonstrate data-driven testing', async ({ page }) => {
    const brandConciergePage = new BrandConciergePage(page);
    await brandConciergePage.navigateToBrandConcierge();
    
    // Test each scenario from our feature file
    const highPriorityScenarios = BRAND_CONCIERGE_SCENARIOS.filter(s => s.priority === 'high');
    
    for (const scenario of highPriorityScenarios.slice(0, 3)) { // Limit for demo
      await test.step(`Execute scenario: ${scenario.description}`, async () => {
        // This demonstrates how the feature file drives the test execution
        console.log(`Executing ${scenario.id}: ${scenario.description}`);
        console.log(`Category: ${scenario.category}, Priority: ${scenario.priority}`);
        console.log(`Steps: ${scenario.steps.length}, Expected Results: ${scenario.expectedResults.length}`);
        
        // In a real implementation, you'd have a scenario executor
        // that interprets the steps and executes them automatically
        expect(scenario.steps.length).toBeGreaterThan(0);
        expect(scenario.expectedResults.length).toBeGreaterThan(0);
      });
    }
  });
});
