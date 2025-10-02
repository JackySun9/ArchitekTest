# Playwright Multi-Team Configuration Guide

This guide explains how to use the multi-team, multi-environment Playwright configuration.

## 📁 Configuration Files

```
ArchitekTest/
├── playwright.config.ts          # Main Playwright configuration
├── config/
│   └── team-environments.ts      # Team-specific environment configs
├── .env                           # Your local environment variables
├── .env.example                   # Environment variable template
└── teams/
    ├── adobe-team/               # Adobe team tests
    ├── search-team/              # Search team tests
    ├── auth-team/                # Auth team tests
    ├── ai-team/                  # AI team tests
    └── test-team/                # Test team tests
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
TEST_ENV=stage
TEST_TEAM=adobe
```

### 2. Run Tests

```bash
# Run all tests (all teams, all browsers)
npx playwright test

# Run specific team tests
TEST_TEAM=adobe npx playwright test teams/adobe-team/

# Run specific environment
TEST_ENV=dev npx playwright test

# Run specific project
npx playwright test --project=adobe-chromium
```

## 🎯 Team-Specific Testing

### Adobe Team
```bash
# Stage environment (default)
npx playwright test teams/adobe-team/

# Dev environment
TEST_ENV=dev npx playwright test teams/adobe-team/

# Production environment
TEST_ENV=prod npx playwright test teams/adobe-team/

# Specific browser
npx playwright test --project=adobe-firefox

# Specific test file
npx playwright test teams/adobe-team/brand-concierge/brand-concierge.spec.ts
```

### Search Team
```bash
npx playwright test teams/search-team/
TEST_ENV=dev npx playwright test --project=search-chromium
```

### Auth Team
```bash
npx playwright test teams/auth-team/
TEST_ENV=stage npx playwright test --project=auth-chromium
```

### AI Team
```bash
npx playwright test teams/ai-team/
TEST_ENV=prod npx playwright test --project=ai-chromium
```

## 🌍 Environment Configuration

### Available Environments

| Environment | Description | Use Case |
|------------|-------------|----------|
| `dev` | Development | Active development, frequent changes |
| `stage` | Staging | Pre-production testing, stable builds |
| `prod` | Production | Final validation, smoke tests |

### Set Environment

```bash
# Using environment variable
TEST_ENV=stage npx playwright test

# In .env file
TEST_ENV=stage

# In package.json scripts
"test:stage": "TEST_ENV=stage playwright test"
```

## 🎨 Team URLs

Each team has its own URLs per environment:

```typescript
// Adobe Team
dev:   https://dev.adobe.com
stage: https://www.stage.adobe.com
prod:  https://www.adobe.com

// Search Team  
dev:   https://dev-search.example.com
stage: https://stage-search.example.com
prod:  https://search.example.com

// And so on for auth, ai, test teams...
```

## 📝 Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    
    "test:adobe": "playwright test teams/adobe-team/",
    "test:adobe:dev": "TEST_ENV=dev playwright test teams/adobe-team/",
    "test:adobe:stage": "TEST_ENV=stage playwright test teams/adobe-team/",
    "test:adobe:prod": "TEST_ENV=prod playwright test teams/adobe-team/",
    
    "test:search": "playwright test teams/search-team/",
    "test:auth": "playwright test teams/auth-team/",
    "test:ai": "playwright test teams/ai-team/",
    
    "test:global": "playwright test teams/adobe-team/global/",
    
    "test:chromium": "playwright test --project=adobe-chromium",
    "test:firefox": "playwright test --project=adobe-firefox",
    "test:webkit": "playwright test --project=adobe-webkit",
    "test:mobile": "playwright test --project=mobile-chrome",
    
    "report": "playwright show-report",
    "codegen": "playwright codegen"
  }
}
```

## 🔧 Advanced Usage

### Custom Team Configuration

In your test file, use the team environment config:

```typescript
import { test, expect } from '@playwright/test';
import { getTeamEnvironment, getBaseURL } from '../../../config/team-environments';

