/**
 * Quote Block Page Object
 * 
 * Based on: https://github.com/adobecom/milo/tree/stage/nala
 * Pattern: selectors/*.page.js
 * 
 * This file contains ONLY locators and simple helper methods.
 * Keep it focused - no test logic here!
 */

import { Page, Locator } from '@playwright/test';

/**
 * Quote Block Page Object
 * 
 * Real example from Milo/Nala:
 * https://github.com/adobecom/milo/tree/stage/nala/selectors
 */
export default class Quote {
  readonly page: Page;
  
  // Quote block locators
  readonly quote: Locator;
  readonly quoteImage: Locator;
  readonly quoteCopy: Locator;
  readonly quoteFigCaption: Locator;
  readonly quoteFigCaptionCite: Locator;
  readonly sectionDark: Locator;
  
  // CSS properties for validation (Nala style)
  readonly cssProperties = {
    quote: {
      'max-width': '800px',
      'margin': '0 auto',
    },
    quoteCopy: {
      'font-size': '20px',
      'line-height': '30px',
    },
  };

  constructor(page: Page) {
    this.page = page;
    
    // Quote block locators (following Nala's selector patterns)
    this.quote = page.locator('.quote');
    this.quoteImage = this.quote.locator('.quote-image');
    this.quoteCopy = this.quote.locator('p.quote-copy');
    this.quoteFigCaption = this.quote.locator('p.figcaption');
    this.quoteFigCaptionCite = this.quote.locator('cite p');
    this.sectionDark = page.locator('.section.dark');
  }
  
  /**
   * Simple helper to verify CSS properties
   * (Nala includes CSS verification in their tests)
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
    return actualValue === expectedValue;
  }
}


