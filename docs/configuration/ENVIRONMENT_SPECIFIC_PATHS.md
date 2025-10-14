# 🌍 Environment-Specific Path Configuration

**How to handle different page paths across dev, stage, and prod environments**

---

## 📋 Problem

Sometimes pages have different URLs in different environments:

```
Stage:  https://stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge
Prod:   https://www.adobe.com/products/brand-concierge
```

Notice the **path is different**, not just the domain!

---

## ✅ Solution

Use the **environment-specific overrides** system already built into your framework.

---

## 🔧 Step 1: Configure Environment-Specific Paths

### File: `config/teams/adobe-urls.ts`

```typescript
/**
 * Environment-specific overrides
 * 
 * Define different paths for different environments
 */
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    // Development paths
    brandConcierge: '/dev/brand-concierge',
    profile: '/dev/user/profile',
  },
  stage: {
    // Stage paths
    brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
    profile: '/stage/user/profile',
  },
  prod: {
    // Production paths (often cleaner)
    brandConcierge: '/products/brand-concierge',
    profile: '/user/profile',
  },
};
```

---

## 🎯 Step 2: Use Environment-Aware Helper

### File: `brand-concierge.page.ts`

```typescript
import { getAdobePages } from '../../../config/teams/adobe-urls';

export class BrandConciergePage extends BasePage {
  private env: 'dev' | 'stage' | 'prod';

  constructor(page: Page, env: 'dev' | 'stage' | 'prod' = 'stage') {
    super(page);
    this.env = env;
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  async navigateToBrandConcierge(): Promise<void> {
    // ✨ This automatically gets the right path for the environment
    const pages = getAdobePages(this.env);
    const url = getPageURL(this.baseURL, pages.brandConcierge);
    
    console.log(`🌍 Navigating to: ${url}`);
    await this.navigate(url);
  }

  getBrandConciergeURL(): string {
    const pages = getAdobePages(this.env);
    return getPageURL(this.baseURL, pages.brandConcierge);
  }
}
```

---

## 📝 Step 3: Use in Tests

### File: `brand-concierge.spec.ts`

```typescript
test.describe('Brand Concierge', () => {
  test('works in stage', async ({ page }) => {
    const brandPage = new BrandConciergePage(page, 'stage');
    await brandPage.navigateToBrandConcierge();
    // Navigates to: https://stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge
  });

  test('works in prod', async ({ page }) => {
    const brandPage = new BrandConciergePage(page, 'prod');
    await brandPage.navigateToBrandConcierge();
    // Navigates to: https://www.adobe.com/products/brand-concierge
  });
});
```

---

## 🔄 How It Works

### 1. **Base Configuration** (Default paths)

```typescript
export const ADOBE_PAGES: PageUrls = {
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  profile: '/profile',
};
```

### 2. **Environment Overrides** (Specific paths)

```typescript
export const ADOBE_PAGES_OVERRIDES = {
  prod: {
    brandConcierge: '/products/brand-concierge',  // Different in prod!
  },
};
```

### 3. **Helper Function** (Merges them)

```typescript
export function getAdobePages(env: 'dev' | 'stage' | 'prod' = 'stage'): PageUrls {
  const overrides = ADOBE_PAGES_OVERRIDES[env];
  return {
    ...ADOBE_PAGES,        // Base paths
    ...overrides,          // Environment-specific overrides
  };
}
```

### 4. **Result:**

```typescript
// Stage uses default path
getAdobePages('stage').brandConcierge 
// → '/cc-shared/fragments/uar/brand-concierge/brand-concierge'

// Prod uses override path
getAdobePages('prod').brandConcierge  
// → '/products/brand-concierge'
```

---

## 🎨 Real-World Examples

### Example 1: Different API Versions

```typescript
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    api: {
      brandConcierge: '/api/v2/brand-concierge',  // Testing v2
    },
  },
  stage: {
    api: {
      brandConcierge: '/api/v2/brand-concierge',  // Testing v2
    },
  },
  prod: {
    api: {
      brandConcierge: '/api/v1/brand-concierge',  // Stable v1
    },
  },
};
```

### Example 2: Feature Flags in Path

```typescript
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    brandConcierge: '/beta/brand-concierge',  // Beta version
  },
  stage: {
    brandConcierge: '/preview/brand-concierge',  // Preview version
  },
  prod: {
    brandConcierge: '/brand-concierge',  // Stable version
  },
};
```

### Example 3: Localization

