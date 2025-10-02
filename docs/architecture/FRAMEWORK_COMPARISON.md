# Framework Comparison: ArchitekTest vs Nala

## Executive Summary

**Verdict**: Your ArchitekTest framework is **better for multi-team organizations**, while [Nala](https://github.com/adobecom/nala) is **simpler for single-team projects**.

**Recommendation**: Keep your structure but **simplify** by adopting Nala's best practices.

---

## Side-by-Side Comparison

| Aspect | Nala (Adobe) | ArchitekTest (Yours) | Winner |
|--------|--------------|----------------------|---------|
| **Language** | JavaScript | TypeScript | ✅ **ArchitekTest** (type safety) |
| **Team Scaling** | Flat structure | Team-based isolation | ✅ **ArchitekTest** (10+ teams) |
| **File Count** | 3 per feature | 3 per feature | 🤝 **Tie** |
| **Simplicity** | Very simple | More complex | ✅ **Nala** (easier to learn) |
| **URL Management** | Basic `envs/` | Advanced multi-env | ✅ **ArchitekTest** (better) |
| **Test Data** | Centralized in spec | Spread across files | ✅ **Nala** (easier to update) |
| **IDE Support** | Basic JS | Full TS autocomplete | ✅ **ArchitekTest** (better DX) |
| **Production Ready** | ✅ Adobe scale | 🔄 Growing | ✅ **Nala** (battle-tested) |
| **Learning Curve** | Easy | Moderate | ✅ **Nala** (faster onboarding) |

---

## What Nala Does Better

### 1. **Simpler File Organization**

```javascript
// Nala's approach
features/quote.spec.js    ← Test data + metadata (clean!)
selectors/quote.page.js   ← Page objects
tests/quote.test.js       ← Test implementation
```

**Why it's better:**
- Clear separation of concerns
- Test data in one place
- Easy to find files

### 2. **Tag-Based Execution**

```bash
# Run all smoke tests
npx playwright test -g @smoke

# Run multiple features
npx playwright test -g "@quote|@marquee"

# Run on PR with labels
PR Label: @smoke @run-on-milo
```

**Why it's better:**
- Flexible test selection
- No need to remember file names
- Great for CI/CD

### 3. **Centralized Test Data**

```javascript
// features/quote.spec.js
module.exports = {
  FeatureName: 'Quote Block',
  features: [
    {
      tcid: '0',
      name: '@Quote',
      path: '/drafts/nala/blocks/quote/quote',
      data: {
        quoteCopy: '3D is a crucial part...',
        figCaption: 'Benny Lee',
        cite: 'Global Manager...',
      },
      tags: '@smoke @regression @milo',
    },
  ],
};
```

**Why it's better:**
- All test data in one file
- Easy to update without touching test logic
- Non-technical people can update data

---

## What ArchitekTest Does Better

### 1. **TypeScript Type Safety**

```typescript
// ArchitekTest
const pages = new AdobePages('stage');  // ← Type-safe!
pages.brandConcierge();  // ← IDE autocomplete!

// Nala (JavaScript)
const url = `${baseURL}/brand-concierge`;  // ← No autocomplete
```

### 2. **Multi-Team Scalability**

```
ArchitekTest:
teams/
├── adobe-team/        ← Team isolation
├── search-team/       ← Independent configs
└── auth-team/         ← Own URLs, own tests

Nala:
tests/
├── quote.test.js      ← All tests mixed together
├── accordion.test.js
└── marquee.test.js
```

**Why it's better:**
- Each team owns their folder
- No conflicts between teams
- Independent deployment

### 3. **Advanced Environment Management**

```typescript
// ArchitekTest - Environment-aware URLs
ENVIRONMENTS.adobe[env].baseURL  ← Multi-env support
getPageURL(baseURL, ADOBE_PAGES.brandConcierge)

// Nala - Basic environment switching
envs['@milo_live']  // ← Hardcoded, less flexible
```

---

## 🎯 Recommended Hybrid Approach

### **Keep from ArchitekTest:**
1. ✅ Team-based folder structure
2. ✅ TypeScript for type safety
3. ✅ Advanced environment/URL management
4. ✅ Colocation (page + tests together)

### **Adopt from Nala:**
1. ✅ Centralized test data
2. ✅ Tag-based test execution
3. ✅ Simpler file naming
4. ✅ 2 files instead of 3

---

## 📁 Simplified Structure

### **Before** (Current - 3 files per feature)
```
teams/adobe-team/brand-concierge/
├── brand-concierge.page.ts      # Page objects
├── brand-concierge.feature.ts   # Gherkin scenarios ← REMOVE
└── brand-concierge.spec.ts      # Test implementation
```

### **After** (Simplified - 2 files per feature)
```
teams/adobe-team/brand-concierge/
├── brand-concierge.page.ts      # Page objects
└── brand-concierge.spec.ts      # Test data + tests (Nala style)
```

---

## 🔄 Migration Example

### **Old Approach** (3 files)

```typescript
// ❌ brand-concierge.feature.ts (Remove this file)
export const brandConciergeFeatures = [
  {
    id: '@BC-001',
    scenario: 'Verify page loads',
    given: 'User navigates to brand concierge',
    when: 'Page loads',
    then: 'All elements are visible',
  },
];

// brand-concierge.spec.ts
test('Verify page loads', async () => {
  // Test implementation referencing feature file
});
```

### **New Approach** (2 files - Nala inspired)

```typescript
// ✅ brand-concierge.spec.ts (Combined)
import { test, expect } from '@playwright/test';
import { BrandConciergePage } from './brand-concierge.page';

// Test data (Nala style)
const TestData = {
  pageLoad: {
    path: '/brand-concierge',
    heading: 'Brand Concierge',
    description: 'AI-powered brand assistant',
  },
  chat: {
    message: 'Hello',
    expectedResponse: /AI response/,
  },
};

// Tests with tags (Nala style)
test.describe('Brand Concierge @smoke @brand-concierge', () => {
  let page: BrandConciergePage;
  
  test.beforeEach(async ({ page: p, baseURL }) => {
    page = new BrandConciergePage(p, 'stage');
    await page.navigate(TestData.pageLoad.path);
  });

  test('@BC-001 Verify page loads', async () => {
    await expect(page.heading).toContainText(TestData.pageLoad.heading);
    await expect(page.description).toContainText(TestData.pageLoad.description);
  });

  test('@BC-002 Verify chat functionality @regression', async () => {
    await page.enterChat(TestData.chat.message);
    await expect(page.chatResponse).toMatch(TestData.chat.expectedResponse);
  });
});
```

---

## 🎨 Best Practices to Adopt

### 1. **Use Tags Everywhere**

```typescript
// test.describe with tags
test.describe('Brand Concierge @smoke @brand-concierge', () => {
  
  // Individual test with tags
  test('should load page @regression @critical', async () => {
    // ...
  });
});

// Run with tags
// npm test -- -g @smoke
// npm test -- -g "@smoke|@regression"
```

### 2. **Centralize Test Data**

```typescript
// ✅ Good: Test data at the top
const TestData = {
  smoke: { /* ... */ },
  regression: { /* ... */ },
  edge_cases: { /* ... */ },
};

test.describe('My Feature', () => {
  test('test 1', async () => {
    // Use TestData.smoke
  });
});
```

### 3. **Keep Page Objects Simple**

```typescript
// ✅ Good: Just locators and actions
export class BrandConciergePage {
  constructor(page: Page) {
    this.heading = page.locator('h1');
    this.chatInput = page.locator('textarea');
  }

  async enterChat(message: string) {
    await this.chatInput.fill(message);
  }
}
```

### 4. **Use Test Steps**

```typescript
// ✅ Good: Clear test steps (like Nala)
test('my test', async ({ page }) => {
  await test.step('Navigate to page', async () => {
    await page.goto('/brand-concierge');
  });

  await test.step('Verify content', async () => {
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

---

## 📊 Decision Matrix

| Your Situation | Recommendation |
|----------------|----------------|
| **Single team, < 10 tests** | Use Nala's simpler structure |
| **2-3 teams, < 50 tests** | Your current structure is fine, simplify to 2 files |
| **5+ teams, 100+ tests** | ✅ **Keep your architecture** (it's better!) |
| **New to Playwright** | Start with Nala's pattern, migrate later |
| **Enterprise scale** | ✅ **Your architecture wins** |

---

## 🚀 Quick Wins: Immediate Improvements

### 1. **Simplify: Merge `.feature.ts` into `.spec.ts`**

```bash
# Remove feature files, move content to spec files
rm teams/adobe-team/brand-concierge/brand-concierge.feature.ts
```

### 2. **Add Tag Support to `package.json`**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test -g @smoke",
    "test:regression": "playwright test -g @regression",
    "test:adobe": "playwright test -g @adobe",
    "test:brand": "playwright test -g @brand-concierge"
  }
}
```

### 3. **Create Test Data Constants**

```typescript
// teams/adobe-team/test-data.ts
export const AdobeTestData = {
  brandConcierge: {
    paths: {
      home: '/brand-concierge',
      help: '/brand-concierge/help',
    },
    content: {
      heading: 'Brand Concierge',
      description: 'AI-powered assistant',
    },
  },
  // ... more test data
};
```

### 4. **Use Playwright Config Projects** (like Nala)

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Quick runs
    { name: 'smoke', testMatch: /.*/, grep: /@smoke/ },
    { name: 'regression', testMatch: /.*/, grep: /@regression/ },
    
    // Team-based
    { name: 'adobe-smoke', testDir: 'teams/adobe-team', grep: /@smoke/ },
    { name: 'search-smoke', testDir: 'teams/search-team', grep: /@smoke/ },
  ],
});

