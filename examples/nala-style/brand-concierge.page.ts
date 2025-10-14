/**
 * Brand Concierge Page Object
 * 
 * Pattern: Milo/Nala selectors/*.page.js
 * Source: https://github.com/adobecom/milo/tree/stage/nala
 * 
 * This file contains ONLY:
 * - Locators (where things are)
 * - CSS properties (for validation)
 * - Simple helper methods
 * 
 * NO test logic here!
 */

import { Page, Locator } from '@playwright/test';

export default class BrandConciergePage {
  readonly page: Page;
  
  // ========================================================================
  // LOCATORS (Main Content Only)
  // ========================================================================
  
  // Page elements
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;
  
  // Quick action buttons
  readonly quickActionButtons: Locator;
  
  // AI Chat interface
  readonly chatContainer: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly chatMessages: Locator;
  
  // Privacy links
  readonly privacyLinks: Locator;
  readonly privacyNotice: Locator;
  
  // Images
  readonly images: Locator;

  // ========================================================================
  // CSS PROPERTIES (For Validation - Nala Style)
  // ========================================================================
  
  readonly cssProperties = {
    pageHeading: {
      'font-size': '44px',
      'line-height': '52px',
    },
    chatInput: {
      'min-height': '40px',
    },
    quickActionButton: {
      'min-height': '44px',
      'min-width': '44px',
    },
  };

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================
  
  constructor(page: Page) {
    this.page = page;
    
    // Main content selectors (flexible for robustness)
    this.pageHeading = page.locator('h1, h2').first();
    this.pageDescription = page.locator('text=/Choose an option|what interests you/i').first();
    
    // Quick action buttons
    this.quickActionButtons = page.locator('button:visible');
    
    // AI Chat interface (multiple fallback strategies)
    this.chatContainer = page.locator('[class*="chat"], [role="textbox"], textarea, input[type="text"]').first();
    this.chatInput = page.locator('textarea, input[type="text"], [role="textbox"], [contenteditable="true"]').first();
    this.sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    this.chatMessages = page.locator('[class*="message"], [class*="response"], [role="log"]');
    
    // Privacy elements
    this.privacyLinks = page.locator('a:has-text("Privacy"), a:has-text("Terms")');
    this.privacyNotice = page.locator('text=/beta.*AI.*chatbot/i, text=/subject to.*Adobe/i');
    
    // Images
    this.images = page.locator('img');
  }

  // ========================================================================
  // HELPER METHODS (Simple Only - No Complex Logic)
  // ========================================================================
  
  /**
   * Navigate to Brand Concierge page
   */
  async goto(env: 'dev' | 'stage' | 'prod' = 'stage') {
    const urls = {
      dev: 'https://main--milo--adobecom.hlx.page/brand-concierge',
      stage: 'https://www.stage.adobe.com/brand-concierge',
      prod: 'https://www.adobe.com/brand-concierge',
    };
    
    await this.page.goto(urls[env]);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get button by text (partial match)
   */
  getButtonByText(text: string): Locator {
    return this.page.locator(`button:has-text("${text}")`);
  }

  /**
   * Get link by text
   */
  getLinkByText(text: string): Locator {
    return this.page.locator(`a:has-text("${text}")`);
  }

  /**
   * Verify CSS property (Nala style)
   */
  async verifyCSSProperty(
    locator: Locator,
    property: string,
    expectedValue: string
  ): Promise<boolean> {
    const actualValue = await locator.evaluate(
      (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
      property
    );
    return actualValue.includes(expectedValue);
  }

  /**
   * Get element computed style
   */
  async getComputedStyle(locator: Locator, property: string): Promise<string> {
    return await locator.evaluate(
      (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
      property
    );
  }

  /**
   * Check if element has class
   */
  async hasClass(locator: Locator, className: string): Promise<boolean> {
    return await locator.evaluate(
      (el, cls) => el.classList.contains(cls),
      className
    );
  }

  /**
   * Get all visible elements matching selector
   */
  getVisibleElements(selector: string): Locator {
    return this.page.locator(`${selector}:visible`);
  }

  /**
   * Wait for chat response (simple helper)
   */
  async waitForChatResponse(timeout: number = 10000): Promise<boolean> {
    try {
      await this.chatMessages.first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get page performance metrics (Nala includes performance testing)
   */
  async getPerformanceMetrics() {
    return await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData ? perfData.loadEventEnd - perfData.fetchStart : 0,
        domContentLoaded: perfData ? perfData.domContentLoadedEventEnd - perfData.fetchStart : 0,
        firstContentfulPaint: 0, // Would need PerformanceObserver
      };
    });
  }

  /**
   * Get all console errors (useful for debugging)
   */
  async getConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }
}


