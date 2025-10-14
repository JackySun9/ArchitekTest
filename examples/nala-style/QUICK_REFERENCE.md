# Nala Pattern - Quick Reference

> **Source**: [github.com/adobecom/milo/tree/stage/nala](https://github.com/adobecom/milo/tree/stage/nala)

## 📁 The 3-File Pattern

```
feature-name/
├── feature-name.spec.ts    ← What to test + data
├── feature-name.page.ts    ← Where things are (locators)
└── feature-name.test.ts    ← How to test (logic)
```

## 📝 File Templates

### **1. *.spec.ts** (Test Specification + Data)

```typescript
export const FeatureSpec = {
  name: 'Feature Name',
  features: [
    {
      tcid: 'F001',                        // Test Case ID
      name: '@Feature @smoke @critical',   // Name with tags
      path: '/path/to/test',               // URL path
      tags: ['@smoke', '@critical'],       // Tags array
      priority: 'critical',
      category: 'functional',
      
      data: {                              // Test data
        expectedHeading: 'Hello World',
        buttons: ['Button 1', 'Button 2'],
      },
      
      requirements: ['REQ-001'],           // Optional
      jiraTickets: ['JIRA-123'],          // Optional
      estimatedTime: 60,                   // Optional (seconds)
    },
  ],
};
```

### **2. *.page.ts** (Page Object)

```typescript
import { Page, Locator } from '@playwright/test';

export default class FeaturePage {
  readonly page: Page;
  
  // Locators
  readonly heading: Locator;
  readonly button: Locator;
  
  // CSS properties (optional)
  readonly cssProperties = {
    heading: {
      'font-size': '32px',
    },
  };

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1').first();
    this.button = page.locator('button').first();
  }
  
  // Simple helpers only
  async goto() {
    await this.page.goto('/feature');
    await this.page.waitForLoadState('networkidle');
  }
}
```

### **3. *.test.ts** (Test Implementation)

```typescript
import { test, expect } from '@playwright/test';
import FeaturePage from './feature-name.page';
import { FeatureSpec } from './feature-name.spec';

let page: FeaturePage;

test.describe('Feature Test Suite', () => {
  
  test.beforeEach(async ({ page: testPage }) => {
    page = new FeaturePage(testPage);
    await page.goto();
  });

  test(`${FeatureSpec.features[0].name}`, async () => {
    const feature = FeatureSpec.features[0];
    
    await test.step('Test step 1', async () => {
      await expect(page.heading).toBeVisible();
      await expect(page.heading).toContainText(feature.data.expectedHeading);
    });
    
    await test.step('Test step 2', async () => {
      await expect(page.button).toBeEnabled();
    });
  });
});
```

## 🚀 Common Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test feature-name.test.ts

# Run by tag
npx playwright test -g@smoke
npx playwright test -g@critical
npx playwright test -g"@smoke|@critical"

# Run with UI
npx playwright test --ui

# Run headed
npx playwright test --headed

# Run specific project
npx playwright test --project=chromium
```

## 🎯 Quick Tips

### **Spec File** ✅ DO / ❌ DON'T

✅ **DO:**
- Put all test data here
- Use descriptive test case IDs
- Add tags for filtering
- Include metadata (JIRA, requirements)

❌ **DON'T:**
- Add test logic
- Add locators
- Make it too complex

### **Page File** ✅ DO / ❌ DON'T

✅ **DO:**
- Keep ONLY locators
- Use flexible selectors
- Add simple helper methods
- Document selectors

❌ **DON'T:**
- Add test logic
- Add test assertions
- Add complex business logic

### **Test File** ✅ DO / ❌ DON'T

✅ **DO:**
- Use test steps
- Get data from spec
- Use page object for interactions
- Keep tests readable

❌ **DON'T:**
- Hardcode test data
- Use direct selectors
- Make tests too long

## 🏷️ Tag Conventions

| Tag | Purpose | Example |
|-----|---------|---------|
| `@smoke` | Quick validation tests | Critical path tests |
| `@regression` | Full test suite | All tests |
| `@critical` | Must-pass tests | Blocking issues |
| `@feature-name` | Feature-specific | `@brand-concierge` |
| `@ai` | AI-related tests | Chat, recommendations |
| `@a11y` | Accessibility tests | WCAG compliance |
| `@performance` | Performance tests | Load times |
| `@mobile` | Mobile-specific | Responsive design |

## 📊 Helper Functions

```typescript
// Get features by tag
export function getFeaturesByTag(tag: string): Feature[] {
  return FeatureSpec.features.filter(f => f.tags.includes(tag));
}

// Get feature by ID
export function getFeatureById(tcid: string): Feature | undefined {
  return FeatureSpec.features.find(f => f.tcid === tcid);
}

// Get features by priority
export function getFeaturesByPriority(priority: string): Feature[] {
  return FeatureSpec.features.filter(f => f.priority === priority);
}

// Usage in tests
const smokeTests = getFeaturesByTag('@smoke');
const criticalTests = getFeaturesByPriority('critical');
```

## 🔄 Migration Checklist

### From 4 Files → 3 Files

- [ ] Create new `feature-name.spec.ts`
  - [ ] Copy scenarios from `feature-name.feature.ts`
  - [ ] Copy test data from `test-data/feature-name.data.ts`
  - [ ] Add helper functions

- [ ] Rename `feature-name.spec.ts` → `feature-name.test.ts`
  - [ ] Update imports to use new spec file
  - [ ] Update test data references

- [ ] Keep `feature-name.page.ts` as-is
  - [ ] No changes needed!

- [ ] Delete old files
  - [ ] Remove `feature-name.feature.ts`
  - [ ] Remove `test-data/feature-name.data.ts`

- [ ] Test everything
  - [ ] Run tests to verify migration
  - [ ] Check tag-based execution
  - [ ] Verify test data access

## 📚 Examples

See full examples in this folder:
- `quote.spec.ts`, `quote.page.ts`, `quote.test.ts` - Simple
- `brand-concierge.spec.ts`, `brand-concierge.page.ts`, `brand-concierge.test.ts` - Full

## 🎓 Learn More

- [README.md](./README.md) - Detailed guide
- [MILO_NALA_STRUCTURE.md](../../docs/guides/MILO_NALA_STRUCTURE.md) - Full docs
- [WHAT_WE_LEARNED_FROM_NALA.md](../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md) - Analysis

## 💡 Key Takeaway

**3 files, 3 purposes:**
1. **Spec** = What to test + data
2. **Page** = Where things are
3. **Test** = How to test

That's it! 🎉



