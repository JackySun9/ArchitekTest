import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../../shared/base-page';

/**
 * Adobe Global Components Page Object
 * 
 * This page object contains selectors and methods for GLOBAL components only:
 * - Header (navigation, sign-in, app switcher)
 * - Footer (categories, products, legal links, social media)
 * 
 * These components appear across ALL Adobe pages
 */
export class AdobeGlobalPage extends BasePage {
  // Header Elements
  private readonly globalNavigation: Locator;
  private readonly navigationLinks: Locator;
  private readonly signInButton: Locator;
  private readonly appSwitcherButton: Locator;
  
  // Main Navigation Items
  private readonly creativityNav: Locator;
  private readonly pdfNav: Locator;
  private readonly marketingNav: Locator;
  private readonly supportNav: Locator;
  
  // Footer Elements
  private readonly globalFooter: Locator;
  private readonly footerSections: Locator;
  private readonly footerHeadings: Locator;
  private readonly legalLinks: Locator;
  private readonly socialLinks: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header selectors - flexible to work across different Adobe pages
    this.globalNavigation = page.locator('.global-navigation, nav[aria-label="Main"], header nav').first();
    this.navigationLinks = page.locator('nav a, nav button');
    this.signInButton = page.locator(
      'button:has-text("Sign in"), a:has-text("Sign in"), ' +
      '[aria-label*="sign in" i], [aria-label*="account" i]'
    );
    this.appSwitcherButton = page.locator(
      'button[aria-label*="App switcher" i], ' +
      'button[aria-label*="Apps" i], ' +
      '[data-testid*="app-switcher"], ' +
      '[class*="app-switcher"]'
    );
    
    // Navigation menu items
    this.creativityNav = page.locator('button:has-text("Creativity"), a:has-text("Creativity")');
    this.pdfNav = page.locator('button:has-text("PDF"), a:has-text("PDF")');
    this.marketingNav = page.locator('button:has-text("Marketing"), a:has-text("Marketing")');
    this.supportNav = page.locator('button:has-text("Learn"), button:has-text("Support"), a:has-text("Support")');
    
