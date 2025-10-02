# Quick Start: Multi-Team Playwright Testing

## 🚀 Run Tests

### By Team
```bash
npm run test:adobe           # All Adobe tests, all browsers
npm run test:search          # All Search tests
npm run test:global          # Adobe global components only
```

### By Environment
```bash
npm run test:adobe:dev       # Adobe team, dev environment
npm run test:adobe:stage     # Adobe team, stage environment (default)
npm run test:adobe:prod      # Adobe team, production environment
```

### By Browser
```bash
npm run test:chromium        # Adobe team, Chromium only
npm run test:firefox         # Adobe team, Firefox only
npm run test:webkit          # Adobe team, WebKit only
npm run test:mobile          # All teams, mobile Chrome
```

### By Project (Team + Browser)
```bash
npx playwright test --project=adobe-chromium
npx playwright test --project=adobe-firefox
npx playwright test --project=search-chromium
npx playwright test --project=auth-chromium
```

### Advanced
```bash
# Specific test file
npx playwright test teams/adobe-team/brand-concierge/brand-concierge.spec.ts

# Debug mode
npx playwright test --debug

# Headed mode (see browser)
npm run test:headed

# UI mode (interactive)
npm run test:ui

# View report
npm run report
```

## 🌍 Environment Setup

```bash
# 1. Copy env template
cp .env.example .env

# 2. Edit .env
TEST_ENV=stage          # dev, stage, or prod
TEST_TEAM=adobe         # adobe, search, auth, ai, test
```

## 📁 Team Structure

```
teams/
├── adobe-team/
│   ├── global/                    # Global header/footer tests
│   └── brand-concierge/          # Brand concierge page tests
├── search-team/
│   └── search-functionality/     # Search feature tests
├── auth-team/
│   └── user-login/               # Login tests
├── ai-team/
│   └── react-test/               # AI feature tests
└── test-team/
    └── test-model-check/         # Model tests
```

## ⚙️ Team URLs

| Team | Dev | Stage | Prod |
|------|-----|-------|------|
| **Adobe** | dev.adobe.com | **stage.adobe.com** ✓ | adobe.com |
| **Search** | dev-search.example.com | stage-search.example.com | search.example.com |
| **Auth** | dev-auth.example.com | stage-auth.example.com | auth.example.com |
| **AI** | dev-ai.example.com | stage-ai.example.com | ai.example.com |
| **Test** | dev.example.com | stage.example.com | example.com |

## 📊 Current Test Status

```
✅ Adobe Team: 21 tests (12 brand-concierge + 9 global)
   - brand-concierge.spec.ts: 12 tests
   - adobe-global.spec.ts: 9 tests

✅ Search Team: Tests available
✅ Auth Team: Tests available
✅ AI Team: Tests available
✅ Test Team: Tests available
```

## 💡 Quick Tips

1. **Start with one team**: `npm run test:adobe`
2. **Debug failing tests**: `npx playwright test --debug`
3. **See live browser**: `npm run test:headed`
4. **Interactive testing**: `npm run test:ui`
5. **View reports**: `npm run report`

## 📚 Full Documentation

- **[PLAYWRIGHT_CONFIG_GUIDE.md](./PLAYWRIGHT_CONFIG_GUIDE.md)** - Complete configuration guide
- **[TEST_ORGANIZATION_GUIDE.md](./TEST_ORGANIZATION_GUIDE.md)** - Test organization patterns
- **[README.md](./README.md)** - Project overview

## 🎯 Examples

### Test Adobe Brand Concierge on Stage
```bash
npm run test:adobe:stage
# or
TEST_ENV=stage npx playwright test teams/adobe-team/brand-concierge/
```

### Test All Teams on Dev
```bash
TEST_ENV=dev npx playwright test
```

### Test Adobe Global Components Only
```bash
npm run test:global
```

### Test on Multiple Browsers
```bash
npx playwright test teams/adobe-team/ --project=adobe-chromium --project=adobe-firefox
```

## 🐛 Troubleshooting

**Tests not running?**
```bash
# Check configuration
npx playwright test --list

# Verify environment
echo $TEST_ENV
```

**Wrong URL?**
```bash
# Check .env file
cat .env

# Override for single run
TEST_ENV=dev npm run test:adobe
```

**Need help?**
- Check `PLAYWRIGHT_CONFIG_GUIDE.md` for detailed docs
- Run `npx playwright test --help` for all options

