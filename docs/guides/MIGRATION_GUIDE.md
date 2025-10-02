# Migration Guide: Single Config → Separate Configs

## Overview

This guide walks through migrating from a single `playwright.config.ts` to team-specific configs for better scalability and team independence.

**Timeline:** 1-2 sprints  
**Risk:** Low (gradual migration, no breaking changes)  
**Benefit:** High (enables 10+ teams to work independently)

---

## Phase 1: Setup Base Infrastructure (Week 1)

### ✅ Step 1.1: Create Base Config
**Status:** ✅ Complete

Created files:
- `config/playwright.config.base.ts` - Shared configuration
- `config/environments.ts` - All team environments
- `config/teams/` - Directory for team configs

### ✅ Step 1.2: Create Team-Specific Configs
**Status:** ✅ Complete (3 teams)

Created configs for:
- ✅ Adobe: `config/teams/adobe.config.ts`
- ✅ Search: `config/teams/search.config.ts`
- ✅ Auth: `config/teams/auth.config.ts`

### ⏳ Step 1.3: Add Remaining Teams
**Status:** Pending

Need to create configs for:
- ⏳ AI team
- ⏳ Payment team
- ⏳ Analytics team
- ⏳ Notification team
- ⏳ Messaging team
- ⏳ Profile team
- ⏳ Settings team

**Template for new team:**
```bash
# Copy template
cp config/teams/search.config.ts config/teams/[TEAM_NAME].config.ts

# Edit the file to customize:
# 1. Change team name
# 2. Update testDir path
# 3. Adjust timeout settings
# 4. Configure projects (browsers)
# 5. Add team metadata
```

---

## Phase 2: Pilot Migration (Week 1-2)

### ✅ Step 2.1: Choose Pilot Team
**Recommendation:** Adobe team (already configured)

**Why Adobe?**
- Most complex tests (good stress test)
- Active development (finds issues early)
- Strong team buy-in

### Step 2.2: Test Pilot Team Config

```bash
# Test Adobe team with new config
npm run test:adobe

# Compare with old config (if old one still exists)
TEST_ENV=dev playwright test teams/adobe-team/

# Verify all tests pass
npm run test:adobe:dev
npm run test:adobe:stage
```

### Step 2.3: Validate Results

✅ Checklist:
- [ ] All tests from old config pass with new config
- [ ] Environment switching works (dev/stage/prod)
- [ ] Browser projects work (chromium, firefox, webkit)
- [ ] Test reports generate correctly
- [ ] No performance regression

---

## Phase 3: Gradual Team Migration (Week 2-4)

### Migration Order (Recommended)

1. ✅ **Adobe** (Week 1) - Pilot team
2. **Search** (Week 2) - Simple tests, low risk
3. **Auth** (Week 2) - Critical but stable
4. **AI** (Week 3) - New team, can start fresh
5. **Payment** (Week 3) - Requires careful validation
6. **Analytics** (Week 3) - Large test suite
7. **Remaining teams** (Week 4) - Parallel migration

### Per-Team Migration Steps

For each team:

#### 1. Create Team Config
```bash
# Copy template
cp config/teams/adobe.config.ts config/teams/[TEAM_NAME].config.ts

# Update team-specific settings
vim config/teams/[TEAM_NAME].config.ts
```

#### 2. Add Environment URLs
```typescript
// In config/environments.ts
export const ENVIRONMENTS = {
  // ... existing teams ...
  
  [TEAM_NAME]: {
    dev: {
      baseURL: 'https://[team]-dev.example.com',
      apiURL: 'https://[team]-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://[team]-stage.example.com',
      apiURL: 'https://[team]-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://[team].example.com',
      apiURL: 'https://[team]-api.example.com',
    },
  },
};
```

#### 3. Add npm Scripts
```json
// In package.json
{
  "scripts": {
    "test:[team]": "playwright test --config=config/teams/[team].config.ts",
    "test:[team]:dev": "TEST_ENV=dev playwright test --config=config/teams/[team].config.ts",
    "test:[team]:stage": "TEST_ENV=stage playwright test --config=config/teams/[team].config.ts",
    "test:[team]:prod": "TEST_ENV=prod playwright test --config=config/teams/[team].config.ts"
  }
}
```

#### 4. Test Team Config
```bash
# Run tests with new config
npm run test:[team]

# Test all environments
npm run test:[team]:dev
npm run test:[team]:stage

# Compare with old results
```

#### 5. Update CODEOWNERS
```
# In .github/CODEOWNERS
/config/teams/[team].config.ts  @[team]-team
/teams/[team]-team/             @[team]-team
```

#### 6. Team Sign-off
- [ ] Team lead reviews config
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Team members trained

---

## Phase 4: CI/CD Integration (Week 3-4)

### Step 4.1: Update GitHub Actions

```bash
# New workflow file created
.github/workflows/playwright-multi-team.yml
```

