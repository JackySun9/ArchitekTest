# Adobe Global Components - Test Suite

This directory contains tests for **global Adobe components** (header and footer) that appear across **ALL** Adobe pages.

## 📁 File Structure

```
teams/adobe-team/global/
├── README.md                    # This file
├── adobe-global.feature.ts      # Test scenarios and feature definitions
├── adobe-global.page.ts         # Page Object Model (selectors & methods)
└── adobe-global.spec.ts         # Test implementations
```

## 🎯 Purpose

Test **GLOBAL** components once, not in every page test:
- ✅ Global navigation header
- ✅ Sign-in / Account functionality
- ✅ App switcher
- ✅ Global footer
- ✅ Social media links
- ✅ Legal/privacy links

## 📊 Test Coverage

### Header Tests (GH001-GH006)
- **GH001**: Navigation header presence
- **GH002**: Main navigation menu items
- **GH003**: Sign-in and user account
- **GH004**: App switcher functionality
- **GH005**: Header accessibility (defined in feature.ts)
- **GH006**: Header responsive behavior (defined in feature.ts)

### Footer Tests (GF001-GF006)
- **GF001**: Footer presence
- **GF002**: Footer categories and sections
- **GF003**: Featured Adobe products
- **GF004**: Social media links
- **GF005**: Legal and privacy links
- **GF006**: Footer accessibility (defined in feature.ts)

## 🚀 Running Tests

```bash
# Run all global component tests
npx playwright test teams/adobe-team/global/

# Run only header tests
npx playwright test teams/adobe-team/global/ --grep="GH"

# Run only footer tests
npx playwright test teams/adobe-team/global/ --grep="GF"

# Run with UI mode
npx playwright test teams/adobe-team/global/ --ui

# Generate report
npx playwright test teams/adobe-team/global/ --reporter=html
npx playwright show-report
```

## 📝 Test Pattern

### 1. **Feature Definition** (`adobe-global.feature.ts`)
```typescript
export const ADOBE_GLOBAL_SCENARIOS: GlobalTestScenario[] = [
  {
    id: 'GH001',
    description: 'Verify Adobe global navigation header is present',
    priority: 'high',
    category: 'functional',
    component: 'header',
    steps: [...],
    expectedResults: [...]
  }
];
```

### 2. **Page Object** (`adobe-global.page.ts`)
```typescript
export class AdobeGlobalPage extends BasePage {
  async verifyHeaderPresent(): Promise<boolean> { ... }
  async getNavigationLinkCount(): Promise<number> { ... }
  async scrollToFooter(): Promise<boolean> { ... }
  // ... more methods
}
```

### 3. **Test Implementation** (`adobe-global.spec.ts`)
```typescript
test('GH001: Adobe global navigation header is present', async ({ page }) => {
  const scenario = ADOBE_GLOBAL_SCENARIOS.find(s => s.id === 'GH001')!;
  
  const isPresent = await globalPage.verifyHeaderPresent();
  expect(isPresent).toBeTruthy();
});
```

## 🔗 Relationship to Page Tests

### ✅ DO: Test global components HERE
```typescript
// teams/adobe-team/global/adobe-global.spec.ts
test('Header navigation', async ({ page }) => {
  // Test header navigation across ALL pages
});
```

### ❌ DON'T: Duplicate in page tests
```typescript
// teams/adobe-team/brand-concierge/brand-concierge.spec.ts
test('Brand concierge with header', async ({ page }) => {
  await expectAdobeHeader(); // ❌ Already tested in adobe-global.spec.ts
  // Test brand-concierge specific content only
});
```

## 📚 Key Components

### Global Header Elements
- Main navigation (`nav[aria-label="Main"]`)
- Sign-in button (`button:has-text("Sign in")`)
- App switcher (`button[aria-label*="App switcher"]`)
- Navigation links (Creativity, PDF, Marketing, Support)

### Global Footer Elements
- Footer container (`footer, [role="contentinfo"]`)
- Footer sections/categories
- Featured Adobe products
- Social media links (Facebook, Instagram, Twitter, LinkedIn)
- Legal links (Privacy, Terms, Cookies)

## 🎨 Selectors

All selectors are defined in `adobe-global.feature.ts`:

```typescript
export const GLOBAL_COMPONENT_SELECTORS = {
  header: {
    navigation: '.global-navigation, nav[aria-label="Main"], header nav',
    signIn: 'button:has-text("Sign in"), a:has-text("Sign in")',
    appSwitcher: 'button[aria-label*="App switcher" i]',
    // ... more
  },
  footer: {
    main: 'footer, [role="contentinfo"]',
    sections: 'footer h2, footer h3',
    legalLinks: 'a:has-text("Privacy"), a:has-text("Terms")',
    // ... more
  }
};
```

## ✅ Current Test Status

```
✅ 9 tests passing (13.0s)
   - Header: 4 tests
   - Footer: 5 tests
   - 0 failures
```

## 🔄 Adding New Tests

1. **Define scenario** in `adobe-global.feature.ts`:
```typescript
{
  id: 'GH007',
  description: 'New header test',
  // ...
}
```

2. **Add methods** to `adobe-global.page.ts`:
```typescript
async newHeaderMethod(): Promise<boolean> {
  // Implementation
}
```

3. **Implement test** in `adobe-global.spec.ts`:
```typescript
test('GH007: New header test', async ({ page }) => {
  const result = await globalPage.newHeaderMethod();
  expect(result).toBeTruthy();
});
```

## 📖 Related Documentation

- [TEST_ORGANIZATION_GUIDE.md](../../../TEST_ORGANIZATION_GUIDE.md) - Complete guide
- [RESTRUCTURING_COMPLETE.md](../../../RESTRUCTURING_COMPLETE.md) - Migration summary
- [Brand Concierge Tests](../brand-concierge/) - Example page-specific tests

## 💡 Best Practices

1. **Flexible Selectors**: Use multiple fallback strategies
2. **Graceful Degradation**: Handle missing elements with warnings
3. **Clear Logging**: Console output shows what was found/verified
4. **Reusable Methods**: Page object methods work across all Adobe pages
5. **Single Source of Truth**: Test global components once

## 🚨 Important Rules

1. **Never duplicate these tests** in page-specific test suites
2. **Only test global components** - not page-specific content
3. **Use flexible selectors** - components may vary slightly across pages
4. **Handle page fragments** - not all pages include full header/footer
5. **Log warnings** - don't fail if optional elements are missing

---

**Last Updated**: September 30, 2025  
**Test Status**: ✅ All Passing  
**Maintained By**: Adobe Team

