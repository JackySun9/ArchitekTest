# What We Learned from Milo/Nala

> **Source**: [https://github.com/adobecom/milo/tree/stage/nala](https://github.com/adobecom/milo/tree/stage/nala)

Adobe's **production test suite** for their Milo marketing pages. This is what they actually use, not a demo or tutorial.

## 🎯 TL;DR - The Core Pattern

```
3 files per feature:
├── *.spec.js    ← What to test + data
├── *.page.js    ← Where things are (locators)
└── *.test.js    ← How to test (logic)
```

**That's it.** Simple, proven, scalable.

## 📚 What Makes Nala Special?

### **1. Extreme Simplicity**

- Only 3 files per feature (not 4, not 5)
- Each file has ONE clear purpose
- No confusion about where things go

### **2. Data-Driven**

Everything is driven from the spec file:

```javascript
// features/quote.spec.js
module.exports = {
  FeatureName: 'Quote Block',
  features: [
    {
      tcid: '0',
      name: '@Quote @smoke @regression',
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

**Everything you need** in one place!

### **3. Tag-Based Execution**

```bash
npx playwright test -g@smoke         # Smoke tests
npx playwright test -g@regression    # Regression tests
npx playwright test -g@quote         # Feature-specific tests
npx playwright test -g"@smoke|@critical"  # Multiple tags
```

Clean, simple, powerful.

### **4. Production-Ready**

This isn't a toy example. Adobe uses this for:

- Multiple teams
- Multiple environments (dev/stage/prod)
- Hundreds of tests
- CI/CD integration

## 🔍 Deep Dive: The Pattern

### **File 1: features/quote.spec.js** (Test Specification)

**Purpose**: Define WHAT to test and the test data

```javascript
module.exports = {
  FeatureName: 'Quote Block',
  features: [
    {
      tcid: '0', // Test Case ID
      name: '@Quote @smoke', // Test name (includes tags!)
      path: '/path/to/page', // Where to test
      data: {
        // Test data
        quoteCopy: 'Expected text',
        figCaption: 'Author name',
      },
      tags: '@smoke @regression', // Tags for filtering
    },
  ],
};
```

**Key Insights:**

- ✅ Test data lives WITH the test spec
- ✅ Tags are part of the test name
- ✅ Simple JavaScript object (easy to understand)
- ✅ Test Case ID for traceability

### **File 2: selectors/quote.page.js** (Page Object)

**Purpose**: Define WHERE things are (locators only!)

```javascript
export default class Quote {
  constructor(page) {
    this.page = page;

    // Locators
    this.quote = this.page.locator('.quote');
    this.quoteCopy = this.quote.locator('p.quote-copy');
    this.quoteFigCaption = this.quote.locator('p.figcaption');
    this.quoteFigCaptionCite = this.quote.locator('cite p');
  }

  // Optional: CSS properties for validation
  get cssProperties() {
    return {
      quote: {
        'max-width': '800px',
      },
    };
  }
}
```

**Key Insights:**

- ✅ ONLY locators (no test logic!)
- ✅ Simple constructor pattern
- ✅ Chainable locators (`this.quote.locator()`)
- ✅ Optional CSS validation properties

### **File 3: tests/quote.test.js** (Test Implementation)

**Purpose**: Define HOW to test (the actual test logic)

```javascript
import { test, expect } from '@playwright/test';
import Quote from '../selectors/quote.page.js';
import spec from '../features/quote.spec.js';

let obj;

test.describe('Milo Quote block test suite', () => {
  test.beforeEach(async ({ page }) => {
    obj = new Quote(page);
  });

  // Test - 0
  test(`${spec.features[0].name}`, async ({ page, baseURL }) => {
    const feature = spec.features[0];

    // Step 1: Navigate
    await test.step('Go to Quote block test page', async () => {
      await page.goto(`${baseURL}${feature.path}`);
      await page.waitForLoadState('domcontentloaded');
    });

    // Step 2: Verify content
    await test.step('Verify Quote block content', async () => {
      const { data } = feature;

      await expect(obj.quote).toBeVisible();
      await expect(obj.quoteCopy).toContainText(data.quoteCopy);
      await expect(obj.quoteFigCaption).toContainText(data.figCaption);
    });
  });
});
```

**Key Insights:**

- ✅ Imports both spec and page object
- ✅ Test name comes from spec (`${spec.features[0].name}`)
- ✅ Data comes from spec (`feature.data`)
- ✅ Uses `test.step()` for clarity
- ✅ Clean, readable test structure

## 💎 Key Principles from Nala

### **1. Separation of Concerns**

| File        | Contains                        | Doesn't Contain           |
| ----------- | ------------------------------- | ------------------------- |
| **spec.js** | Test specs, test data, metadata | Test logic, locators      |
| **page.js** | Locators, simple helpers        | Test logic, test data     |
| **test.js** | Test implementation             | Hardcoded data, selectors |

### **2. Data-Driven Testing**

All test data in the spec file means:

- ✅ Easy to add new test cases (just add to array)
- ✅ Easy to update test data (one place)
- ✅ Non-technical people can update data
- ✅ Can generate from external sources (API, DB, CSV)

### **3. Tag-Based Organization**

Tags enable:

- ✅ Run smoke tests before deployment
- ✅ Run regression tests nightly
- ✅ Run feature-specific tests during development
- ✅ Flexible test execution in CI/CD

### **4. Test Case IDs**

Every test has a unique ID (tcid):

- ✅ Traceability to requirements
- ✅ Link to JIRA tickets
- ✅ Reference in bug reports
- ✅ Track test history

## 📊 Comparison: Your Framework vs Nala

| Aspect                | Your Framework                  | Nala          | Winner             |
| --------------------- | ------------------------------- | ------------- | ------------------ |
| **Language**          | TypeScript ✨                   | JavaScript    | **You** 🏆         |
| **Files per feature** | 4                               | 3             | **Nala**           |
| **Type Safety**       | ✅ Yes                          | ❌ No         | **You** 🏆         |
| **Simplicity**        | Good                            | Excellent     | **Nala**           |
| **Metadata**          | Rich (JIRA, requirements, etc.) | Basic         | **You** 🏆         |
| **Test Data**         | Separate folder                 | In spec file  | **Nala** (simpler) |
| **Tags**              | Array                           | In string     | **Tie** ✅         |
| **Helper Functions**  | Many ✨                         | Few           | **You** 🏆         |
| **Production Use**    | New                             | Battle-tested | **Nala**           |
| **Learning Curve**    | Low                             | Very Low      | **Nala**           |

### **Verdict**: Your framework is better in many ways! 🎉

But Nala's simplicity is worth learning from.

## 💡 What You Should Adopt

### **✅ Definitely Adopt**

1. **3-file pattern** - Merge feature + data into spec
2. **Tag-based execution** - Already doing this! Keep it!
3. **Test case IDs** - Already have this! Keep it!
4. **Simple page objects** - Your page objects are already great!

### **🤔 Consider Adopting**

1. **Consolidate test data** - Move test-data folder into spec files
2. **Rename files** - Use `.test.ts` for actual tests
3. **Simpler structure** - Reduce from 4 files to 3

### **❌ Don't Adopt (You're Better!)**

1. **JavaScript** - Keep TypeScript! Type safety is valuable
2. **Limited metadata** - Keep your rich metadata!
3. **Basic helpers** - Keep your helper functions!

## 🚀 Recommended Action Plan

### **Option A: Keep Your Current Structure** ⭐ Recommended

Your current structure is excellent! You've already learned from Nala:

- ✅ Separation of concerns
- ✅ Tag-based execution
- ✅ Data-driven testing
- ✅ Page objects

**And you have advantages:**

- ✅ TypeScript (type safety)
- ✅ Rich metadata
- ✅ Helper functions
- ✅ Better organization

**Verdict**: Your structure is actually BETTER than Nala in many ways!

### **Option B: Simplified Structure** (If you want maximum simplicity)

**Migrate to 3-file pattern:**

```
Before (4 files):
├── brand-concierge.page.ts
├── brand-concierge.spec.ts      ← Current tests
├── brand-concierge.feature.ts   ← Scenarios
└── test-data/
    └── brand-concierge.data.ts  ← Data

After (3 files):
├── brand-concierge.spec.ts      ← Scenarios + Data
├── brand-concierge.page.ts      ← Page object
└── brand-concierge.test.ts      ← Tests
```

**Steps:**

1. Merge `brand-concierge.feature.ts` + test data → `brand-concierge.spec.ts`
2. Rename current `brand-concierge.spec.ts` → `brand-concierge.test.ts`
3. Keep `brand-concierge.page.ts` as-is

### **Option C: Hybrid Approach** (Best of both worlds)

Use 3-file pattern but keep your advantages:

- ✅ TypeScript
- ✅ Rich metadata
- ✅ Helper functions
- ✅ 3-file simplicity

**See examples**: `/examples/nala-style/`

## 📦 What We've Created for You

### **1. Examples**

```
examples/nala-style/
├── quote.spec.ts                   ← Simple example
├── quote.page.ts
├── quote.test.ts
├── brand-concierge.spec.ts         ← Full example
├── brand-concierge.page.ts
├── brand-concierge.test.ts
└── README.md
```

### **2. Documentation**

```
docs/guides/
├── MILO_NALA_STRUCTURE.md          ← Detailed guide
├── NALA_INSPIRED_STRUCTURE.md      ← Original guide
└── WHAT_WE_LEARNED_FROM_NALA.md    ← This file
```

## 🎓 Key Takeaways

### **What Nala Does Well**

1. ✅ **Simplicity** - 3 files, clear purpose
2. ✅ **Data-driven** - All data in spec
3. ✅ **Tags** - Flexible execution
4. ✅ **Production-proven** - Actually used by Adobe

### **What You Do Well**

1. ✅ **TypeScript** - Type safety
2. ✅ **Rich metadata** - Better traceability
3. ✅ **Organization** - Well-structured
4. ✅ **Helper functions** - More maintainable

### **Best Approach**

Combine the best of both:

- Nala's simplicity (3-file pattern)
- Your advantages (TypeScript, metadata, helpers)

## 🎯 Final Recommendation

### **Don't Refactor Everything!**

Your current structure is **excellent**. You've already incorporated Nala's best practices:

- ✅ Separation of concerns
- ✅ Tag-based execution
- ✅ Data-driven testing
- ✅ Page objects

### **Optional Improvements**

If you want to simplify:

1. Consolidate to 3 files per feature
2. Move test data into spec files
3. Use `.test.ts` for actual tests

But these are **optional**. Your current structure is production-ready!

### **What to Do Next**

1. ✅ **Review** the examples in `/examples/nala-style/`
2. ✅ **Compare** with your current tests
3. ✅ **Decide** if you want to refactor (probably not!)
4. ✅ **Keep** what works for your team

## 🏆 Conclusion

Adobe's Nala is a **great example** of simplicity and production-readiness.

But your framework **already incorporates** Nala's best practices and **adds significant improvements**:

- TypeScript for type safety
- Rich metadata for traceability
- Better organization
- More maintainable

**You don't need to change anything!** But if you want maximum simplicity, the 3-file pattern is there for you.

---

## 📚 References

- [Milo Nala Repository](https://github.com/adobecom/milo/tree/stage/nala)
- [Nala Framework](https://github.com/adobecom/nala)
- [Your Examples](/examples/nala-style/)
- [Detailed Guide](/docs/guides/MILO_NALA_STRUCTURE.md)

**Happy Testing!** 🎉