**Features:**
- ✅ Parallel execution per team
- ✅ Matrix strategy (team × environment)
- ✅ Isolated failures (one team doesn't block others)
- ✅ Separate artifacts per team

### Step 4.2: Test CI/CD Pipeline

```bash
# Push to test branch
git checkout -b test/multi-team-ci
git push origin test/multi-team-ci

# Create PR to trigger workflow
# Monitor: https://github.com/[org]/[repo]/actions

# Verify:
# - All teams run in parallel
# - Artifacts uploaded correctly
# - PR comments work
```

### Step 4.3: Setup Branch Protection

```
Settings → Branches → main
  ✅ Require status checks to pass
    ✅ test-adobe
    ✅ test-search
    ✅ test-auth
    ... (all teams)
```

---

## Phase 5: Cleanup (Week 4)

### Step 5.1: Remove Old Config

```bash
# ONLY after all teams migrated and validated

# Backup old config
mkdir -p backups/migration-$(date +%Y%m%d)
cp playwright.config.ts backups/migration-$(date +%Y%m%d)/

# Remove old config
rm playwright.config.ts

# Update default test command
# In package.json:
# "test": "playwright test"  # Now uses team-specific configs
```

### Step 5.2: Update Documentation

Files to update:
- [ ] README.md - New config structure
- [ ] SETUP_GUIDE.md - Installation steps
- [ ] CI/CD docs - New workflow
- [ ] Team onboarding - Config creation process

### Step 5.3: Archive Migration Artifacts

```bash
# Keep for historical reference
mkdir -p docs/migration/
mv MIGRATION_GUIDE.md docs/migration/
mv CONFIG_COMPARISON.md docs/migration/
mv backups/migration-* docs/migration/
```

---

## Rollback Plan

If issues arise during migration:

### Option 1: Rollback Single Team
```bash
# Revert team config
git revert [commit-hash]

# Use old test command temporarily
playwright test teams/[team]-team/
```

### Option 2: Rollback Entire Migration
```bash
# Restore old config
cp backups/migration-[date]/playwright.config.ts .

# Update package.json scripts
# Notify all teams
```

### Option 3: Hybrid Approach
Keep both old and new configs during transition:
```json
{
  "scripts": {
    "test:adobe": "playwright test --config=config/teams/adobe.config.ts",
    "test:adobe:old": "playwright test teams/adobe-team/"
  }
}
```

---

## Validation Checklist

### Per Team
- [ ] Config file created and reviewed
- [ ] Environment URLs added
- [ ] npm scripts work
- [ ] All tests pass (dev/stage/prod)
- [ ] No performance regression
- [ ] Team trained and signed off

### Infrastructure
- [ ] Base config stable
- [ ] CODEOWNERS configured
- [ ] CI/CD pipeline working
- [ ] Artifacts uploading correctly
- [ ] PR comments functional

### Documentation
- [ ] Migration guide complete
- [ ] Team onboarding updated
- [ ] README updated
- [ ] Config examples provided

---

## Success Metrics

### Before Migration (Baseline)
- Config file size: ~200 lines
- Merge conflicts/week: ~5
- Test execution time: ~15 min
- Onboarding time: 2-3 days

### After Migration (Target)
- Config file size: ~50 lines/team
- Merge conflicts/week: <1
- Test execution time: ~8 min (parallel)
- Onboarding time: 1-2 hours

---

## Team Communication Template

### Email to Teams
```
Subject: Playwright Config Migration - [Team Name]

Hi [Team Name],

We're migrating to team-specific Playwright configs to enable better
scalability and team independence.

**What's changing:**
- Your tests now use: config/teams/[team].config.ts
- New npm scripts: npm run test:[team]
- You own your config file (no more merge conflicts!)

**Action items:**
1. Review your new config: config/teams/[team].config.ts
2. Test locally: npm run test:[team]
3. Sign off by: [Date]

**Benefits:**
✅ No more merge conflicts with other teams
✅ Full control over your test settings
✅ Faster CI/CD (parallel execution)
✅ Easier onboarding for new team members

**Questions?**
Contact: @test-infrastructure-team
Slack: #test-automation
Docs: /docs/SCALING_GUIDE.md

Thanks!
Test Infrastructure Team
```

---

## FAQ

### Q: Do we need to migrate all teams at once?
**A:** No! Migrate gradually (1-2 teams per week).

### Q: What if our tests break during migration?
**A:** Rollback to old config while we debug. No downtime.

### Q: Can we keep both configs during transition?
**A:** Yes! Hybrid approach is safe.

### Q: Who owns the base config?
**A:** Test Infrastructure team (protected by CODEOWNERS).

### Q: How do we add a new team later?
**A:** Copy template, update settings, add to CI/CD. Takes ~1 hour.

### Q: What about shared test utilities?
**A:** Stays in `/shared/` - all teams can use.

---

## Current Status

### ✅ Completed
- [x] Base config created
- [x] Environments file created
- [x] Adobe team config
- [x] Search team config
- [x] Auth team config
- [x] CODEOWNERS file
- [x] CI/CD workflow
- [x] npm scripts updated
- [x] Documentation written

### ⏳ In Progress
- [ ] Remaining team configs
- [ ] CI/CD testing
- [ ] Team communication

### 📋 Upcoming
- [ ] Pilot team validation
- [ ] Gradual team migration
- [ ] Old config removal
- [ ] Final documentation update

---

## Next Steps

1. **Review** this migration guide
2. **Test** Adobe team config (pilot)
3. **Create** remaining team configs
4. **Migrate** teams gradually
5. **Celebrate** 🎉 when complete!

---

**Questions?** Contact @test-infrastructure-team or check `/docs/SCALING_GUIDE.md`

