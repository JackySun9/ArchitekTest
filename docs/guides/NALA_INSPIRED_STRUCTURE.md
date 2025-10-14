# Nala-Inspired Test Structure

## 📚 What is Nala?

Nala is Adobe's internal E2E testing framework for Milo-based projects. It's renowned for its **simplicity and clarity**.

## 🎯 Core Principles

### 1. **Three-File Pattern**
Every feature has exactly 3 files:
- `*.spec.js` - Test specifications and data
- `*.page.js` - Page objects with locators
- `*.test.js` - Test implementations

### 2. **Tag-Based Execution**
```bash
npx playwright test -g@smoke        # Run smoke tests
npx playwright test -g@quote        # Run quote block tests
npx playwright test -g@quote|@marquee  # Run multiple tags
```

### 3. **Environment-Aware**
```bash
npx playwright test --project=milo-live-chrome
npx playwright test --project=milo-stage-firefox
```

## 🔄 Comparison: Nala vs Your Framework

| Aspect | Nala | Your Framework | Winner |
|--------|------|----------------|--------|
| **Language** | JavaScript | TypeScript | **You** 🏆 |
| **File Structure** | 3 files (spec, page, test) | 4 files (page, spec, feature, data) | **Nala** (simpler) |
| **Test Data** | In spec file | Separate file | **You** (maintainable) |
| **Metadata** | Basic | Rich (tags, JIRA, requirements) | **You** 🏆 |
| **Tags** | Yes (@smoke, @quote) | Yes (@smoke, @adobe) | **Tie** ✅ |
| **Type Safety** | No | Yes | **You** 🏆 |
| **Learning Curve** | Very low | Low | **Nala** |
| **Scalability** | Good | Excellent | **You** 🏆 |

## 💡 Recommended: Simplified Structure (Best of Both)

Keep your advantages but simplify to **3 files per feature**:

```
teams/adobe-team/
├── brand-concierge/
│   ├── brand-concierge.spec.ts     ← Scenarios + Test Data (merged)
│   ├── brand-concierge.page.ts     ← Page Object (locators + methods)
│   └── brand-concierge.test.ts     ← Test Implementations
└── global/
    ├── adobe-global.spec.ts
    ├── adobe-global.page.ts
    └── adobe-global.test.ts
```

### What Changed?
- ✅ **Merged** `brand-concierge.feature.ts` + `brand-concierge.data.ts` → `brand-concierge.spec.ts`
- ✅ **Renamed** `.spec.ts` → `.test.ts` (for actual tests)
- ✅ Still TypeScript, still rich metadata
- ✅ Simpler mental model: "Spec = What, Page = Where, Test = How"

## 📝 Example: Nala-Inspired File

### `brand-concierge.spec.ts` (Test Specification + Data)

```typescript
/**
 * Brand Concierge Test Specification
 * 
 * This file defines WHAT to test and the test data.
 * Think of it as the "test plan" or "requirements document".
 */

// Test Scenarios
export const SCENARIOS = [
  {
    id: 'BC001',
    name: 'Page loads successfully',
    tags: ['@smoke', '@critical', '@brand-concierge'],
    priority: 'critical',
    
    steps: [
      'Navigate to Brand Concierge page',
      'Verify main heading is visible',
      'Verify quick action buttons are present',
    ],
    
    expectedResults: [
      'Page loads within 3 seconds',
      'Main heading displays correctly',
      'At least 3 quick action buttons are visible',
    ],
  },
  // ... more scenarios
];

// Test Data
export const TEST_DATA = {
  chatQueries: [
    'I need help with photo editing',
    'How do I create a logo?',
    'Edit videos for YouTube',
  ],
  
  quickActions: [
    { text: 'Create a design', expectedProducts: ['Photoshop'] },
    { text: 'Edit a photo', expectedProducts: ['Lightroom'] },
  ],
  
  edgeCases: {
    emptyInput: '',
    longInput: 'a'.repeat(1000),
    specialChars: '!@#$%^&*()',
  },
};

// Helper Functions
export function getScenariosByTag(tag: string) {
  return SCENARIOS.filter(s => s.tags.includes(tag));
}
```

### `brand-concierge.page.ts` (Page Object)

