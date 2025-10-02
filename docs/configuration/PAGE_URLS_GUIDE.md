# Page URLs Management Guide

This guide explains how to organize and manage URLs for different pages within a team, with full environment support.

## Table of Contents

- [Overview](#overview)
- [Three Approaches](#three-approaches)
  - [Option 1: Simple Configuration Object](#option-1-simple-configuration-object-recommended-for-small-teams)
  - [Option 2: Pages Configuration Class](#option-2-pages-configuration-class-recommended-for-large-teams)
  - [Option 3: Inline in Page Objects](#option-3-inline-in-page-objects-not-recommended)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Environment-Specific Overrides](#environment-specific-overrides)
- [Migration Guide](#migration-guide)

---

## Overview

When managing multiple pages within a team, you need to:

1. **Centralize URLs** - Avoid hardcoding URLs in multiple places
2. **Support Multiple Environments** - Dev, Stage, Prod
3. **Make URLs Reusable** - Share across page objects and tests
4. **Handle Query Parameters** - Build URLs with dynamic parameters
5. **Type Safety** - Get IDE autocomplete and type checking

---

## Three Approaches

### **Option 1: Simple Configuration Object** (Recommended for small teams)

**Location:** `config/teams/adobe-urls.ts`

#### Structure

```typescript
// config/teams/adobe-urls.ts
export const ADOBE_PAGES = {
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  creativityDesign: '/products/creativity-design',
  login: '/auth/login',
  // ... more pages
};

export function getPageURL(baseURL: string, pagePath: string): string {
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const cleanPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  return `${cleanBaseURL}${cleanPath}`;
}
```

#### Usage in Page Objects

```typescript
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

export class BrandConciergePage extends BasePage {
  private baseURL: string;

  constructor(page: Page, env: 'dev' | 'stage' | 'prod' = 'stage') {
    super(page);
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  async navigateToBrandConcierge(): Promise<void> {
    const url = getPageURL(this.baseURL, ADOBE_PAGES.brandConcierge);
    await this.navigate(url);
  }
}
```

#### Usage in Tests

```typescript
import { test } from '@playwright/test';
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

test('should load brand concierge page', async ({ page }) => {
  const env = process.env.TEST_ENV || 'stage';
  const baseURL = ENVIRONMENTS.adobe[env].baseURL;
  const url = getPageURL(baseURL, ADOBE_PAGES.brandConcierge);
  
  await page.goto(url);
  // ... test assertions
});
```

#### Pros & Cons

✅ **Pros:**
- Simple and straightforward
- Easy to maintain
- Clear separation of concerns
- Works well for small to medium teams

❌ **Cons:**
- No type safety for URL building
- Manual URL concatenation
- Less convenient for complex URLs with params

---

### **Option 2: Pages Configuration Class** (Recommended for large teams)

**Location:** `teams/adobe-team/adobe-pages.config.ts`

#### Structure

```typescript
// teams/adobe-team/adobe-pages.config.ts
export class AdobePages {
  private env: 'dev' | 'stage' | 'prod';
  private baseURL: string;

  constructor(env: 'dev' | 'stage' | 'prod' = 'stage') {
    this.env = env;
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  brandConcierge(options?: PageOptions): string {
    return this.buildURL('/cc-shared/fragments/uar/brand-concierge/brand-concierge', options);
  }

  // ... more page methods
}
```

#### Usage in Page Objects

```typescript
import { AdobePages } from '../adobe-pages.config';

export class BrandConciergePage extends BasePage {
  private pages: AdobePages;

  constructor(page: Page, env: 'dev' | 'stage' | 'prod' = 'stage') {
    super(page);
    this.pages = new AdobePages(env);
  }

  async navigateToBrandConcierge(): Promise<void> {
    await this.navigate(this.pages.brandConcierge());
  }

  async navigateWithParams(): Promise<void> {
    await this.navigate(
      this.pages.brandConcierge({ 
        params: { locale: 'en_US', theme: 'dark' } 
      })
    );
  }
}
```

#### Usage in Tests

```typescript
import { test } from '@playwright/test';
import { AdobePages } from '../adobe-pages.config';

test('should load brand concierge page', async ({ page }) => {
  const env = process.env.TEST_ENV || 'stage';
  const pages = new AdobePages(env);
  
  await page.goto(pages.brandConcierge());
  // ... test assertions
});
```

#### Pros & Cons

✅ **Pros:**
- Type safety and IDE autocomplete
- Built-in query params and hash support
- Clean API: `pages.brandConcierge()`
- Easy to add environment-specific logic
- Centralized URL building logic

❌ **Cons:**
- More boilerplate code
- Slightly more complex setup
- Need to instantiate class

---

### **Option 3: Inline in Page Objects** (Not Recommended)

```typescript
// ❌ NOT RECOMMENDED - Hardcoded URLs
export class BrandConciergePage extends BasePage {
  async navigateToBrandConcierge(): Promise<void> {
    await this.navigate('https://www.stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge');
  }
}
```

**Why avoid this?**
- Not environment-aware
- Duplicated across multiple files
- Hard to maintain
- No centralized control

---

## Usage Examples

### Example 1: Basic Navigation

```typescript
// Using Option 1
const url = getPageURL(baseURL, ADOBE_PAGES.brandConcierge);
await page.goto(url);

// Using Option 2
const pages = new AdobePages('stage');
await page.goto(pages.brandConcierge());
```

### Example 2: URLs with Query Parameters

```typescript
// Using Option 1
const url = buildURL(baseURL, ADOBE_PAGES.brandConcierge, { 
  locale: 'en_US', 
  theme: 'dark' 
});
await page.goto(url);

// Using Option 2
const pages = new AdobePages('stage');
await page.goto(
  pages.brandConcierge({ 
    params: { locale: 'en_US', theme: 'dark' } 
  })
);
```

### Example 3: URLs with Hash

```typescript
// Using Option 2
const pages = new AdobePages('stage');
await page.goto(
  pages.brandConcierge({ 
    hash: 'getting-started' 
  })
);
// Result: https://stage.adobe.com/brand-concierge#getting-started
```

### Example 4: API Endpoints

```typescript
// Using Option 1
const apiURL = ADOBE_PAGES.api.brandConcierge;

// Using Option 2
const pages = new AdobePages('stage');
const apiURL = pages.apiBrandConcierge({ 
  params: { userId: '123' } 
});
```

### Example 5: Environment-Specific URLs

```typescript
// Using Option 2 with environment-specific logic
const pages = new AdobePages('dev');

// Dev environment uses different path
const url = pages.product('photoshop');
// Dev: https://dev.adobe.com/dev/products/photoshop
// Stage: https://stage.adobe.com/products/photoshop
```

---

## Best Practices

### 1. **Choose the Right Approach**

| Team Size | Complexity | Recommendation |
|-----------|-----------|----------------|
| Small (1-3 pages) | Simple | Option 1 |
| Medium (4-10 pages) | Moderate | Option 1 or 2 |
| Large (10+ pages) | Complex | Option 2 |

### 2. **File Organization**

```
config/
├── environments.ts              # Base URLs per environment
├── teams/
│   ├── adobe-urls.ts           # Option 1: Simple config
│   ├── search-urls.ts
│   └── auth-urls.ts

teams/
├── adobe-team/
│   ├── adobe-pages.config.ts   # Option 2: Pages class
│   ├── brand-concierge/
│   │   └── brand-concierge.page.ts
│   └── global/
│       └── adobe-global.page.ts
```

### 3. **Use Environment Variables**

```typescript
// Get environment from env var
const env = (process.env.TEST_ENV || 'stage') as 'dev' | 'stage' | 'prod';

// Or from Playwright config
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'stage';
```

### 4. **Consistent Naming**

```typescript
// ✅ Good: Camel case for page methods/properties
ADOBE_PAGES.brandConcierge
pages.brandConcierge()

// ❌ Bad: Inconsistent naming
ADOBE_PAGES.brand_concierge
ADOBE_PAGES['brand-concierge']
```

### 5. **Document Your URLs**

```typescript
export const ADOBE_PAGES = {
  /**
   * Brand Concierge - AI-powered brand assistance
   * @see https://wiki.adobe.com/brand-concierge
   */
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
};
```

### 6. **Validate URLs**

```typescript
// Add validation to catch invalid URLs early
export function getPageURL(baseURL: string, pagePath: string): string {
  try {
    const url = new URL(pagePath, baseURL);
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid URL: ${baseURL} + ${pagePath}`);
  }
}
```

---

## Environment-Specific Overrides

Sometimes different environments need different paths:

### Option 1: Using Override Object

```typescript
// config/teams/adobe-urls.ts
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    brandConcierge: '/dev/brand-concierge',  // Different path in dev
  },
  stage: {},  // Use default
  prod: {},   // Use default
};

export function getAdobePages(env: 'dev' | 'stage' | 'prod'): PageUrls {
  return {
    ...ADOBE_PAGES,
    ...ADOBE_PAGES_OVERRIDES[env],
  };
}
```

### Option 2: Using Class Methods

```typescript
// teams/adobe-team/adobe-pages.config.ts
export class AdobePages {
  brandConcierge(options?: PageOptions): string {
    // Dev uses different path
    const path = this.env === 'dev' 
      ? '/dev/brand-concierge'
      : '/cc-shared/fragments/uar/brand-concierge/brand-concierge';
    
    return this.buildURL(path, options);
  }
}
```

---

## Migration Guide

### Migrating from Hardcoded URLs to Option 1

**Before:**
```typescript
// brand-concierge.page.ts
async navigateToBrandConcierge(): Promise<void> {
  await this.navigate('https://www.stage.adobe.com/cc-shared/fragments/uar/brand-concierge/brand-concierge');
}
```

**After:**
```typescript
// 1. Create config/teams/adobe-urls.ts
export const ADOBE_PAGES = {
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
};

// 2. Update page object
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

constructor(page: Page, env = 'stage') {
  super(page);
  this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
}

async navigateToBrandConcierge(): Promise<void> {
  const url = getPageURL(this.baseURL, ADOBE_PAGES.brandConcierge);
  await this.navigate(url);
}
```

### Migrating from Option 1 to Option 2

```typescript
// 1. Create teams/adobe-team/adobe-pages.config.ts (see Option 2 above)

// 2. Update page object
import { AdobePages } from '../adobe-pages.config';

constructor(page: Page, env = 'stage') {
  super(page);
  this.pages = new AdobePages(env);
}

async navigateToBrandConcierge(): Promise<void> {
  await this.navigate(this.pages.brandConcierge());
}
```

---

## Testing Your URL Configuration

```typescript
// tests/config/url-config.spec.ts
import { test, expect } from '@playwright/test';
import { AdobePages } from '../../teams/adobe-team/adobe-pages.config';

test.describe('Adobe Pages Configuration', () => {
  test('should generate correct URLs for each environment', () => {
    const devPages = new AdobePages('dev');
    const stagePages = new AdobePages('stage');
    const prodPages = new AdobePages('prod');

    expect(devPages.brandConcierge()).toContain('dev.adobe.com');
    expect(stagePages.brandConcierge()).toContain('stage.adobe.com');
    expect(prodPages.brandConcierge()).toContain('www.adobe.com');
  });

  test('should handle query parameters correctly', () => {
    const pages = new AdobePages('stage');
    const url = pages.brandConcierge({ 
      params: { locale: 'en_US', theme: 'dark' } 
    });

    expect(url).toContain('?');
    expect(url).toContain('locale=en_US');
    expect(url).toContain('theme=dark');
  });

  test('should handle hash fragments correctly', () => {
    const pages = new AdobePages('stage');
    const url = pages.brandConcierge({ hash: 'getting-started' });

    expect(url).toContain('#getting-started');
  });
});
```

---

## Summary

### Quick Decision Matrix

**Choose Option 1 if:**
- You have < 10 pages
- Simple URL structure
- Team is small
- Quick setup needed

**Choose Option 2 if:**
- You have 10+ pages
- Complex URL patterns
- Need query params/hash support
- Want type safety
- Large team

### Example Setup for Adobe Team

```typescript
// 1. Environment config (already exists)
// config/environments.ts
export const ENVIRONMENTS = {
  adobe: {
    dev: { baseURL: 'https://dev.adobe.com' },
    stage: { baseURL: 'https://stage.adobe.com' },
    prod: { baseURL: 'https://www.adobe.com' },
  },
};

// 2. Pages config (NEW - Option 1)
// config/teams/adobe-urls.ts
export const ADOBE_PAGES = {
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  creativityDesign: '/products/creativity-design',
};

// 3. Page object (UPDATED)
// teams/adobe-team/brand-concierge/brand-concierge.page.ts
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';

export class BrandConciergePage extends BasePage {
  constructor(page: Page, env = 'stage') {
    super(page);
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  async navigateToBrandConcierge(): Promise<void> {
    const url = getPageURL(this.baseURL, ADOBE_PAGES.brandConcierge);
    await this.navigate(url);
  }
}
```

---

## Additional Resources

- [ENVIRONMENTS.md](./config/environments.ts) - Environment configuration
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration guide
- [10_TEAMS_ARCHITECTURE.md](./10_TEAMS_ARCHITECTURE.md) - Team architecture

---

## Questions?

If you need help deciding which approach to use, consider:
1. How many pages does your team manage?
2. Do you need complex URL building (query params, hashes)?
3. What's your team's TypeScript proficiency?
4. How often do URLs change?

**Still unsure?** Start with **Option 1** (Simple Config) and migrate to Option 2 if needed later.

