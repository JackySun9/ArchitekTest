# ⚡ Quick Fixes Checklist

**Priority**: Critical → High → Medium → Low  
**Time to complete**: 2-4 hours for critical, 1-2 days for high priority

---

## 🔴 Critical (Do Now - 2 hours)

### 1. Clean Git Repository

```bash
# Remove deleted test report files
git add -u config/teams/test-report/
git commit -m "chore: remove old test reports"

# Or delete the entire test-report directory if not needed
git rm -r config/teams/test-report/
git commit -m "chore: clean up test reports directory"
```

### 2. Fix Vector Store Tracking

```bash
# Remove from git but keep file locally
git rm --cached enhanced_vector_store.json
git commit -m "chore: untrack vector store file"

# Verify it's in .gitignore (already there at line 75)
grep "enhanced_vector_store.json" .gitignore
```

### 3. Track Package Lock

```bash
# Remove package-lock.json from .gitignore
sed -i.bak '/^package-lock.json$/d' .gitignore

# Add it to git
git add package-lock.json .gitignore
git commit -m "chore: track package-lock.json for dependency consistency"
```

---

## 🟡 High Priority (This Week - 1-2 days)

### 4. Setup ESLint & Prettier

```bash
# Install dependencies
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  prettier eslint-config-prettier eslint-plugin-prettier

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["error", "warn", "info"] }]
  }
}
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
EOF

# Create .prettierignore
cat > .prettierignore << 'EOF'
node_modules/
dist/
test-results/
test-report/
playwright-report/
*.json
EOF

# Add npm scripts
npm pkg set scripts.lint="eslint . --ext .ts --max-warnings 0"
npm pkg set scripts.lint:fix="eslint . --ext .ts --fix"
npm pkg set scripts.format="prettier --write \"**/*.{ts,js,json,md}\""
npm pkg set scripts.format:check="prettier --check \"**/*.{ts,js,json,md}\""

# Run formatting
npm run format
npm run lint:fix
```

### 5. Setup GitHub Actions CI

```bash
# Create directory
mkdir -p .github/workflows

# Create workflow file
cat > .github/workflows/test.yml << 'EOF'
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm test -- --project=adobe-chromium --reporter=html,json
        env:
          TEST_ENV: stage

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: test-report/
          retention-days: 30

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
          retention-days: 7

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
EOF

# Commit
git add .github/workflows/test.yml
git commit -m "ci: add GitHub Actions workflow"
```

### 6. Setup Pre-commit Hooks

```bash
# Install husky and lint-staged
npm install -D husky lint-staged

# Initialize husky
npx husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
EOF

chmod +x .husky/pre-commit

# Configure lint-staged in package.json
npm pkg set lint-staged='{"*.ts": ["eslint --fix", "prettier --write"], "*.{json,md}": ["prettier --write"]}'

# Test it
git add .
git commit -m "test: verify pre-commit hook"
```

### 7. Improve Logging

```bash
# Create logger utility
cat > shared/logger.ts << 'EOF'
/**
 * Centralized logging utility
 * Provides structured logging with levels and timestamps
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(this.format('DEBUG', message, data));
    }
  }

  static info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.format('INFO', message, data));
    }
  }

  static warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.format('WARN', message, data));
    }
  }

  static error(message: string, error?: Error | any): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.format('ERROR', message, error));
    }
  }

  private static format(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${level}] ${timestamp} - ${message}${dataStr}`;
  }
}

// Set level from environment
const envLevel = process.env.LOG_LEVEL?.toUpperCase();
if (envLevel && LogLevel[envLevel as keyof typeof LogLevel] !== undefined) {
  Logger.setLevel(LogLevel[envLevel as keyof typeof LogLevel]);
}
EOF

# Now replace console.log with Logger.info throughout your codebase
# Example for one file:
sed -i.bak "s/console.log(/Logger.info(/g" teams/adobe-team/brand-concierge/brand-concierge.page.ts
```

---

## 🟢 Medium Priority (Next 2 Weeks)

### 8. Environment Validation

```bash
cat > config/env-validator.ts << 'EOF'
/**
 * Environment variable validation
 * Ensures all required environment variables are set before running
 */

export interface EnvConfig {
  required: string[];
  optional: string[];
}

