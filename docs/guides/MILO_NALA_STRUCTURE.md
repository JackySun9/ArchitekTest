# Milo/Nala Test Structure

> **Source**: [https://github.com/adobecom/milo/tree/stage/nala](https://github.com/adobecom/milo/tree/stage/nala)

This is Adobe's **actual production test suite** for their Milo marketing pages. It's battle-tested and used by Adobe teams.

## 📁 Real Nala Folder Structure

```
nala/
├── features/
│   ├── quote.spec.js          ← Test specs + data
│   ├── marquee.spec.js
│   ├── text.spec.js
│   └── accordion.spec.js
├── selectors/
│   ├── quote.page.js          ← Page objects (locators only)
│   ├── marquee.page.js
│   ├── text.page.js
│   └── accordion.page.js
├── tests/
│   ├── quote.test.js          ← Test implementations
│   ├── marquee.test.js
│   ├── text.test.js
│   └── accordion.test.js
└── utils/
    └── webutil.js             ← Shared utilities
```

## 🎯 The 3-File Pattern (Real Example)

### **1. features/quote.spec.js** - Test Specification + Data

```javascript
module.exports = {
  FeatureName: 'Quote Block',
  features: [
    {
      tcid: '0',                    // Test Case ID
      name: '@Quote @smoke @regression @milo',  // Test name with tags
      path: '/drafts/nala/blocks/quote/quote',  // URL path
      data: {                       // Test data
        quoteCopy: '3D is a crucial part of how we explore the brand in a digital workflow',
        figCaption: 'Benny Lee',
        cite: 'Global Manager of Experiential Design, Coca-Cola Company',
      },
      tags: '@smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Quote-Contained @smoke @regression @milo',
      path: '/drafts/nala/blocks/quote/quote-contained',
      data: {
        quoteCopy: 'The future of work is creative collaboration',
        figCaption: 'John Smith',
        cite: 'Creative Director, Adobe',
        variant: 'contained',
      },
      tags: '@smoke @regression @milo',
    },
  ],
};
```

**Key Points:**
- ✅ All test data in ONE place
- ✅ Test case IDs for traceability
- ✅ Tags embedded in test names
- ✅ Path-based navigation
- ✅ Simple JavaScript object structure

### **2. selectors/quote.page.js** - Page Object (Locators Only)

```javascript
export default class Quote {
  constructor(page) {
    this.page = page;
    
    // Quote block locators
    this.quote = this.page.locator('.quote');
    this.quoteImage = this.quote.locator('.quote-image');
    this.quoteCopy = this.quote.locator('p.quote-copy');
    this.quoteFigCaption = this.quote.locator('p.figcaption');
    this.quoteFigCaptionCite = this.quote.locator('cite p');
    this.sectionDark = this.page.locator('.section.dark');
  }
  
  // CSS properties for validation
  get cssProperties() {
    return {
      quote: {
        'max-width': '800px',
        'margin': '0 auto',
      },
    };
  }
}
```

**Key Points:**
- ✅ ONLY locators and CSS properties
- ✅ No test logic
- ✅ Simple constructor pattern
- ✅ Reusable across tests

### **3. tests/quote.test.js** - Test Implementation

```javascript
import { test, expect } from '@playwright/test';
import Quote from '../selectors/quote.page.js';
import spec from '../features/quote.spec.js';

// Store page object
let obj;

test.describe('Milo Quote block test suite', () => {
  
  // Before each test
  test.beforeEach(async ({ page }) => {
    obj = new Quote(page);
  });

  // Test - 0
  test(`${spec.features[0].name}`, async ({ page, baseURL }) => {
    const feature = spec.features[0];
    console.info(`${baseURL}${feature.path}`);
    
    // Test step-1: Navigate
    await test.step('Go to Quote block test page', async () => {
      await page.goto(`${baseURL}${feature.path}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(`${baseURL}${feature.path}`);
    });

    // Test step-2: Verify content
    await test.step('Verify Quote block content / specs', async () => {
      const { data } = feature;
      
      await expect(obj.quote).toBeVisible();
      await expect(obj.quoteCopy).toContainText(data.quoteCopy);
      await expect(obj.quoteFigCaption).toContainText(data.figCaption);
      await expect(obj.quoteFigCaptionCite).toContainText(data.cite);
    });
  });
});
```

**Key Points:**
- ✅ Imports spec and page object
- ✅ Uses test steps for clarity
- ✅ Data-driven from spec file
- ✅ Clean test structure

## 🚀 Running Tests (Nala Way)

```bash
# Run all tests
npx playwright test

# Run by tag
npx playwright test -g@smoke
npx playwright test -g@regression
npx playwright test -g@Quote

# Run multiple tags
npx playwright test -g"@smoke|@regression"

# Run specific test file
npx playwright test tests/quote.test.js