    // Footer selectors - flexible to work with different footer implementations
    this.globalFooter = page.locator('footer, [role="contentinfo"], #footer, [class*="footer"]').first();
    this.footerSections = page.locator('footer, [role="contentinfo"], [class*="footer"]');
    this.footerHeadings = page.locator('footer h2, footer h3, [role="contentinfo"] h2, [role="contentinfo"] h3');
    this.legalLinks = page.locator('a:has-text("Privacy"), a:has-text("Terms"), a:has-text("Cookie")');
    this.socialLinks = page.locator(
      'a[href*="facebook"], a[href*="instagram"], ' +
      'a[href*="twitter"], a[href*="linkedin"], ' +
      'a[href*="youtube"], a[href*="x.com"]'
    );
  }

  // ========== HEADER METHODS ==========

  /**
   * Verify global navigation header is visible
   */
  async verifyHeaderPresent(): Promise<boolean> {
    try {
      await expect(this.globalNavigation).toBeVisible({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get count of navigation links/buttons
   */
  async getNavigationLinkCount(): Promise<number> {
    return await this.navigationLinks.count();
  }

  /**
   * Verify all main navigation items
   */
  async verifyMainNavigation(): Promise<{ [key: string]: boolean }> {
    return {
      creativity: await this.creativityNav.isVisible({ timeout: 3000 }).catch(() => false),
      pdf: await this.pdfNav.isVisible({ timeout: 3000 }).catch(() => false),
      marketing: await this.marketingNav.isVisible({ timeout: 3000 }).catch(() => false),
      support: await this.supportNav.isVisible({ timeout: 3000 }).catch(() => false)
    };
  }

  /**
   * Check if sign-in button is visible
   */
  async isSignInVisible(): Promise<boolean> {
    return await this.signInButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click sign-in button
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Check if app switcher is visible
   */
  async isAppSwitcherVisible(): Promise<boolean> {
    return await this.appSwitcherButton.isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click app switcher
   */
  async clickAppSwitcher(): Promise<void> {
    await this.appSwitcherButton.click();
  }

  /**
   * Test keyboard navigation through header
   */
  async testHeaderKeyboardNavigation(): Promise<boolean> {
    try {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName,
          inHeader: el?.closest('header, nav') !== null
        };
      });
      return focusedElement.inHeader;
    } catch {
      return false;
    }
  }

  // ========== FOOTER METHODS ==========

  /**
   * Scroll to footer
   */
  async scrollToFooter(): Promise<boolean> {
    try {
      const isVisible = await this.globalFooter.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (isVisible) {
        await this.globalFooter.scrollIntoViewIfNeeded();
        return true;
      } else {
        // Fallback: scroll to bottom
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);
        return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Verify footer is present
   */
  async verifyFooterPresent(): Promise<boolean> {
    const count = await this.globalFooter.count();
    return count > 0;
  }

  /**
   * Get footer sections count
   */
  async getFooterSectionsCount(): Promise<number> {
    return await this.footerHeadings.count();
  }

  /**
   * Get footer text content
   */
  async getFooterTextContent(): Promise<string> {
    try {
      return await this.footerSections.first().textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Check if Adobe product is mentioned in footer
   */
  async isProductInFooter(productName: string): Promise<boolean> {
    const productLocator = this.page.locator(`text=${productName}`).first();
    return await productLocator.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Get all visible Adobe products in footer
   */
  async getVisibleProducts(products: string[]): Promise<string[]> {
    const visibleProducts: string[] = [];
    
    for (const product of products) {
      const isVisible = await this.isProductInFooter(product);
      if (isVisible) {
        visibleProducts.push(product);
      }
    }
    
    return visibleProducts;
  }

  /**
   * Get count of legal links
   */
  async getLegalLinksCount(): Promise<number> {
    let count = 0;
    const links = ['Privacy', 'Terms', 'Cookie'];
    
    for (const linkText of links) {
      const link = this.page.locator(`a:has-text("${linkText}")`).first();
      const isVisible = await link.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) count++;
    }
    
    return count;
  }

  /**
   * Get count of social media links
   */
  async getSocialLinksCount(): Promise<number> {
    return await this.socialLinks.count();
  }

  /**
   * Check if specific social platform link exists
   */
  async hasSocialLink(platform: string): Promise<boolean> {
    const socialLink = this.page.locator(`a[href*="${platform}"]`).first();
    return await socialLink.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Get all visible social platforms
   */
  async getVisibleSocialPlatforms(platforms: string[]): Promise<string[]> {
    const visiblePlatforms: string[] = [];
    
    for (const platform of platforms) {
      const hasLink = await this.hasSocialLink(platform);
      if (hasLink) {
        visiblePlatforms.push(platform);
      }
    }
    
    return visiblePlatforms;
  }

  /**
   * Test keyboard navigation through footer
   */
  async testFooterKeyboardNavigation(): Promise<boolean> {
    try {
      await this.scrollToFooter();
      
      // Find first focusable element in footer
      const firstFooterLink = this.page.locator('footer a, footer button').first();
      await firstFooterLink.focus();
      
      const isFocused = await firstFooterLink.evaluate(el => 
        el === document.activeElement
      );
      
      return isFocused;
    } catch {
      return false;
    }
  }

  /**
   * Verify footer has contentinfo role
   */
  async verifyFooterAccessibility(): Promise<boolean> {
    const footerWithRole = this.page.locator('[role="contentinfo"], footer');
    return await footerWithRole.count() > 0;
  }

  // ========== RESPONSIVE TESTING ==========

  /**
   * Set viewport size for responsive testing
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Check if hamburger menu is visible (mobile)
   */
  async isHamburgerMenuVisible(): Promise<boolean> {
    const hamburger = this.page.locator(
      '[aria-label*="menu" i], ' +
      'button[class*="hamburger"], ' +
      'button[class*="mobile-menu"]'
    );
    return await hamburger.isVisible({ timeout: 3000 }).catch(() => false);
  }
}

