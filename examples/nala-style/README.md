# Nala-Style Test Examples

> **Based on**: [https://github.com/adobecom/milo/tree/stage/nala](https://github.com/adobecom/milo/tree/stage/nala)

This folder contains examples of how to structure tests following Adobe's **actual production pattern** from the Milo/Nala repository.

## 📁 Structure

```
nala-style/
├── quote.spec.ts              ← Simple example (Quote block)
├── quote.page.ts
├── quote.test.ts
├── brand-concierge.spec.ts    ← Full example (Brand Concierge)
├── brand-concierge.page.ts
├── brand-concierge.test.ts
└── README.md (this file)
```

## 🎯 The 3-File Pattern

### **1. \*.spec.ts** - Test Specification + Data

- What to test
- Test data
- Test metadata (tags, IDs, requirements)

### **2. \*.page.ts** - Page Object

- Locators (where things are)
- CSS properties (for validation)
- Simple helper methods

### **3. \*.test.ts** - Test Implementation

- Actual test logic
- Uses spec and page object
- Follows test steps

## 🚀 Quick Start

### Run the Examples

```bash
# Run Quote block tests
npx playwright test examples/nala-style/quote.test.ts

# Run Brand Concierge tests
npx playwright test examples/nala-style/brand-concierge.test.ts

# Run by tag
npx playwright test examples/nala-style -g@smoke
npx playwright test examples/nala-style -g@critical
```

### Run Specific Tests

```bash
# Run only BC001 (page load test)
npx playwright test examples/nala-style/brand-concierge.test.ts -g"BC001"

# Run only accessibility tests
npx playwright test examples/nala-style/brand-concierge.test.ts -g"@a11y"

# Run smoke tests
npx playwright test examples/nala-style -g"@smoke"
```

## 📚 Learn from the Examples

### Simple Example: Quote Block

Start with `quote.spec.ts`, `quote.page.ts`, and `quote.test.ts` to understand the basic pattern.

**Key Points:**

- Spec file has all test data in one place
- Page object has ONLY locators
- Test file uses both to execute tests

### Full Example: Brand Concierge

See `brand-concierge.spec.ts`, `brand-concierge.page.ts`, and `brand-concierge.test.ts` for a production-ready implementation.

**Includes:**

- Multiple test scenarios (BC001-BC010)
- Rich metadata (JIRA tickets, requirements)
- Tag-based execution
- Performance testing
- Accessibility testing
- Responsive design testing

## 🔄 Compare with Your Current Structure

### Your Current Structure (4 files)

```
teams/adobe-team/brand-concierge/
├── brand-concierge.page.ts        ← Page object
├── brand-concierge.spec.ts        ← Tests (current)
├── brand-concierge.feature.ts     ← Scenarios + metadata
└── test-data/
    └── brand-concierge.data.ts    ← Test data
```

### Nala-Inspired Structure (3 files)

```
teams/adobe-team/brand-concierge/
├── brand-concierge.spec.ts        ← Scenarios + metadata + data
├── brand-concierge.page.ts        ← Page object
└── brand-concierge.test.ts        ← Test implementation
```

### What Changes?

1. **Merge** `brand-concierge.feature.ts` + test data → `brand-concierge.spec.ts`
2. **Rename** current `brand-concierge.spec.ts` → `brand-concierge.test.ts`
3. **Keep** `brand-concierge.page.ts` as-is

## 💡 Key Benefits

### **1. Simplicity**

- Only 3 files per feature
- Clear responsibility for each file
- Easy to navigate

### **2. Maintainability**

- Change test data? Edit spec file
- Locator changed? Edit page file
- Test logic changed? Edit test file

### **3. Team Collaboration**

- Product Owners can review/update spec files
- Developers can maintain page objects
- QA can write test implementations

### **4. Tag-Based Execution**

```bash
# Run critical tests before deployment
npx playwright test -g@critical

# Run smoke tests in CI/CD
npx playwright test -g@smoke

# Run AI-related tests
npx playwright test -g@ai
```

## 📖 Code Examples

### Example 1: Accessing Test Data

```typescript
// In your test
import { BrandConciergeSpec } from './brand-concierge.spec';

const feature = BrandConciergeSpec.features[0]; // BC001
console.log(feature.data.expectedHeading); // Access data
console.log(feature.tags); // Access tags
console.log(feature.tcid); // Test Case ID
```

### Example 2: Using Page Object

```typescript
// In your test
import BrandConciergePage from './brand-concierge.page';

test('Example', async ({ page }) => {
  const brandConciergePage = new BrandConciergePage(page);
  await brandConciergePage.goto('stage');

  // Use locators
  await expect(brandConciergePage.pageHeading).toBeVisible();

  // Use helper methods
  const metrics = await brandConciergePage.getPerformanceMetrics();
});
```

### Example 3: Tag Filtering

```typescript
// Get tests by tag
import { getFeaturesByTag } from './brand-concierge.spec';

const smokeTests = getFeaturesByTag('@smoke');
const criticalTests = getFeaturesByTag('@critical');
const aiTests = getFeaturesByTag('@ai');

// Run specific tests
smokeTests.forEach((feature) => {
  console.log(`Running ${feature.tcid}: ${feature.name}`);
});
```

## 🎨 Best Practices

### **Spec File (\*.spec.ts)**

✅ **DO:**

- Keep all test data in one place
- Use descriptive test case IDs (BC001, BC002)
- Add rich metadata (tags, requirements, JIRA tickets)
- Include helper functions for filtering

❌ **DON'T:**

- Add test logic here
- Add locators here
- Make it too complex

### **Page File (\*.page.ts)**

✅ **DO:**

- Keep ONLY locators and simple helpers
- Use flexible selectors for robustness
- Add CSS properties for validation
- Keep methods simple

❌ **DON'T:**

- Add test logic here
- Add complex business logic
- Add test assertions

### **Test File (\*.test.ts)**

✅ **DO:**

- Use test steps for clarity
- Reference spec for test data
- Use page object for interactions
- Keep tests readable

❌ **DON'T:**

- Hardcode test data
- Use direct selectors (use page object)
- Make tests too long

## 🚀 Running Tests

### Basic Commands

```bash
# Run all examples
npx playwright test examples/nala-style/

# Run specific feature
npx playwright test examples/nala-style/brand-concierge.test.ts

# Run with UI
npx playwright test examples/nala-style/ --ui

# Run headed mode
npx playwright test examples/nala-style/ --headed

# Run specific browser
npx playwright test examples/nala-style/ --project=chromium
```

### Tag-Based Execution

```bash
# Smoke tests only
npx playwright test examples/nala-style/ -g@smoke

# Critical tests only
npx playwright test examples/nala-style/ -g@critical

# Multiple tags
npx playwright test examples/nala-style/ -g"@smoke|@critical"

# Exclude tags
npx playwright test examples/nala-style/ --grep-invert="@slow"
```

### Environment-Specific

```bash
# Run on dev
npx playwright test examples/nala-style/ --project=adobe-dev-chrome

# Run on stage
npx playwright test examples/nala-style/ --project=adobe-stage-chrome

# Run on prod
npx playwright test examples/nala-style/ --project=adobe-prod-chrome
```

## 📊 Test Reports

After running tests, view the report:

```bash
npx playwright show-report
```

## 🎯 Next Steps

1. **Review** the examples in this folder
2. **Compare** with your current structure
3. **Decide** if you want to refactor
4. **Migrate** one feature at a time (if desired)

## 📚 Additional Resources

- [Milo Nala Structure Guide](../../docs/guides/MILO_NALA_STRUCTURE.md)
- [Nala-Inspired Structure Guide](../../docs/guides/NALA_INSPIRED_STRUCTURE.md)
- [Milo Repository](https://github.com/adobecom/milo/tree/stage/nala)
- [Nala Repository](https://github.com/adobecom/nala)

## ❓ Questions?

### Q: Should I refactor my existing tests?

**A:** Not necessarily! Your current structure is excellent. Only refactor if:

- You want maximum simplicity
- You prefer Adobe's exact pattern
- You're onboarding new team members frequently

### Q: What's the main advantage?

**A:** Simplicity! 3 files vs 4 files, and everything for a feature is in one place.

### Q: Can I mix both approaches?

**A:** Yes! You can have some features using the 3-file pattern and others using your current structure.

### Q: Do I lose any functionality?

**A:** No! The Nala pattern supports everything you're currently doing - tags, metadata, rich test data, etc.

## 🏆 Summary

**Nala's Strength:** Simplicity and proven production pattern
**Your Strength:** TypeScript, rich metadata, better organization

**Best Approach:** Combine both! Use Nala's 3-file simplicity with your TypeScript and rich metadata.

---

**Happy Testing!** 🎉
