# 🚀 Quick Reference

**ArchitekTest Framework - Essential Commands and Patterns**

---

## ⚡ Quick Commands

### AI-Powered Test Generation (Conversational)

```bash
npm run chat                # Start conversational test generator
npm run ai-generate         # CLI test generator
```

### Traditional AI Test Generation

```bash
# Embed codebase for intelligent pattern reuse
npm run start embed

# Generate comprehensive test suites
npm run start -- generate \
  --feature "feature-name" \
  --requirements "Your requirements" \
  --team "team-name" \
  --url "https://your-app.com"
```

### Run Tests by Tag

```bash
npm run test:smoke           # Quick smoke tests
npm run test:regression      # Full regression suite
npm run test:critical        # Critical tests only
npm run test:ai              # AI/Chat tests
npm run test:a11y            # Accessibility tests
npm run test:performance     # Performance tests
npm run test:security        # Security tests
npm run test:responsive      # Responsive design tests
```

### Run Tests by Environment

```bash
npm run test:smoke:dev       # Smoke on dev
npm run test:smoke:stage     # Smoke on stage
npm run test:smoke:prod      # Smoke on prod
npm run test:critical:prod   # Critical tests on production
```

### Adobe Team Tests

```bash
npm run test:adobe           # All Adobe tests
npm run test:adobe:smoke     # Adobe smoke tests
npm run test:adobe:brand     # Brand Concierge tests
npm run test:adobe:stage     # Adobe tests on stage
```

### Advanced Tag Combinations

```bash
# Multiple tags (OR)
npx playwright test -g "@smoke|@critical"

# Multiple tags (AND)
npx playwright test -g "@adobe.*@chat"

# Exclude tags
npx playwright test -g "@regression" --grep-invert="@mobile"

# Specific test by ID
npx playwright test -g "BC001"
```

---

## 📁 Project Structure

```
ArchitekTest/
├── docs/                    # 📚 All documentation
│   ├── getting-started/     # Quick start guides
│   ├── architecture/        # Framework architecture
│   ├── configuration/       # Config guides
│   ├── ai-features/         # AI test generation
│   ├── guides/              # Best practices
│   └── archive/             # Historical docs
│
├── teams/                   # Team-specific tests
│   └── adobe-team/
│       ├── test-data/       # Centralized test data
│       │   ├── brand-concierge.data.ts
│       │   ├── configurations.ts
│       │   ├── global.data.ts
│       │   └── index.ts
│       └── brand-concierge/
│           ├── *.feature.ts # Test scenarios
│           ├── *.page.ts    # Page objects
│           └── *.spec.ts    # Test specs
│
├── config/                  # Configuration
│   ├── environments.ts      # Multi-environment URLs
│   └── teams/               # Team-specific configs
│
└── src/                     # AI tools
    ├── conversational-test-generator.ts  # Chat interface
    ├── cli-test-generator.ts             # CLI generator
    └── test-generation-agent.ts          # AI agent
```

---

## 🎯 Test Scenario Pattern

```typescript
// feature.ts - Test scenarios
export const SCENARIOS = [
  {
    id: 'BC001',
    description: 'Test description',
    priority: 'critical',
    category: 'functional',
    tags: ['@smoke', '@regression', '@critical'],
    steps: ['Step 1', 'Step 2'],
    expectedResults: ['Result 1', 'Result 2'],
    requirements: ['REQ-001'],
    jiraTickets: ['ADOBE-1234'],
    estimatedTime: 60,
    environments: ['dev', 'stage', 'prod'],
    browsers: ['chrome', 'firefox'],
  },
];
```

---

## 🏷️ Available Tags

```
@smoke              - Quick smoke tests
@regression         - Full regression suite
@critical           - Critical priority
@adobe              - Adobe team
@brand-concierge    - Brand Concierge feature
@ai                 - AI functionality
@chat               - Chat features
@a11y               - Accessibility
@wcag               - WCAG compliance
@performance        - Performance tests
@security           - Security tests
@responsive         - Responsive design
@mobile / @tablet   - Device-specific
@edge-cases         - Edge case testing
@error-handling     - Error handling
```

---

## 📊 Helper Functions

```typescript
import {
  getScenariosByTag,
  getScenarioById,
  getScenariosByPriority,
  getTestSummary,
  printTestSummary,
} from './feature';

// Get tests by tag
const smokeTests = getScenariosByTag('@smoke');

// Get critical tests
const criticalTests = getScenariosByPriority('critical');

// Get specific test
const test = getScenarioById('BC001');

// Print summary
printTestSummary();
```

---

## 🔗 Documentation Links

### Getting Started

- [Quick Start](docs/getting-started/QUICK_START.md) - Get up and running
- [AI Features Guide](docs/ai-features/AI_TEST_GENERATION_GUIDE.md) - AI-powered test generation

### Architecture

- [Blueprint](docs/architecture/BLUEPRINT.md) - Framework architecture
- [Your Enhanced Architecture](docs/architecture/YOUR_ENHANCED_ARCHITECTURE.md) - Architecture details
- [Framework Comparison](docs/architecture/FRAMEWORK_COMPARISON.md) - vs Nala comparison

### Configuration

- [Playwright Config](docs/configuration/PLAYWRIGHT_CONFIG_GUIDE.md) - Playwright setup
- [URL Management](docs/configuration/PAGE_URLS_GUIDE.md) - URL configuration

### Guides

- [Test Design Best Practices](docs/guides/TEST_DESIGN_BEST_PRACTICES.md) - Professional test design
- [Scaling Guide](docs/guides/SCALING_GUIDE.md) - Scale to 10+ teams
- [Migration Guide](docs/guides/MIGRATION_GUIDE.md) - Migration tips

---

## 💡 Common Patterns

### Pre-Deployment Checks

```bash
npm run test:smoke:stage     # Before stage deployment
npm run test:critical:prod   # Before prod deployment
```

### Feature Testing

```bash
npm run test:ai              # Test AI features
npm run test:a11y            # Test accessibility
npm run test:adobe:brand     # Test specific feature
```

### Priority-Based Testing

```bash
npm run test:critical        # Critical tests first
npm run test:smoke           # Then smoke tests
npm run test:regression      # Full regression last
```

### CI/CD Integration

```bash
# In GitHub Actions
npm run test:smoke           # On every push
npm run test:critical        # On pull requests
npm run test:regression      # Nightly builds
```

---

## 🚀 Quick Wins

```bash
# Before every PR
npm run test:smoke

# Before deployment
npm run test:critical:prod

# Full regression (nightly)
npm run test:regression

# Accessibility audit
npm run test:a11y

# Performance check
npm run test:performance
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Set test environment
export TEST_ENV=stage

# Run with specific environment
TEST_ENV=prod npm run test:critical
```

### Model Setup (for AI features)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull recommended model
ollama pull deepseek-r1:14b

# Pull embedding model
ollama pull nomic-embed-text:latest
```

---

## 📈 Test Suite Stats

Run this to see your test suite summary:

```typescript
import { printTestSummary } from './feature';
printTestSummary();
```

---

## 🆘 Need Help?

- **📚 Full Documentation**: See `docs/` directory
- **🏗️ Architecture**: See `docs/architecture/BLUEPRINT.md`
- **🚀 Getting Started**: See `docs/getting-started/QUICK_START.md`
- **🤖 AI Features**: See `docs/ai-features/AI_TEST_GENERATION_GUIDE.md`

---

**Built with ❤️ for efficient test automation** 🚀