```typescript
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    home: '/en-us/',
    brandConcierge: '/en-us/brand-concierge',
  },
  stage: {
    home: '/en-us/',
    brandConcierge: '/en-us/products/brand-concierge',
  },
  prod: {
    home: '/',  // Production handles locale routing
    brandConcierge: '/products/brand-concierge',
  },
};
```

---

## 🚀 Usage in Different Scenarios

### Scenario 1: Environment Variable

```typescript
// Set environment via ENV var
const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';
const page = new BrandConciergePage(page, env);
```

### Scenario 2: Test Configuration

```typescript
// In playwright.config.ts
use: {
  baseURL: ENVIRONMENTS.adobe[process.env.TEST_ENV || 'stage'].baseURL,
},
```

### Scenario 3: Dynamic Environment

```typescript
test.describe('Multi-environment tests', () => {
  ['dev', 'stage', 'prod'].forEach(env => {
    test(`Brand Concierge works in ${env}`, async ({ page }) => {
      const brandPage = new BrandConciergePage(page, env as any);
      await brandPage.navigateToBrandConcierge();
      
      // Same test, different environment!
      await expect(page.locator('h1')).toBeVisible();
    });
  });
});
```

---

## 🎯 Best Practices

### 1. **Use Environment Variables**

```bash
# Run tests in different environments
TEST_ENV=dev npm run test:adobe
TEST_ENV=stage npm run test:adobe
TEST_ENV=prod npm run test:adobe
```

### 2. **Document Path Differences**

```typescript
export const ADOBE_PAGES_OVERRIDES = {
  stage: {
    // Stage: Fragment path (pre-release)
    brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  },
  prod: {
    // Prod: Product path (released)
    brandConcierge: '/products/brand-concierge',
  },
};
```

### 3. **Add Logging**

```typescript
async navigateToBrandConcierge(): Promise<void> {
  const pages = getAdobePages(this.env);
  const url = getPageURL(this.baseURL, pages.brandConcierge);
  
  console.log(`🌍 Environment: ${this.env}`);
  console.log(`🔗 URL: ${url}`);
  
  await this.navigate(url);
}
```

### 4. **Validate Configuration**

```typescript
// Add to your setup
test.beforeAll(() => {
  const validation = validateEnvironments();
  if (!validation.valid) {
    throw new Error(`Invalid environments: ${validation.errors.join(', ')}`);
  }
});
```

---

## 🔍 Debugging Tips

### 1. **Check Which URL is Being Used**

```typescript
const brandPage = new BrandConciergePage(page, 'prod');
const url = brandPage.getBrandConciergeURL();
console.log('Will navigate to:', url);
```

### 2. **Test All Environments**

```bash
# Quick check all environments
for env in dev stage prod; do
  echo "Testing $env..."
  TEST_ENV=$env npm run test:adobe:smoke
done
```

### 3. **Verify Path Overrides**

```typescript
import { getAdobePages } from './config/teams/adobe-urls';

// Check what paths are being used
console.log('Dev:', getAdobePages('dev').brandConcierge);
console.log('Stage:', getAdobePages('stage').brandConcierge);
console.log('Prod:', getAdobePages('prod').brandConcierge);
```

---

## 📊 Quick Reference

| Environment | Base URL | Brand Concierge Path | Full URL |
|-------------|----------|---------------------|----------|
| **dev** | `https://dev.adobe.com` | `/dev/brand-concierge` | `https://dev.adobe.com/dev/brand-concierge` |
| **stage** | `https://stage.adobe.com` | `/cc-shared/fragments/...` | `https://stage.adobe.com/cc-shared/fragments/...` |
| **prod** | `https://www.adobe.com` | `/products/brand-concierge` | `https://www.adobe.com/products/brand-concierge` |

---

## ✅ Summary

**Your framework already has this built-in! Just:**

1. ✅ Update `ADOBE_PAGES_OVERRIDES` in `config/teams/adobe-urls.ts`
2. ✅ Use `getAdobePages(env)` in your page objects
3. ✅ Pass environment to page object constructor
4. ✅ Run tests with `TEST_ENV` environment variable

**That's it!** Your tests will automatically use the correct paths for each environment. 🎉

---

## 🔗 Related Documentation

- [Configuration Guide](PLAYWRIGHT_CONFIG_GUIDE.md)
- [URL Management](PAGE_URLS_GUIDE.md)
- [Environment Configuration](../architecture/YOUR_ENHANCED_ARCHITECTURE.md)