```typescript
/**
 * Brand Concierge Page Object
 * 
 * This file defines WHERE things are on the page (locators).
 * Keep it focused on locators and simple helper methods.
 */

import { Page, Locator } from '@playwright/test';

export class BrandConciergePage {
  readonly page: Page;
  
  // Locators
  readonly heading: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly quickActionButtons: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1, h2').first();
    this.chatInput = page.locator('textarea, input[type="text"]').first();
    this.sendButton = page.locator('button:has-text("Send")').first();
    this.quickActionButtons = page.locator('button:visible');
  }
  
  // Navigation
  async goto() {
    await this.page.goto('/brand-concierge');
    await this.page.waitForLoadState('networkidle');
  }
  
  // Simple interactions
  async typeMessage(message: string) {
    await this.chatInput.fill(message);
  }
  
  async clickSend() {
    await this.sendButton.click();
  }
}
```

### `brand-concierge.test.ts` (Test Implementation)

```typescript
/**
 * Brand Concierge Tests
 * 
 * This file defines HOW to test (the actual test logic).
 * It uses the spec and page object to execute tests.
 */

import { test, expect } from '@playwright/test';
import { BrandConciergePage } from './brand-concierge.page';
import { SCENARIOS, TEST_DATA } from './brand-concierge.spec';

test.describe('Brand Concierge', () => {
  let page: BrandConciergePage;
  
  test.beforeEach(async ({ page: testPage }) => {
    page = new BrandConciergePage(testPage);
    await page.goto();
  });
  
  test('BC001: Page loads successfully @smoke @critical', async () => {
    const scenario = SCENARIOS.find(s => s.id === 'BC001')!;
    
    await test.step(scenario.steps[0], async () => {
      // Already done in beforeEach
    });
    
    await test.step(scenario.steps[1], async () => {
      await expect(page.heading).toBeVisible();
    });
    
    await test.step(scenario.steps[2], async () => {
      await expect(page.quickActionButtons).toHaveCount(3, { minimum: 3 });
    });
  });
  
  test('BC003: Chat interface @ai @chat', async () => {
    for (const query of TEST_DATA.chatQueries) {
      await test.step(`Test query: ${query}`, async () => {
        await page.typeMessage(query);
        await expect(page.sendButton).toBeEnabled();
        await page.clickSend();
        // Verify response...
      });
    }
  });
});
```

## 🚀 Running Tests (Nala Style)

```bash
# Run all tests
npx playwright test

# Run by tag
npx playwright test -g@smoke
npx playwright test -g@critical
npx playwright test -g@brand-concierge
npx playwright test -g@ai

# Run multiple tags
npx playwright test -g"@smoke|@critical"

# Run specific test file
npx playwright test brand-concierge.test.ts

# Run on specific environment
npx playwright test --project=adobe-stage-chrome
```

## 🎨 Benefits of This Approach

### **1. Simpler Mental Model**
- **Spec** = What to test (requirements)
- **Page** = Where things are (locators)
- **Test** = How to test (implementation)

### **2. Easier Onboarding**
- New team members understand it immediately
- Clear responsibility for each file
- Follows industry standard patterns

### **3. Better Maintenance**
- Change test data? → Edit spec file
- Locator changed? → Edit page file
- Test logic changed? → Edit test file

### **4. Team Collaboration**
- **Product Owners** can write/review specs
- **Developers** can update page objects
- **QA Engineers** can write test implementations

## 📋 Migration Guide

### Step 1: Merge Feature + Data → Spec
```typescript
// Before: brand-concierge.feature.ts + brand-concierge.data.ts
// After: brand-concierge.spec.ts (contains both)
```

### Step 2: Rename Test File
```bash
# Before: brand-concierge.spec.ts
# After: brand-concierge.test.ts
```

### Step 3: Keep Page Object
```typescript
// brand-concierge.page.ts stays the same!
```

## 🎯 Decision: Should You Refactor?

### **Refactor If:**
- ✅ You want maximum simplicity
- ✅ Team prefers Nala's proven approach
- ✅ Onboarding new members frequently
- ✅ Want to match Adobe's internal standards

### **Keep Current If:**
- ✅ Current structure works well for your team
- ✅ You prefer separate test data files
- ✅ Don't want to refactor existing tests
- ✅ Your structure is already well-understood

## 💡 Recommendation

**Your current structure is excellent!** You've already adopted the best parts of Nala:
- ✅ Clear separation of concerns
- ✅ Tag-based execution
- ✅ TypeScript for type safety
- ✅ Rich metadata

**Minor improvements you could make:**
1. Simplify file names (optional)
2. Consolidate test data if it's small
3. Add more utility functions like Nala's

**But honestly?** Your framework is already better than Nala in many ways! 🏆

---

## 📚 References

- [Nala Repository](https://github.com/adobecom/nala)
- [Nala README](https://github.com/adobecom/nala/blob/main/README.md)
- [Adobe Milo Tests](https://github.com/adobecom/milo/tree/stage/nala)


