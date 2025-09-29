import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../../shared/base-page';

export class BrandConciergePage extends BasePage {
  // Main page elements
  private readonly pageHeading: Locator;
  private readonly pageDescription: Locator;
  
  // Quick action buttons
  private readonly exploreTemplatesBtn: Locator;
  private readonly enhancePhotosBtn: Locator;
  private readonly editPDFsBtn: Locator;
  private readonly editVideosBtn: Locator;
  
  // AI Chat interface
  private readonly chatInput: Locator;
  private readonly sendButton: Locator;
  private readonly chatIcon: Locator;
  private readonly privacyNotice: Locator;
  private readonly privacyPolicyLink: Locator;
  private readonly genAITermsLink: Locator;
  
  // Navigation elements
  private readonly creativityDesignNav: Locator;
  private readonly pdfSignaturesNav: Locator;
  private readonly marketingCommerceNav: Locator;
  private readonly learnSupportNav: Locator;
  private readonly signInButton: Locator;
  private readonly appSwitcherButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Main content
    this.pageHeading = page.locator('h2:has-text("Explore what you can do with Adobe apps.")');
    this.pageDescription = page.locator('text=Choose an option or tell us what interests you');
    
    // Quick action buttons
    this.exploreTemplatesBtn = page.locator('button:has-text("I\'d like to explore templates to see what I can create.")');
    this.enhancePhotosBtn = page.locator('button:has-text("I want to touch up and enhance my photos.")');
    this.editPDFsBtn = page.locator('button:has-text("I\'d like to edit PDFs and make them interactive.")');
    this.editVideosBtn = page.locator('button:has-text("I want to turn my clips into polished videos.")');
    
    // AI Chat
    this.chatInput = page.locator('textbox[placeholder*="Tell us what you\'d like to do or create"]');
    this.sendButton = page.locator('button:has-text("Send Message")');
    this.chatIcon = page.locator('img[alt="Ask"]');
    this.privacyNotice = page.locator('text=Use of this beta AI chatbot is subject to Adobe\'s');
    this.privacyPolicyLink = page.locator('a:has-text("Privacy Policy")');
    this.genAITermsLink = page.locator('a:has-text("Generative AI Terms")');
    
    // Navigation
    this.creativityDesignNav = page.locator('button:has-text("Creativity & Design")');
    this.pdfSignaturesNav = page.locator('button:has-text("PDF & E-signatures")');
    this.marketingCommerceNav = page.locator('button:has-text("Marketing & Commerce")');
    this.learnSupportNav = page.locator('button:has-text("Learn & Support")');
    this.signInButton = page.locator('button:has-text("Sign in")');
    this.appSwitcherButton = page.locator('button[aria-label="App switcher"]');
  }

  // Navigation methods
  async navigateToBrandConcierge(): Promise<void> {
    await this.navigate('https://www.stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge');
    await this.waitForPageLoad();
  }

  // Page verification methods
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageDescription).toBeVisible();
    await expect(this.chatInput).toBeVisible();
    await this.expectAdobeHeader();
  }

  async verifyQuickActionButtons(): Promise<void> {
    await expect(this.exploreTemplatesBtn).toBeVisible();
    await expect(this.enhancePhotosBtn).toBeVisible();
    await expect(this.editPDFsBtn).toBeVisible();
    await expect(this.editVideosBtn).toBeVisible();
  }

  // Interaction methods
  async clickExploreTemplates(): Promise<void> {
    await this.exploreTemplatesBtn.click();
  }

  async clickEnhancePhotos(): Promise<void> {
    await this.enhancePhotosBtn.click();
  }

  async clickEditPDFs(): Promise<void> {
    await this.editPDFsBtn.click();
  }

  async clickEditVideos(): Promise<void> {
    await this.editVideosBtn.click();
  }

  // AI Chat methods
  async enterChatMessage(message: string): Promise<void> {
    await this.chatInput.fill(message);
  }

  async sendChatMessage(): Promise<void> {
    await this.sendButton.click();
  }

  async sendChatQuery(query: string): Promise<void> {
    await this.enterChatMessage(query);
    await this.sendChatMessage();
  }

  async verifyChatInterfaceVisible(): Promise<void> {
    await expect(this.chatIcon).toBeVisible();
    await expect(this.chatInput).toBeVisible();
    await expect(this.privacyNotice).toBeVisible();
  }

  async verifySendButtonDisabled(): Promise<void> {
    await expect(this.sendButton).toBeDisabled();
  }

  async verifySendButtonEnabled(): Promise<void> {
    await expect(this.sendButton).toBeEnabled();
  }

  // Navigation interaction methods
  async clickCreativityDesign(): Promise<void> {
    await this.creativityDesignNav.click();
  }

  async clickPDFSignatures(): Promise<void> {
    await this.pdfSignaturesNav.click();
  }

  async clickMarketingCommerce(): Promise<void> {
    await this.marketingCommerceNav.click();
  }

  async clickLearnSupport(): Promise<void> {
    await this.learnSupportNav.click();
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async clickAppSwitcher(): Promise<void> {
    await this.appSwitcherButton.click();
  }

  // Privacy and legal methods
  async clickPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  async clickGenerativeAITerms(): Promise<void> {
    await this.genAITermsLink.click();
  }

  async verifyPrivacyLinksVisible(): Promise<void> {
    await expect(this.privacyPolicyLink).toBeVisible();
    await expect(this.genAITermsLink).toBeVisible();
  }

  // Accessibility methods
  async verifyKeyboardNavigation(): Promise<void> {
    // Test tab navigation through interactive elements
    await this.page.keyboard.press('Tab');
    await expect(this.creativityDesignNav).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await expect(this.signInButton).toBeFocused();
  }

  async verifyARIALabels(): Promise<void> {
    await expect(this.page.locator('nav[aria-label="Main"]')).toBeVisible();
    await expect(this.appSwitcherButton).toHaveAttribute('aria-label', 'App switcher');
  }

  // Performance and loading methods
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.navigateToBrandConcierge();
    await this.verifyPageLoaded();
    return Date.now() - startTime;
  }

  async verifyImageOptimization(): Promise<void> {
    // Check that images have proper loading attributes
    const images = this.page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      // Verify images have alt text or are decorative
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  }
}