// Run with:
// npx playwright test --project=smoke
// npx playwright test --project=adobe-smoke
```

---

## 🎯 Final Verdict

### **For Single Team (< 3 teams):**
```
Winner: 🏆 Nala (simpler, proven)
Action: Adopt Nala's pattern but use TypeScript
```

### **For Multi-Team (3+ teams):**
```
Winner: 🏆 ArchitekTest (better scalability)
Action: Keep structure, adopt Nala's best practices
```

### **Your Specific Case (Adobe team with growth potential):**
```
Recommendation: Keep ArchitekTest structure, simplify to 2 files
- ✅ Keep: Team isolation, TypeScript, URL management
- ✅ Adopt: Centralized test data, tags, simpler files
- ✅ Remove: .feature.ts files (merge into .spec.ts)
```

---

## 📖 Summary

| Aspect | Nala | ArchitekTest | Best |
|--------|------|--------------|------|
| **Simplicity** | 🥇 | 🥈 | Nala |
| **Scalability** | 🥈 | 🥇 | ArchitekTest |
| **Type Safety** | ❌ | ✅ | ArchitekTest |
| **Learning Curve** | Easy | Medium | Nala |
| **Enterprise Ready** | ✅ | ✅ | Both |
| **Multi-Team** | ❌ | ✅ | ArchitekTest |

**Bottom Line**: Your framework is already **better for enterprise/multi-team** scenarios. Just simplify it by adopting Nala's best practices (centralized test data, 2-file pattern, tags).

---

## 🔗 References

- [Nala Framework](https://github.com/adobecom/nala) - Adobe's open-source Playwright framework
- Your framework docs: `PAGE_URLS_GUIDE.md`, `10_TEAMS_ARCHITECTURE.md`

