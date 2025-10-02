# URL Configuration - Quick Reference

Quick comparison of the three approaches for managing page URLs.

## 🎯 Which One Should I Use?

| Scenario | Recommendation | File Location |
|----------|---------------|---------------|
| **Small team, few pages (< 10)** | ✅ **Option 1** | `config/teams/[team]-urls.ts` |
| **Large team, many pages (10+)** | ✅ **Option 2** | `teams/[team]/pages.config.ts` |
| **Quick prototype/spike** | ⚠️ Option 3 | Inline (not recommended) |

---

## Option 1: Simple Configuration Object ⭐ Recommended

### Setup (5 minutes)

```typescript
// config/teams/adobe-urls.ts
export const ADOBE_PAGES = {
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  login: '/auth/login',
};

export function getPageURL(baseURL: string, pagePath: string): string {
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const cleanPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  return `${cleanBaseURL}${cleanPath}`;
}
```

### Usage

```typescript
// In Page Object
import { ADOBE_PAGES, getPageURL } from '../../../config/teams/adobe-urls';
import { ENVIRONMENTS } from '../../../config/environments';

constructor(page: Page, env = 'stage') {
  super(page);
  this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
}

async navigate(): Promise<void> {
  const url = getPageURL(this.baseURL, ADOBE_PAGES.brandConcierge);
  await this.page.goto(url);
}
```

```typescript
// In Tests
import { test } from '@playwright/test';
import { ADOBE_PAGES, getPageURL } from '../config/teams/adobe-urls';

test('my test', async ({ page, baseURL }) => {
  const url = getPageURL(baseURL, ADOBE_PAGES.brandConcierge);
  await page.goto(url);
});
```

✅ **Pros:** Simple, easy to maintain, clear  
❌ **Cons:** Manual URL building, no type safety for params

---

## Option 2: Pages Configuration Class

### Setup (10 minutes)

```typescript
// teams/adobe-team/adobe-pages.config.ts
import { ENVIRONMENTS } from '../../config/environments';

export interface PageOptions {
  params?: Record<string, string>;
  hash?: string;
}

export class AdobePages {
  private env: 'dev' | 'stage' | 'prod';
  private baseURL: string;

  constructor(env: 'dev' | 'stage' | 'prod' = 'stage') {
    this.env = env;
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  private buildURL(path: string, options?: PageOptions): string {
    // ... URL building logic
  }

  brandConcierge(options?: PageOptions): string {
    return this.buildURL('/cc-shared/fragments/uar/brand-concierge/brand-concierge', options);
  }

  login(options?: PageOptions): string {
    return this.buildURL('/auth/login', options);
  }
}
```

### Usage

```typescript
// In Page Object
import { AdobePages } from '../adobe-pages.config';

constructor(page: Page, env = 'stage') {
  super(page);
  this.pages = new AdobePages(env);
}

async navigate(): Promise<void> {
  await this.page.goto(this.pages.brandConcierge());
}

async navigateWithParams(): Promise<void> {
  await this.page.goto(
    this.pages.brandConcierge({ 
      params: { locale: 'en_US' } 
    })
  );
}
```

```typescript
// In Tests
import { test } from '@playwright/test';
import { AdobePages } from '../teams/adobe-team/adobe-pages.config';

test('my test', async ({ page }) => {
  const pages = new AdobePages('stage');
  await page.goto(pages.brandConcierge());
});
```

✅ **Pros:** Type safety, query params, IDE autocomplete  
❌ **Cons:** More code, need to instantiate class

---

## Option 3: Inline URLs (Not Recommended)

```typescript
// ❌ DON'T DO THIS
async navigate(): Promise<void> {
  await this.page.goto('https://www.stage.adobe.com/brand-concierge');
}
```

❌ **Cons:** Not environment-aware, duplicated code, hard to maintain

---

## Side-by-Side Comparison

### Basic Navigation

```typescript
// Option 1: Simple Config
const url = getPageURL(baseURL, ADOBE_PAGES.brandConcierge);
await page.goto(url);

// Option 2: Pages Class
const pages = new AdobePages('stage');
await page.goto(pages.brandConcierge());

// Option 3: Inline (DON'T USE)
await page.goto('https://stage.adobe.com/brand-concierge');
```

### With Query Parameters

```typescript
// Option 1: Simple Config
const url = buildURL(baseURL, ADOBE_PAGES.brandConcierge, { 
  locale: 'en_US' 
});
await page.goto(url);

// Option 2: Pages Class
const pages = new AdobePages('stage');
await page.goto(
  pages.brandConcierge({ params: { locale: 'en_US' } })
);

// Option 3: Inline (DON'T USE)
await page.goto('https://stage.adobe.com/brand-concierge?locale=en_US');
```

### Environment Switching

