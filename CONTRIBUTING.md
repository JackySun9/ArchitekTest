# Contributing to ArchitekTest

Thank you for your interest in contributing to ArchitekTest! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ArchitekTest.git
   cd ArchitekTest
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## 📋 Development Workflow

### Before Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Keep Your Branch Updated**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### While Developing

1. **Run Linting**
   ```bash
   npm run lint
   ```

2. **Run Formatting**
   ```bash
   npm run format
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run specific team tests
   npm run test:adobe
   
   # Run in headed mode for debugging
   npm run test:headed
   ```

4. **Check TypeScript**
   ```bash
   npm run lint
   ```

## 🎯 Code Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Enable strict mode** - follow the existing tsconfig.json settings
- **Use interfaces** for object types
- **Avoid `any`** - use proper types or `unknown` with type guards
- **Use async/await** instead of promises chains

### Code Style

We use ESLint and Prettier for consistent code style:

```bash
# Auto-fix linting issues
npm run lint:fix

# Format all files
npm run format
```

**Key Style Points:**
- Single quotes for strings
- 2 spaces for indentation
- Semicolons required
- Trailing commas in ES5
- 100 character line length

### Testing Guidelines

1. **Write Tests for New Features**
   - Add test specs in the appropriate team folder
   - Follow the existing test structure (page.ts, feature.ts, spec.ts)
   - Use meaningful test descriptions

2. **Test Structure**
   ```typescript
   test.describe('Feature Name', () => {
     test.beforeEach(async ({ page }) => {
       // Setup
     });

     test('should do something specific', async ({ page }) => {
       await test.step('Step 1: Action', async () => {
         // Test code
       });
       
       await test.step('Step 2: Verification', async () => {
         // Assertions
       });
     });
   });
   ```

3. **Use Page Object Model**
   - Extend `BasePage` for new page objects
   - Keep selectors in the page object
   - Use descriptive method names

4. **Test Tags**
   Use tags to categorize tests:
   - `@smoke` - Critical smoke tests
   - `@regression` - Full regression suite
   - `@critical` - High-priority tests
   - `@ai` - AI-powered tests
   - `@a11y` - Accessibility tests
   - `@performance` - Performance tests

### Documentation

- **Update README** for new features
- **Add JSDoc comments** to public APIs
- **Document complex logic** with inline comments
- **Update guides** in `docs/` folder

## 🔀 Pull Request Process

### 1. Prepare Your PR

- ✅ All tests pass locally
- ✅ Code is formatted and linted
- ✅ No TypeScript errors
- ✅ Documentation is updated
- ✅ Commits follow convention

### 2. Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

**Examples:**
```bash
feat(adobe-team): add brand concierge accessibility tests

fix(self-healing): improve selector confidence scoring

docs(readme): update quick start guide

test(search): add responsive design tests

chore(deps): update playwright to 1.45.1
```

### 3. Create Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open PR on GitHub**
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues
   - Add relevant labels

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] New tests added
   - [ ] Manual testing performed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   ```

### 4. Code Review

- **Respond to feedback** promptly
- **Make requested changes** in new commits
- **Don't force push** after review starts
- **Squash commits** before merging (if requested)

## 🏗️ Project Structure

```
ArchitekTest/
├── .github/              # GitHub Actions workflows
├── config/               # Configuration files
│   ├── environments.ts   # Environment configs
│   ├── teams/           # Team-specific configs
│   └── playwright.config.base.ts
├── docs/                 # Documentation
├── shared/              # Shared utilities
│   ├── base-page.ts     # Base page object
│   ├── logger.ts        # Logging utility
│   └── test-data/       # Shared test data
├── src/                 # AI tools and generators
│   ├── enhanced-rag.ts  # RAG engine
│   ├── test-generation-agent.ts
│   └── ...
├── teams/               # Team-specific tests
│   ├── adobe-team/
│   ├── search-team/
│   └── ...
└── visual-tests/        # Visual regression tests
```

## 🐛 Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if it's fixed
3. **Gather information** about your environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 13.0]
- Node version: [e.g. 20.0.0]
- Playwright version: [e.g. 1.45.0]
- Browser: [e.g. Chrome 120]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Describe the use case** clearly
3. **Provide examples** if possible
4. **Consider alternatives** you've explored

## 🏆 Recognition

Contributors will be:
- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes
- Given credit in relevant documentation

## 📞 Getting Help

- **Discord/Slack**: [Your community channel]
- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Email**: [Your contact email]

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

## 🙏 Thank You!

Your contributions make ArchitekTest better for everyone. We appreciate your time and effort!

---

**Happy Contributing!** 🚀

For more information:
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Development Guide](docs/guides/DEVELOPMENT.md)
- [Architecture Overview](docs/architecture/BLUEPRINT.md)
