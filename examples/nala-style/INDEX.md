# Nala-Style Examples - Index

This folder contains everything you need to understand and adopt Adobe's Nala test pattern from the [Milo repository](https://github.com/adobecom/milo/tree/stage/nala).

## 📚 What's Inside

### **📖 Documentation**

| File | Purpose | Read This If... |
|------|---------|-----------------|
| [README.md](./README.md) | Complete guide with examples | You want to understand the pattern |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick reference card | You need a cheat sheet |
| [../../docs/guides/MILO_NALA_STRUCTURE.md](../../docs/guides/MILO_NALA_STRUCTURE.md) | Deep dive into Nala's structure | You want all the details |
| [../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md](../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md) | Analysis and recommendations | You want to know what to adopt |

### **💻 Code Examples**

| Example | Description | Complexity |
|---------|-------------|------------|
| **Quote Block** | Simple block component test | ⭐ Simple |
| - [quote.spec.ts](./quote.spec.ts) | Test specifications + data | Start here! |
| - [quote.page.ts](./quote.page.ts) | Page object with locators | Clean example |
| - [quote.test.ts](./quote.test.ts) | Test implementation | Easy to follow |
| **Brand Concierge** | Full production-ready test suite | ⭐⭐⭐ Advanced |
| - [brand-concierge.spec.ts](./brand-concierge.spec.ts) | Complete test specifications | Rich metadata |
| - [brand-concierge.page.ts](./brand-concierge.page.ts) | Comprehensive page object | Production-ready |
| - [brand-concierge.test.ts](./brand-concierge.test.ts) | Full test implementations | All test types |

## 🚀 Quick Start

### **1. Start with the Simple Example**

```bash
# Read the simple example
cat examples/nala-style/quote.spec.ts
cat examples/nala-style/quote.page.ts
cat examples/nala-style/quote.test.ts

# Run it
npx playwright test examples/nala-style/quote.test.ts
```

### **2. Study the Full Example**

```bash
# Read the Brand Concierge example
cat examples/nala-style/brand-concierge.spec.ts

# Run it
npx playwright test examples/nala-style/brand-concierge.test.ts
```

### **3. Read the Guides**

```bash
# Quick reference (5 min read)
cat examples/nala-style/QUICK_REFERENCE.md

# Complete guide (15 min read)
cat examples/nala-style/README.md

# Deep analysis (30 min read)
cat docs/guides/WHAT_WE_LEARNED_FROM_NALA.md
```

## 🎯 The Pattern in 30 Seconds

```
feature/
├── feature.spec.ts    ← What to test + data
├── feature.page.ts    ← Where things are (locators)
└── feature.test.ts    ← How to test (logic)
```

**That's it!** 3 files, clear separation of concerns.

## 📊 Comparison

### **Your Current Structure (4 files)**
```
brand-concierge/
├── brand-concierge.page.ts
├── brand-concierge.spec.ts       ← Current tests
├── brand-concierge.feature.ts    ← Scenarios
└── ../test-data/
    └── brand-concierge.data.ts   ← Data
```

### **Nala Structure (3 files)**
```
brand-concierge/
├── brand-concierge.spec.ts       ← Scenarios + Data
├── brand-concierge.page.ts       ← Page object
└── brand-concierge.test.ts       ← Tests
```

### **What Changes?**
1. Merge `feature.ts` + `data.ts` → `spec.ts`
2. Rename current `spec.ts` → `test.ts`
3. Keep `page.ts` as-is

## ✅ Should You Migrate?

### **✅ Yes, if you want:**
- Maximum simplicity
- Adobe's exact pattern
- Easier onboarding
- Everything in one place

### **❌ No, if:**
- Current structure works well
- Team is comfortable with 4 files
- Don't want to refactor
- Your tests are already excellent

### **💡 Recommendation:**
Your current structure is excellent! Only migrate if you strongly prefer the 3-file pattern.

## 🎓 Learning Path

### **Beginner** (30 minutes)
1. Read [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. Look at [quote.spec.ts](./quote.spec.ts)
3. Run the quote tests

### **Intermediate** (1 hour)
1. Read [README.md](./README.md)
2. Study [brand-concierge.spec.ts](./brand-concierge.spec.ts)
3. Compare with your current tests
4. Run the Brand Concierge tests

### **Advanced** (2 hours)
1. Read [WHAT_WE_LEARNED_FROM_NALA.md](../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md)
2. Read [MILO_NALA_STRUCTURE.md](../../docs/guides/MILO_NALA_STRUCTURE.md)
3. Experiment with migrating one feature
4. Decide if you want to adopt this pattern

## 🔥 Run the Examples

```bash
# Run all examples
npx playwright test examples/nala-style/

# Run simple example
npx playwright test examples/nala-style/quote.test.ts

# Run full example
npx playwright test examples/nala-style/brand-concierge.test.ts

# Run by tag
npx playwright test examples/nala-style/ -g@smoke
npx playwright test examples/nala-style/ -g@critical

# Run with UI
npx playwright test examples/nala-style/ --ui
```

## 📖 Key Documents

### **For Quick Reference**
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Cheat sheet

### **For Learning**
- [README.md](./README.md) - Complete guide
- [quote.spec.ts](./quote.spec.ts) - Simple example

### **For Deep Understanding**
- [WHAT_WE_LEARNED_FROM_NALA.md](../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md) - Analysis
- [MILO_NALA_STRUCTURE.md](../../docs/guides/MILO_NALA_STRUCTURE.md) - Detailed structure
- [brand-concierge.spec.ts](./brand-concierge.spec.ts) - Production example

## 💡 Key Takeaways

### **What Nala Does Well**
1. ✅ 3-file simplicity
2. ✅ Data-driven testing
3. ✅ Tag-based execution
4. ✅ Production-proven pattern

### **What You Already Do Well**
1. ✅ TypeScript (better than Nala's JavaScript!)
2. ✅ Rich metadata (JIRA, requirements, etc.)
3. ✅ Helper functions
4. ✅ Well-organized structure

### **Best Approach**
Combine the best of both! Use Nala's simplicity with your TypeScript and rich metadata.

## 🎯 Next Steps

1. **Review** the examples in this folder
2. **Compare** with your current structure
3. **Decide** if you want to adopt the 3-file pattern
4. **Migrate** gradually (if desired)

## 🏆 Bottom Line

**Adobe's Nala pattern is excellent**, but your current framework is **already better in many ways**!

You've already incorporated Nala's best practices:
- ✅ Separation of concerns
- ✅ Page objects
- ✅ Tag-based execution
- ✅ Data-driven testing

And you have significant advantages:
- ✅ TypeScript
- ✅ Rich metadata
- ✅ Better organization

**You don't need to change anything!** But if you want maximum simplicity, this folder shows you how.

---

## 📚 External Resources

- [Milo Repository](https://github.com/adobecom/milo/tree/stage/nala)
- [Nala Framework](https://github.com/adobecom/nala)
- [Playwright Documentation](https://playwright.dev)

---

**Happy Testing!** 🎉

Questions? Check the [README.md](./README.md) or [WHAT_WE_LEARNED_FROM_NALA.md](../../docs/guides/WHAT_WE_LEARNED_FROM_NALA.md).



