# Simplified Approach: Best of Both Worlds

Taking inspiration from [Nala](https://github.com/adobecom/nala) while keeping your multi-team architecture.

---

## 🎯 The Problem

**Your Current Setup:**
- 3 files per feature: `.page.ts`, `.feature.ts`, `.spec.ts`
- Complex for simple tests
- Feature file adds extra layer

**Nala's Setup:**
- 3 files per feature: `.spec.js`, `.page.js`, `.test.js`
- Simpler data structure
- JavaScript only (no types)

**The Solution:**
- **2 files per feature**: `.page.ts`, `.spec.ts`
- TypeScript for safety
- Centralized test data (Nala style)
- Multi-team architecture (your style)

---

## 📁 Simplified Structure

```
teams/
└── adobe-team/
    ├── brand-concierge/
    │   ├── brand-concierge.page.ts    # Page objects
    │   └── brand-concierge.spec.ts    # Test data + tests
    │
    ├── creativity-design/
    │   ├── creativity.page.ts
    │   └── creativity.spec.ts
    │
    └── global/
        ├── adobe-global.page.ts
        └── adobe-global.spec.ts

config/
├── environments.ts          # Environment configs
└── teams/
    └── adobe-urls.ts       # URL configs
```

**Benefits:**
- ✅ 2 files instead of 3 (33% less complexity)
- ✅ Test data with tests (easier to update)
- ✅ Still team-based (scalable)
- ✅ TypeScript (type-safe)

---

## 🔧 Implementation

### Step 1: Page Object (No Change)

```typescript
// teams/adobe-team/brand-concierge/brand-concierge.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../shared/base-page';
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

export class BrandConciergePage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly description: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  
  private baseURL: string;

  constructor(page: Page, env: 'dev' | 'stage' | 'prod' = 'stage') {
    super(page);
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
    
    this.heading = page.locator('h1');
    this.description = page.locator('.description');
    this.chatInput = page.locator('textarea');
    this.sendButton = page.locator('button[type="submit"]');
  }

  // Actions
  async navigate() {
    const url = getPageURL(this.baseURL, ADOBE_PAGES.brandConcierge);
    await this.page.goto(url);
  }

  async enterChat(message: string) {
    await this.chatInput.fill(message);
    await this.sendButton.click();
  }
}
```

### Step 2: Spec File with Test Data (Nala-Inspired)

```typescript
// teams/adobe-team/brand-concierge/brand-concierge.spec.ts
import { test, expect } from '@playwright/test';
import { BrandConciergePage } from './brand-concierge.page';

/**
 * Test Data Configuration (Nala style)
 * 
 * Centralized test data makes it easy to:
 * - Update test data without changing test logic
 * - Share data across tests
 * - Let non-technical people maintain data
 */
const TestData = {
  smoke: {
    id: '@BC-001',
    heading: 'Brand Concierge',
    description: 'AI-powered brand assistant for creative teams',
  },
  chat: {
    id: '@BC-002',
    message: 'Hello, I need help with branding',
    expectedResponse: /brand|design|creative/i,
  },
  accessibility: {
    id: '@BC-003',
    ariaLabels: ['chat input', 'send message'],
  },
  responsive: {
    id: '@BC-004',
    viewports: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
    },
  },
};

/**
 * Brand Concierge Test Suite
 * 
 * Tags explained:
 * @smoke - Quick tests to verify basic functionality
 * @regression - Comprehensive tests for all features
 * @brand-concierge - Feature-specific tag
 * @adobe - Team tag
 */
test.describe('Brand Concierge @adobe @brand-concierge', () => {
  let page: BrandConciergePage;

  test.beforeEach(async ({ page: p, baseURL }) => {
    // Get environment from ENV var or default to 'stage'
    const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';
    page = new BrandConciergePage(p, env);
    await page.navigate();
    console.log(`🌍 Running on: ${env} environment`);
  });

  // =========================================================================
  // SMOKE TESTS
  // =========================================================================

  test(`${TestData.smoke.id} - Page loads with correct content @smoke`, async () => {
    await test.step('Verify page heading', async () => {
      await expect(page.heading).toContainText(TestData.smoke.heading);
    });

    await test.step('Verify page description', async () => {
      await expect(page.description).toContainText(TestData.smoke.description);
    });

    await test.step('Verify chat interface is visible', async () => {
      await expect(page.chatInput).toBeVisible();
      await expect(page.sendButton).toBeVisible();
    });
  });

  // =========================================================================
  // REGRESSION TESTS
  // =========================================================================

  test(`${TestData.chat.id} - Chat functionality works @regression`, async () => {
    await test.step('Enter chat message', async () => {
      await page.enterChat(TestData.chat.message);
    });

    await test.step('Verify response received', async () => {
      // Wait for response (implementation depends on your app)
      await page.page.waitForTimeout(2000);
      const response = await page.page.textContent('body');
      expect(response).toMatch(TestData.chat.expectedResponse);
    });
  });

  test(`${TestData.accessibility.id} - Accessibility compliance @regression @a11y`, async () => {
    await test.step('Verify ARIA labels', async () => {
      for (const label of TestData.accessibility.ariaLabels) {
        const element = page.page.locator(`[aria-label*="${label}" i]`);
        await expect(element).toBeVisible();
      }
    });

    await test.step('Verify keyboard navigation', async () => {
      await page.page.keyboard.press('Tab');
      const focused = await page.page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    });
  });

  test(`${TestData.responsive.id} - Responsive design @regression @responsive`, async () => {
    for (const [device, viewport] of Object.entries(TestData.responsive.viewports)) {
      await test.step(`Test on ${device}`, async () => {
        await page.page.setViewportSize(viewport);
        await expect(page.heading).toBeVisible();
        await expect(page.chatInput).toBeVisible();
        console.log(`✅ ${device} layout verified`);
      });
    }
  });
});
```

---

## 🏃 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run by tag (Nala style)
npm test -- -g @smoke
npm test -- -g @regression
npm test -- -g @brand-concierge
npm test -- -g "@smoke|@regression"

# Run specific suite
npm test brand-concierge.spec

# Run in different environments
TEST_ENV=dev npm test
TEST_ENV=stage npm test
TEST_ENV=prod npm test

# Run with UI
npm test -- --ui
```

### Package.json Scripts (Add These)

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test -g @smoke",
    "test:regression": "playwright test -g @regression",
    "test:adobe": "playwright test teams/adobe-team",
    "test:brand": "playwright test -g @brand-concierge",
    "test:a11y": "playwright test -g @a11y",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:dev": "TEST_ENV=dev playwright test",
    "test:stage": "TEST_ENV=stage playwright test",
    "test:prod": "TEST_ENV=prod playwright test"
  }
}
```

---

## 🎨 Comparison: Before vs After

### **Before** (Complex - 3 files)

```typescript
// ❌ brand-concierge.feature.ts
Given('user navigates to brand concierge')
When('page loads')
Then('all elements visible')

// ❌ brand-concierge.spec.ts
test('feature 1', () => {
  // References feature file
  // Test implementation split across files
});

// ✅ brand-concierge.page.ts
export class BrandConciergePage { /* ... */ }
```

**Issues:**
- 3 files to maintain
- Test data scattered
- Feature file adds complexity
- Harder to understand test flow

### **After** (Simple - 2 files)

```typescript
// ✅ brand-concierge.spec.ts
const TestData = { /* centralized test data */ };

test.describe('Brand Concierge @smoke', () => {
  test('feature 1', async () => {
    // Test data + logic in one place
    // Clear, readable, maintainable
  });
});

// ✅ brand-concierge.page.ts
export class BrandConciergePage { /* ... */ }
```

**Benefits:**
- 2 files to maintain (33% less)
- Test data with tests
- Clear test flow
- Easier to understand

---

## 📊 Real-World Example: Complete Feature

```typescript
// teams/adobe-team/creativity-design/creativity.page.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../../shared/base-page';
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

export class CreativityDesignPage extends BasePage {
  readonly heading: Locator;
  readonly featureCards: Locator;
  readonly ctaButton: Locator;

  private baseURL: string;

  constructor(page: Page, env: 'dev' | 'stage' | 'prod' = 'stage') {
    super(page);
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
    
    this.heading = page.locator('h1');
    this.featureCards = page.locator('.feature-card');
    this.ctaButton = page.locator('button.cta');
  }

  async navigate() {
    const url = getPageURL(this.baseURL, ADOBE_PAGES.creativityDesign);
    await this.page.goto(url);
  }

  async clickFeature(index: number) {
    await this.featureCards.nth(index).click();
  }
}

// teams/adobe-team/creativity-design/creativity.spec.ts
import { test, expect } from '@playwright/test';
import { CreativityDesignPage } from './creativity.page';

const TestData = {
  smoke: {
    heading: 'Creativity & Design',
    minFeatures: 3,
  },
  features: [
    { id: 1, name: 'Photoshop', url: /photoshop/ },
    { id: 2, name: 'Illustrator', url: /illustrator/ },
    { id: 3, name: 'InDesign', url: /indesign/ },
  ],
};

test.describe('Creativity & Design @adobe @creativity', () => {
  let page: CreativityDesignPage;

  test.beforeEach(async ({ page: p }) => {
    const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';
    page = new CreativityDesignPage(p, env);
    await page.navigate();
  });

  test('Page loads correctly @smoke', async () => {
    await expect(page.heading).toContainText(TestData.smoke.heading);
    await expect(page.featureCards).toHaveCount(TestData.smoke.minFeatures, { timeout: 10000 });
  });

  test('All features are clickable @regression', async () => {
    const count = await page.featureCards.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      await test.step(`Click feature ${i + 1}`, async () => {
        await page.clickFeature(i);
        // Verify navigation or modal
      });
    }
  });
});
```

---

## 🚀 Migration Guide

### Step 1: Identify Your Feature Files

```bash
# Find all .feature.ts files
find teams/ -name "*.feature.ts"
```

### Step 2: Merge Feature into Spec

For each feature:

1. **Copy test data** from `.feature.ts` to top of `.spec.ts`
2. **Update tests** to use the test data
3. **Delete** the `.feature.ts` file

### Step 3: Add Tags

```typescript
// Add tags to test.describe and individual tests
test.describe('My Feature @team @feature', () => {
  test('test 1 @smoke', async () => { /* ... */ });
  test('test 2 @regression', async () => { /* ... */ });
});
```

### Step 4: Update Scripts

Add tag-based scripts to `package.json` (see above)

---

## ✅ Benefits Summary

### From Your Architecture:
- ✅ Team-based isolation
- ✅ TypeScript type safety
- ✅ Environment-aware URLs
- ✅ Scales to 10+ teams

### From Nala:
- ✅ Centralized test data
- ✅ Tag-based execution
- ✅ Simpler file structure (2 files)
- ✅ Clear test organization

### Result:
- 🎯 33% less files to maintain
- 🎯 Easier to update test data
- 🎯 Better test organization
- 🎯 Proven patterns from both worlds

---

## 🎯 Next Steps

1. **Try it out**: Convert one feature to new pattern
2. **Compare**: See which is easier to maintain
3. **Decide**: Keep what works for your team
4. **Scale**: Apply to other features gradually

---

## 📚 See Also

- [FRAMEWORK_COMPARISON.md](./FRAMEWORK_COMPARISON.md) - Detailed comparison
- [PAGE_URLS_GUIDE.md](./PAGE_URLS_GUIDE.md) - URL management
- [Nala Framework](https://github.com/adobecom/nala) - Adobe's framework

---

**Remember**: The best framework is the one your team can use effectively. Start simple, add complexity only when needed.