```typescript
// Option 1: Simple Config
const devURL = ENVIRONMENTS.adobe.dev.baseURL;
const stageURL = ENVIRONMENTS.adobe.stage.baseURL;
const prodURL = ENVIRONMENTS.adobe.prod.baseURL;
const url = getPageURL(stageURL, ADOBE_PAGES.brandConcierge);

// Option 2: Pages Class
const devPages = new AdobePages('dev');
const stagePages = new AdobePages('stage');
const prodPages = new AdobePages('prod');
await page.goto(stagePages.brandConcierge());

// Option 3: Inline (DON'T USE)
// Need to manually change hardcoded URL everywhere 😱
```

---

## Real-World Example: Adobe Team

### File Structure

```
config/
├── environments.ts              # Base URLs (already exists)
└── teams/
    └── adobe-urls.ts           # Option 1: Page paths

teams/
└── adobe-team/
    ├── adobe-pages.config.ts   # Option 2: Pages class (optional)
    └── brand-concierge/
        └── brand-concierge.page.ts  # Uses Option 1 or 2
```

### Implementation

```typescript
// 1️⃣ Environment Config (already exists)
// config/environments.ts
export const ENVIRONMENTS = {
  adobe: {
    dev: { baseURL: 'https://dev.adobe.com' },
    stage: { baseURL: 'https://stage.adobe.com' },
    prod: { baseURL: 'https://www.adobe.com' },
  },
};

// 2️⃣ Page URLs Config (NEW - Option 1)
// config/teams/adobe-urls.ts
export const ADOBE_PAGES = {
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  creativityDesign: '/products/creativity-design',
  pdfSignatures: '/products/pdf-signatures',
  login: '/auth/login',
  profile: '/profile',
};

export function getPageURL(baseURL: string, pagePath: string): string {
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const cleanPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  return `${cleanBaseURL}${cleanPath}`;
}

// 3️⃣ Page Object (UPDATED)
// teams/adobe-team/brand-concierge/brand-concierge.page.ts
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

  async navigateToLogin(): Promise<void> {
    const url = getPageURL(this.baseURL, ADOBE_PAGES.login);
    await this.navigate(url);
  }
}

// 4️⃣ Tests
// tests/brand-concierge.spec.ts
test('should load brand concierge', async ({ page }) => {
  const env = process.env.TEST_ENV || 'stage';
  const brandConcierge = new BrandConciergePage(page, env);
  
  await brandConcierge.navigateToBrandConcierge();
  await expect(page).toHaveTitle(/Brand Concierge/);
});
```

---

## Common Patterns

### Pattern 1: Get Current Environment from ENV

```typescript
function getEnv(): 'dev' | 'stage' | 'prod' {
  const env = process.env.TEST_ENV || process.env.NODE_ENV || 'stage';
  if (env === 'development') return 'dev';
  if (env === 'production') return 'prod';
  return 'stage';
}

// Usage
const currentEnv = getEnv();
const pages = new AdobePages(currentEnv);
```

### Pattern 2: Environment-Specific Paths

```typescript
// Some pages have different paths per environment
export class AdobePages {
  brandConcierge(): string {
    const path = this.env === 'dev' 
      ? '/dev/brand-concierge'      // Dev uses different path
      : '/brand-concierge';          // Stage/Prod use this
    
    return this.buildURL(path);
  }
}
```

### Pattern 3: Shared URLs Across Teams

```typescript
// config/shared-urls.ts
export const SHARED_PAGES = {
  login: '/auth/login',
  logout: '/auth/logout',
  terms: '/legal/terms',
  privacy: '/legal/privacy',
};

// Use in any team
import { SHARED_PAGES } from '../../config/shared-urls';
```

---

## Quick Tips

1. **Start Simple**: Begin with Option 1, migrate to Option 2 if needed
2. **Use Environment Variables**: `TEST_ENV=stage npm test`
3. **Centralize URLs**: Never hardcode full URLs in page objects
4. **Document Paths**: Add comments explaining what each page does
5. **Validate URLs**: Use `new URL()` to catch invalid URLs early

---

## Migration Checklist

Converting from hardcoded URLs to Option 1:

- [ ] Create `config/teams/[team]-urls.ts` file
- [ ] Export page paths as constants
- [ ] Add helper function `getPageURL()`
- [ ] Update page objects to import and use the constants
- [ ] Update constructor to accept `env` parameter
- [ ] Replace hardcoded URLs with `getPageURL()` calls
- [ ] Update tests to use environment-aware URLs
- [ ] Test in all environments (dev, stage, prod)
- [ ] Remove old hardcoded URLs

---

## Need Help?

**See full documentation:** [PAGE_URLS_GUIDE.md](./PAGE_URLS_GUIDE.md)

**Quick questions:**
- How many pages? → If < 10, use **Option 1**
- Need query params? → If yes often, consider **Option 2**
- Just prototyping? → Use **Option 1**, easiest to set up
- Large team? → Use **Option 2** for better structure

**Files to reference:**
- Environment config: `config/environments.ts`
- Team config: `config/teams/adobe.config.ts`
- Current implementation: `teams/adobe-team/brand-concierge/brand-concierge.page.ts`