test.describe('Adobe Team Tests', () => {
  test.beforeEach(async ({ page }) => {
    const env = process.env.TEST_ENV || 'stage';
    const adobeEnv = getTeamEnvironment('adobe', env);
    
    console.log(`Testing on: ${adobeEnv.name}`);
    console.log(`Base URL: ${adobeEnv.baseURL}`);
    
    await page.goto(adobeEnv.baseURL);
  });

  test('example test', async ({ page }) => {
    // Your test code
  });
});
```

### Dynamic URL Construction

```typescript
import { getBaseURL, getAPIURL } from '../../../config/team-environments';

const env = process.env.TEST_ENV || 'stage';
const baseURL = getBaseURL('adobe', env);
const apiURL = getAPIURL('adobe', env);

await page.goto(`${baseURL}/specific/path`);
await page.request.get(`${apiURL}/endpoint`);
```

### Per-Team Custom Settings

```typescript
import { getTeamEnvironment } from '../../../config/team-environments';

const adobeEnv = getTeamEnvironment('adobe', 'stage');

if (adobeEnv.customSettings?.skipOnboarding) {
  // Skip onboarding flow
}

if (adobeEnv.customSettings?.enableBetaFeatures) {
  // Test beta features
}
```

## 🎭 Projects Explained

Each project in `playwright.config.ts` combines:
- **Team**: Which team's tests to run
- **Browser**: Which browser to use
- **Base URL**: Team-specific environment URL

```typescript
{
  name: 'adobe-chromium',
  testMatch: /teams\/adobe-team\/.*\.spec\.ts/,  // Only adobe tests
  use: { 
    ...devices['Desktop Chrome'],
    baseURL: getBaseURL('adobe'),              // Adobe-specific URL
  },
}
```

## 🏃 Running Tests

### Run Everything
```bash
npx playwright test
```

### Run by Team
```bash
npx playwright test teams/adobe-team/
npx playwright test teams/search-team/
```

### Run by Project (Team + Browser)
```bash
npx playwright test --project=adobe-chromium
npx playwright test --project=search-chromium
npx playwright test --project=auth-chromium
```

### Run by Environment
```bash
TEST_ENV=dev npx playwright test
TEST_ENV=stage npx playwright test
TEST_ENV=prod npx playwright test
```

### Combine Filters
```bash
# Adobe team, stage environment, chromium only
TEST_ENV=stage npx playwright test --project=adobe-chromium

# Search team, dev environment
TEST_ENV=dev npx playwright test teams/search-team/
```

## 📊 Reporting

Reports are generated per team:

```bash
# Generate report
npx playwright test

# View report
npx playwright show-report

# Reports location
test-report/          # HTML report
test-results/         # JSON results
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test-adobe:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        env: [dev, stage, prod]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: TEST_ENV=${{ matrix.env }} npx playwright test teams/adobe-team/
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-adobe-${{ matrix.env }}
          path: test-report/

  test-search:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test teams/search-team/
```

## 🎯 Best Practices

1. **Environment Variables**: Always use `.env` for local, CI env vars for pipelines
2. **Base URLs**: Define all team URLs in `team-environments.ts`
3. **Test Organization**: Keep team tests in separate directories
4. **Shared Code**: Put global components in `teams/[team]/global/`
5. **Naming Convention**: Use team prefix in project names (`adobe-chromium`)

## 🐛 Debugging

```bash
# Debug mode
npx playwright test --debug

# Headed mode
npx playwright test --headed

# UI mode
npx playwright test --ui

# Specific test with debug
npx playwright test teams/adobe-team/brand-concierge/brand-concierge.spec.ts --debug

# Trace viewer
npx playwright show-trace test-results/[trace-file].zip
```

## ❓ Troubleshooting

### Issue: Wrong URL being used
**Solution**: Check `TEST_ENV` variable and `team-environments.ts` configuration

### Issue: Tests not found
**Solution**: Verify `testMatch` pattern in project configuration

### Issue: Authentication fails
**Solution**: Update credentials in `.env` file

### Issue: Timeout errors
**Solution**: Adjust timeouts in team environment config

## 📚 Resources

- [Playwright Configuration Docs](https://playwright.dev/docs/test-configuration)
- [Playwright Projects](https://playwright.dev/docs/test-projects)
- [Environment Variables](https://playwright.dev/docs/test-parameterize)

