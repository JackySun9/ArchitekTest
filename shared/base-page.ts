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
    await expect(this.page.locator('.global-navigation')).toBeVisible();
  }

  async expectAdobeFooter(): Promise<void> {
    await expect(this.page.locator('.global-footer')).toBeVisible();
  }

  // Enhanced waiting strategies
  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForAllImagesLoaded(timeout = 10000): Promise<void> {
    await this.page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every((img) => img.complete);
    }, { timeout });
  }

  async waitForNoLoadingIndicators(timeout = 10000): Promise<void> {
    await this.page.waitForSelector(
      '.loading, .spinner, [aria-busy="true"]',
      { state: 'hidden', timeout }
    ).catch(() => {
      // Loading indicators might not exist, which is fine
    });
  }

  // Common interactions
  async selectDropdown(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.locator(selector).setInputFiles(filePath);
  }

  async hoverElement(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  async doubleClickElement(selector: string): Promise<void> {
    await this.page.locator(selector).dblclick();
  }

  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  // Screenshot helpers
  async takeScreenshot(name: string, fullPage = true): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage,
    });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.locator(selector).screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
    });
  }

  // Local storage helpers
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ([k, v]) => localStorage.setItem(k, v),
      [key, value]
    );
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  async getAllLocalStorage(): Promise<Record<string, string>> {
    return this.page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key) || '';
        }
      }
      return items;
    });
  }

  // Session storage helpers
  async setSessionStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ([k, v]) => sessionStorage.setItem(k, v),
      [key, value]
    );
  }

  async getSessionStorage(key: string): Promise<string | null> {
    return this.page.evaluate((k) => sessionStorage.getItem(k), key);
  }

  async clearSessionStorage(): Promise<void> {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  // Cookie helpers
  async setCookie(name: string, value: string, options?: any): Promise<void> {
    await this.page.context().addCookies([
      {
        name,
        value,
        url: this.page.url(),
        ...options,
      },
    ]);
  }

  async getCookie(name: string): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies.find((c) => c.name === name)?.value;
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  // Viewport helpers
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async setCustomViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  // Text helpers
  async getTextContent(selector: string): Promise<string | null> {
    return this.page.locator(selector).textContent();
  }

  async getInputValue(selector: string): Promise<string> {
    return this.page.locator(selector).inputValue();
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.page.locator(selector).getAttribute(attribute);
  }

  // Visibility helpers
  async isElementVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isElementHidden(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForUrl(urlPattern: string | RegExp, timeout = 10000): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  // JavaScript execution helpers
  async executeScript<T>(script: string): Promise<T> {
    return this.page.evaluate(script);
  }

  async executeScriptOnElement<T>(selector: string, script: string): Promise<T> {
    return this.page.locator(selector).evaluate(script);
  }

  // Alert/Dialog helpers
  async acceptDialog(promptText?: string): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept(promptText));
  }

  async dismissDialog(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.dismiss());
  }

  async getDialogMessage(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once('dialog', (dialog) => {
        resolve(dialog.message());
        dialog.dismiss();
      });
    });
  }

  // Network helpers
  async waitForResponse(urlPattern: string | RegExp, timeout = 30000): Promise<any> {
    return this.page.waitForResponse(urlPattern, { timeout });
  }

  async waitForRequest(urlPattern: string | RegExp, timeout = 30000): Promise<any> {
    return this.page.waitForRequest(urlPattern, { timeout });
  }

  // Performance helpers
  async getPerformanceMetrics(): Promise<any> {
    return this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as any;
      return {
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.fetchStart,
        loadComplete: perfData?.loadEventEnd - perfData?.fetchStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      };
    });
  }

  async getResourceCount(): Promise<number> {
    return this.page.evaluate(() => performance.getEntriesByType('resource').length);
  }
}
