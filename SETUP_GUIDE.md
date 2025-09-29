# 🚀 **Your Test Architect AI Setup Guide**

## ✅ **Configuration Ready!**

Your `config.ts` file has been created and optimized for your specific models. The system is now configured to use **DeepSeek-R1:14b** by default - your best tested model!

## 🎯 **Quick Start (Ready to Use)**

### **1. Your Config is Active** ✅
The system will automatically use your `config.ts` with these optimized settings:
- **Default Model**: `deepseek-r1:14b` (tested and proven excellent)
- **Fallback Models**: All your available models ranked by quality
- **Performance**: Optimized settings for your hardware

### **2. Generate High-Quality Tests** 🏆
```bash
# Basic test generation (uses config automatically)
npm run start -- generate \
  --feature "user-authentication" \
  --requirements "Test login, registration, password reset with validation" \
  --team "auth-team"

# With URL analysis for even better results
npm run start -- generate \
  --feature "product-search" \
  --requirements "Test search with filters and autocomplete" \
  --team "catalog-team" \
  --url "https://example.com/search"
```

### **3. Switch Models Easily** 🔄
```bash
# Use your fastest model for iteration
export OLLAMA_MODEL=deepseek-r1:8b
npm run start -- generate ...

# Use your best quality model for production
export OLLAMA_MODEL=deepseek-r1:14b
npm run start -- generate ...

# Try experimental models
export OLLAMA_MODEL=qwen3:32b
npm run start -- generate ...
```

## 📊 **Your Model Quality Ranking** (From Config)

| Model | Size | Quality | Speed | Status | Best For |
|-------|------|---------|-------|--------|----------|
| **deepseek-r1:14b** | 9GB | Excellent | Good | ✅ **DEFAULT** | Production tests |
| **deepseek-r1:8b** | 5.2GB | Very Good | Fast | ✅ Available | Fast iteration |
| **qwen3:32b** | 20GB | Likely Excellent | Slow | ❓ Untested | Complex scenarios |
| **devstral:24b** | 14GB | Very Good | Medium | ❓ Untested | Code generation |
| **gpt-oss:20b** | 13GB | Good | Medium | ❓ Untested | General purpose |
| llama3.3:70b | 42GB | Would be best | Very Slow | ❌ Crashes | Too resource heavy |
| gemma3:27b | 17GB | Poor | Medium | ❌ **AVOID** | None |

## 🎛️ **Configuration Options**

### **Customize Your Config** (config.ts)
```typescript
export const CONFIG = {
  ollama: {
    model: 'deepseek-r1:14b', // Change this to try different models
    baseUrl: 'http://localhost:11434',
  },
  
  testGeneration: {
    maxScenariosPerCategory: 3, // Increase for more scenarios
    maxElementsToAnalyze: 25, // Increase for more detailed analysis
    includePerformanceTests: true, // Toggle test types
    includeAccessibilityTests: true,
    includeSecurityTests: true,
  }
};
```

### **Environment Variable Override**
```bash
# Temporarily use a different model
export OLLAMA_MODEL=devstral:24b
npm run start -- generate ...

# Use different Ollama server
export OLLAMA_BASE_URL=http://remote-server:11434
npm run start -- generate ...
```

## 🧪 **Test Different Models**

### **Compare Model Quality**
```bash
npm run test-models
```
This will benchmark all your available models and show quality scores.

### **Manual Model Testing**
```bash
# Test DeepSeek-R1:8b (faster)
export OLLAMA_MODEL=deepseek-r1:8b
npm run start -- generate --feature "test" --team "test" --requirements "simple test"

# Test QWen3:32b (potentially excellent)
export OLLAMA_MODEL=qwen3:32b
npm run start -- generate --feature "test" --team "test" --requirements "simple test"

# Compare results and pick your favorite!
```

## ⚡ **Performance Optimization**

### **If Models Are Slow**
```bash
# Optimize Ollama performance
export OLLAMA_NUM_PARALLEL=2
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_FLASH_ATTENTION=1
```

### **Memory Management**
- **DeepSeek-R1:8b** - Use for fast development (5GB RAM)
- **DeepSeek-R1:14b** - Use for quality results (9GB RAM)
- **QWen3:32b** - Only if you have 20GB+ RAM available

## 🎯 **Expected Quality Improvements**

With your new config using **DeepSeek-R1:14b**, you should see:

### **Before (Gemma3:27b):**
```typescript
// Generic, meaningless steps
await test.step('Step 1: Navigate to page', async () => {
  await page.waitForTimeout(100);
});
```

### **After (DeepSeek-R1:14b):**
```typescript
// Specific, actionable steps
await test.step('Enter search query for JavaScript tutorials', async () => {
  await searchPage.performSearch('JavaScript tutorials');
});
```

### **Scenario Quality:**
- ✅ **12 scenarios** instead of 10 generic ones
- ✅ **Realistic test data** like "laptop computer", "notebook"
- ✅ **Autocomplete testing** when requirements mention it
- ✅ **Specific verifications** instead of generic URL checks

## 🚀 **You're Ready!**

Your Test Architect AI is now configured with:
- ✅ **Best available model** (DeepSeek-R1:14b) as default
- ✅ **Optimized settings** for your hardware
- ✅ **Easy model switching** for different use cases
- ✅ **Performance tuning** options

**Just run your test generation commands and enjoy the high-quality results!** 🎉

---

### **Quick Reference:**
```bash
# Generate tests (uses config automatically)
npm run start -- generate --feature "my-feature" --team "my-team" --requirements "my requirements"

# Switch models temporarily
export OLLAMA_MODEL=deepseek-r1:8b

# Test model quality
npm run test-models
```