const ENV_CONFIG: EnvConfig = {
  required: [
    'TEST_ENV', // dev, stage, prod
  ],
  optional: [
    'OLLAMA_MODEL',
    'LOG_LEVEL',
    'TEST_TEAM',
  ],
};

export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of ENV_CONFIG.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables
  for (const key of ENV_CONFIG.optional) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  // Report missing required variables
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Create a .env file with these variables');
    process.exit(1);
  }

  // Report missing optional variables
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  Optional environment variables not set:');
    warnings.forEach(key => console.warn(`   - ${key}`));
  }

  console.log('✅ Environment validation passed');
}
EOF

# Add to src/index.ts at the top
# import { validateEnvironment } from '../config/env-validator';
# validateEnvironment();
```

### 9. Enhanced BasePage

```bash
# Add to shared/base-page.ts
cat >> shared/base-page.ts << 'EOF'

  // Enhanced waiting strategies
  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForAllImagesLoaded(): Promise<void> {
    await this.page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every(img => img.complete);
    });
  }

  // Common interactions
  async selectDropdown(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.locator(selector).setInputFiles(filePath);
  }

  // Screenshot helpers
  async takeScreenshot(name: string, fullPage = true): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage
    });
  }

  // Local storage helpers
  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(
      ([k, v]) => localStorage.setItem(k, v),
      [key, value]
    );
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return this.page.evaluate(k => localStorage.getItem(k), key);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  // Cookie helpers
  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([{ name, value, url: this.page.url() }]);
  }

  // Viewport helpers
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
}
EOF
```

### 10. Add Security Scanning

```bash
# Add npm audit to CI
cat > .github/workflows/security.yml << 'EOF'
name: Security Scan

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm audit --audit-level=moderate

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
EOF

git add .github/workflows/security.yml
git commit -m "ci: add security scanning"
```

---

## 🔵 Low Priority (When You Have Time)

### 11. Add CONTRIBUTING.md

```bash
cat > CONTRIBUTING.md << 'EOF'
# Contributing to ArchitekTest

Thank you for your interest in contributing!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Install Playwright browsers: `npx playwright install`
4. Copy `.env.example` to `.env` and configure
5. Run tests: `npm test`

## Code Standards

- Follow TypeScript best practices
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Write tests for new features
- Update documentation

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "feat: add new feature"`
3. Push to your fork: `git push origin feature/your-feature`
4. Open a Pull Request

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Questions?

Open an issue or reach out to the maintainers.
EOF

git add CONTRIBUTING.md
git commit -m "docs: add contributing guidelines"
```

---

## ✅ Verification Checklist

After completing all tasks, verify:

- [ ] Git status is clean (no untracked deleted files)
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm test` runs successfully
- [ ] CI pipeline passes (if using GitHub Actions)
- [ ] Pre-commit hooks are working
- [ ] Documentation is updated
- [ ] No sensitive data in git

---

## 📊 Expected Outcomes

After completing these fixes:

- ✅ **Clean repository** - No merge conflicts, no large files
- ✅ **Consistent code style** - ESLint + Prettier enforced
- ✅ **Automated testing** - CI/CD pipeline running
- ✅ **Better logging** - Structured, searchable logs
- ✅ **Quality gates** - Pre-commit hooks prevent bad code
- ✅ **Security** - Dependency scanning in place
- ✅ **Professional** - Contributing guidelines clear

### Time Investment vs. Benefit

| Priority | Time     | Benefit                       |
| -------- | -------- | ----------------------------- |
| Critical | 2 hours  | 🔥 Prevents serious issues    |
| High     | 1-2 days | ⚡ Massive productivity boost |
| Medium   | 2-4 days | 📈 Significant improvement    |
| Low      | Ongoing  | 🎯 Professional polish        |

**Total time to "production-ready"**: ~3-4 days of focused work

---

## 🎯 Quick Start

```bash
# Run this to do all critical fixes in one go
git add -u config/teams/test-report/
git rm --cached enhanced_vector_store.json
sed -i.bak '/^package-lock.json$/d' .gitignore
git add package-lock.json .gitignore
git commit -m "chore: fix git hygiene issues"

# Then setup linting
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
# (follow step 4 above for config files)

# Then CI/CD
mkdir -p .github/workflows
# (follow step 5 above for workflow file)

echo "✅ Critical fixes completed!"
```

---

**Good luck with the improvements! Your framework is already excellent and these changes will make it even better.** 🚀
