import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation methods
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Common assertions
  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async expectElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementHidden(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  // Common interactions
  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  async waitForElement(selector: string, timeout = 10000): Promise<Locator> {
    return this.page.locator(selector).first();
  }

  // Adobe-specific common elements
  async expectAdobeHeader(): Promise<void> {
    await expect(this.page.locator('nav[aria-label="Main"]')).toBeVisible();
    await expect(this.page.locator('img[alt="Adobe, Inc."]')).toBeVisible();
  }

  async expectAdobeFooter(): Promise<void> {
    await expect(this.page.locator('contentinfo')).toBeVisible();
  }
}
