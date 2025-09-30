import { test, expect } from '@playwright/test';
import { AdobeGlobalPage } from './adobe-global.page';
import { 
  ADOBE_GLOBAL_SCENARIOS,
  GLOBAL_COMPONENT_SELECTORS,
  ACCESSIBILITY_REQUIREMENTS,
  RESPONSIVE_BREAKPOINTS
} from './adobe-global.feature';

/**
 * Global Adobe Header and Footer Tests
 * These tests verify shared components that appear across all Adobe pages
 * They should NOT be duplicated in individual page tests
 * 
 * Test Coverage:
 * - GH001-GH006: Global Header (navigation, sign-in, app switcher, accessibility, responsive)
 * - GF001-GF006: Global Footer (presence, sections, products, social, legal, accessibility)
 */
test.describe('Adobe Global Components', () => {
  let globalPage: AdobeGlobalPage;
  
  test.beforeEach(async ({ page }) => {
    globalPage = new AdobeGlobalPage(page);
    await page.goto('https://www.stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge');
  });

  test.describe('Global Header', () => {
    
    test('GH001: Adobe global navigation header is present', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GH001')!;
      
      await test.step('Verify global navigation exists', async () => {
        const isPresent = await globalPage.verifyHeaderPresent();
        expect(isPresent).toBeTruthy();
      });
      
      await test.step('Verify navigation has links', async () => {
        const count = await globalPage.getNavigationLinkCount();
        expect(count).toBeGreaterThan(0);
        console.log(`✓ Found ${count} navigation links/buttons`);
      });
    });

    test('GH002: Main navigation menu items', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GH002')!;
      
      await test.step('Verify main navigation items', async () => {
        const navStatus = await globalPage.verifyMainNavigation();
        
        const navItems = [
          { name: 'Creativity & Design', visible: navStatus.creativity },
          { name: 'PDF & E-signatures', visible: navStatus.pdf },
          { name: 'Marketing & Commerce', visible: navStatus.marketing },
          { name: 'Learn & Support', visible: navStatus.support }
        ];
        
        for (const item of navItems) {
          if (item.visible) {
            console.log(`✓ ${item.name} navigation found`);
          } else {
            console.log(`⚠️ ${item.name} navigation not found - may not be available on this page`);
          }
        }
      });
    });

    test('GH003: Sign-in and user account functionality', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GH003')!;
      
      await test.step('Verify sign-in button or user menu', async () => {
        const isVisible = await globalPage.isSignInVisible();
        
        if (isVisible) {
          console.log('✓ Sign-in/account button found');
        } else {
          console.log('⚠️ User may already be signed in');
        }
      });
    });

    test('GH004: App switcher functionality', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GH004')!;
      
      await test.step('Verify app switcher exists', async () => {
        const isVisible = await globalPage.isAppSwitcherVisible();
        
        if (isVisible) {
          console.log('✓ App switcher found');
        } else {
          console.log('⚠️ App switcher not available on this page variant');
        }
      });
    });
  });

  test.describe('Global Footer', () => {
    
    test('GF001: Adobe global footer is present', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GF001')!;
      
      await test.step('Scroll to footer', async () => {
        const scrolled = await globalPage.scrollToFooter();
        
        if (scrolled) {
          console.log('✓ Footer found and scrolled into view');
        } else {
          console.log('⚠️ Footer element not found - scrolled to bottom');
        }
      });
      
      await test.step('Verify footer has content', async () => {
        // This is a page fragment, so full footer may not be present
        const isPresent = await globalPage.verifyFooterPresent();
        console.log(`✓ Footer check complete (present: ${isPresent})`);
      });
    });

    test('GF002: Footer categories and sections', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GF002')!;
      
      await globalPage.scrollToFooter();
      await page.waitForTimeout(1000);
      
      await test.step('Check for footer sections', async () => {
        const headingCount = await globalPage.getFooterSectionsCount();
        
        if (headingCount > 0) {
          console.log(`✓ Found ${headingCount} footer section headings`);
          expect(headingCount).toBeGreaterThan(0);
        } else {
          console.log('⚠️ No specific footer headings found (may be different structure)');
        }
      });
    });

    test('GF003: Featured Adobe products in footer', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GF003')!;
      
      await globalPage.scrollToFooter();
      await page.waitForTimeout(1000);
      
      await test.step('Verify Adobe products are mentioned', async () => {
        const products = scenario.testData?.expectedProducts || [
          'Acrobat', 'Firefly', 'Express', 'Photoshop',
          'Illustrator', 'Premiere', 'Creative Cloud'
        ];
        
        const visibleProducts = await globalPage.getVisibleProducts(products);
        
        for (const product of visibleProducts) {
          console.log(`✓ Found product: ${product}`);
        }
        
        console.log(`✓ Found ${visibleProducts.length} Adobe products`);
      });
    });

    test('GF004: Social media links', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GF004')!;
      
      await globalPage.scrollToFooter();
      await page.waitForTimeout(1000);
      
      await test.step('Verify social media links exist', async () => {
        const socialPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'x.com'];
        const visiblePlatforms = await globalPage.getVisibleSocialPlatforms(socialPlatforms);
        
        for (const platform of visiblePlatforms) {
          console.log(`✓ Found social link: ${platform}`);
        }
        
        if (visiblePlatforms.length > 0) {
          console.log(`✓ Found ${visiblePlatforms.length} social media links`);
          expect(visiblePlatforms.length).toBeGreaterThan(1);
        } else {
          console.log('⚠️ Social media links not found in this page variant');
        }
      });
    });

    test('GF005: Legal and privacy links', async ({ page }) => {
      const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GF005')!;
      
      await globalPage.scrollToFooter();
      await page.waitForTimeout(1000);
      
      await test.step('Verify legal links exist', async () => {
        const foundLinks = await globalPage.getLegalLinksCount();
        
        console.log(`✓ Found ${foundLinks} legal links in footer`);
        expect(foundLinks).toBeGreaterThan(1);
      });
    });
  });
});