# Run on specific project
npx playwright test --project=milo-live-chrome
npx playwright test --project=milo-stage-firefox
```

## 🎨 Key Differences vs Your Current Structure

| Aspect | Your Current | Milo/Nala | Recommendation |
|--------|-------------|-----------|----------------|
| **Files per feature** | 4 (page, spec, feature, data) | 3 (spec, page, test) | **Consolidate to 3** |
| **Spec file** | Separate feature + data | Combined | **Combine them** |
| **Test file naming** | `.spec.ts` | `.test.js` | **Use `.test.ts`** |
| **Data location** | Separate folder | In spec file | **Move to spec** |
| **TypeScript** | ✅ Yes | ❌ No | **Keep TypeScript!** 🏆 |
| **Rich metadata** | ✅ Yes | ❌ Limited | **Keep yours!** 🏆 |
| **Tags in test name** | Separate array | In string | **Both work** ✅ |

## 💡 Recommended Structure for Your Project

Adopt Nala's simplicity + keep your advantages:

```
teams/adobe-team/
├── brand-concierge/
│   ├── brand-concierge.spec.ts     ← Scenarios + Test Data (merged)
│   ├── brand-concierge.page.ts     ← Page Object (locators)
│   └── brand-concierge.test.ts     ← Test Implementation
└── global/
    ├── adobe-global.spec.ts
    ├── adobe-global.page.ts
    └── adobe-global.test.ts
```

### Migration Steps:

1. **Merge** `brand-concierge.feature.ts` + test data → `brand-concierge.spec.ts`
2. **Rename** current `.spec.ts` → `.test.ts`
3. **Keep** page objects as-is
4. **Keep** TypeScript and rich metadata

## 📝 Example: Brand Concierge (Nala Style)

### `brand-concierge.spec.ts`

```typescript
export interface Feature {
  tcid: string;
  name: string;
  path: string;
  tags: string[];
  data?: any;
}

export const BrandConciergeSpec = {
  name: 'Brand Concierge',
  features: [
    {
      tcid: 'BC001',
      name: '@BrandConcierge @smoke @critical',
      path: '/brand-concierge',
      tags: ['@smoke', '@critical', '@brand-concierge'],
      data: {
        heading: 'Explore what you can do with Adobe apps.',
        description: 'Choose an option or tell us what interests you',
        quickActions: ['Create a design', 'Edit a photo', 'Make a video'],
      },
    },
    {
      tcid: 'BC003',
      name: '@BrandConcierge @ai @chat',
      path: '/brand-concierge',
      tags: ['@ai', '@chat', '@brand-concierge'],
      data: {
        queries: [
          'I need help with photo editing',
          'How do I create a logo?',
          'Edit videos for YouTube',
        ],
      },
    },
  ],
};
```

### `brand-concierge.page.ts` (Keep as is!)

```typescript
export class BrandConciergePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly quickActionButtons: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1, h2').first();
    this.chatInput = page.locator('textarea, input').first();
    this.sendButton = page.locator('button:has-text("Send")').first();
    this.quickActionButtons = page.locator('button:visible');
  }
  
  async goto() {
    await this.page.goto('/brand-concierge');
    await this.page.waitForLoadState('networkidle');
  }
}
```

### `brand-concierge.test.ts`

```typescript
import { test, expect } from '@playwright/test';
import { BrandConciergePage } from './brand-concierge.page';
import { BrandConciergeSpec } from './brand-concierge.spec';

let page: BrandConciergePage;

test.describe('Brand Concierge Test Suite', () => {
  
  test.beforeEach(async ({ page: testPage }) => {
    page = new BrandConciergePage(testPage);
    await page.goto();
  });

  test(`${BrandConciergeSpec.features[0].name}`, async () => {
    const feature = BrandConciergeSpec.features[0];
    
    await test.step('Verify page heading', async () => {
      await expect(page.heading).toContainText(feature.data.heading);
    });
    
    await test.step('Verify quick action buttons', async () => {
      const count = await page.quickActionButtons.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
```

## ✨ Benefits of Nala's Approach

### **1. Simplicity**
- 3 files per feature (easy to find)
- Clear responsibility per file
- Minimal cognitive load

### **2. Maintainability**
- Change data? → Edit spec file
- Locator changed? → Edit page file
- Test logic changed? → Edit test file

### **3. Team Collaboration**
- Product owners review spec files
- Developers update page objects
- QA writes test implementations

### **4. Tag-Based Execution**
```bash
npx playwright test -g@smoke        # Smoke tests only
npx playwright test -g@critical     # Critical tests only
npx playwright test -g@ai           # AI-related tests
```

### **5. Data-Driven Testing**
- All test data in spec file
- Easy to add new test cases
- Simple to update test data

## 🎯 Summary

### **What Nala Does Well:**
✅ 3-file pattern (spec, page, test)
✅ Data in spec file
✅ Tag-based execution
✅ Simple, proven structure

### **What You Do Better:**
✅ TypeScript (type safety)
✅ Rich metadata (JIRA, requirements)
✅ Helper functions
✅ Better organized test data

### **Best of Both Worlds:**
✅ Adopt Nala's 3-file simplicity
✅ Keep your TypeScript and metadata
✅ Consolidate feature + data → spec
✅ Use `.test.ts` for actual tests

---

## 📚 References

- [Milo Nala Folder](https://github.com/adobecom/milo/tree/stage/nala)
- [Nala Repository](https://github.com/adobecom/nala)
- Your existing docs in `/docs/guides/`


