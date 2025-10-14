# 🚀 Using Claude API (Cursor's LLM) Instead of Local Ollama

This guide explains how to configure Test Architect AI to use **Claude API** (the same powerful LLM that Cursor uses) instead of running local Ollama models.

## 🎯 Why Use Claude API?

### **Advantages over Local Ollama:**

| Feature | Claude API | Local Ollama |
|---------|-----------|--------------|
| **Code Quality** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| **Speed** | ⚡ Fast (cloud) | 🐌 Slower (depends on hardware) |
| **Setup** | ✅ Simple (just API key) | ❌ Complex (download models) |
| **Reliability** | 🔒 99.9% uptime | 💻 Depends on local machine |
| **Model Updates** | 🆕 Always latest | 📦 Manual updates |
| **Disk Space** | 0 GB | 10-50 GB per model |
| **Memory Usage** | 0 GB | 8-32 GB RAM |

### **What is Claude?**

- **Claude 3.5 Sonnet** is Anthropic's most advanced AI model
- **Same AI that Cursor uses** for code completion and generation
- **Optimized for code** with superior reasoning and test generation
- **Context Engineering** instead of traditional RAG (more intelligent)

---

## 📋 Prerequisites

1. **Anthropic API Key** (Claude) - Get it from [console.anthropic.com](https://console.anthropic.com/)
2. Or **OpenAI API Key** (GPT-4) - Get it from [platform.openai.com](https://platform.openai.com/api-keys)

---

## 🔧 Setup Instructions

### Step 1: Get Your API Key

#### **Option A: Claude (Recommended - Same as Cursor)**

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create Key"**
5. Copy your key (starts with `sk-ant-api03-...`)

**Pricing:** $3 per million input tokens, $15 per million output tokens ([Pricing Details](https://www.anthropic.com/pricing#anthropic-api))

#### **Option B: OpenAI (Alternative)**

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy your key (starts with `sk-...`)

**Pricing:** $5-15 per million tokens depending on model ([Pricing Details](https://openai.com/api/pricing/))

---

### Step 2: Configure Environment Variables

Edit your `.env` file (or create one from `.env.example`):

```bash
# =============================================================================
# AI CONFIGURATION - Using Claude (Same as Cursor!)
# =============================================================================

# Set provider to 'claude' (or 'openai', or 'ollama' for local)
LLM_PROVIDER=claude

# Your Claude API key from console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Optional: Specify Claude model (default: claude-3-5-sonnet-20241022)
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Optional: Temperature for creativity (0.0-1.0, default: 0.7)
LLM_TEMPERATURE=0.7

# =============================================================================
# FOR OPENAI USERS (Alternative to Claude)
# =============================================================================

# LLM_PROVIDER=openai
# OPENAI_API_KEY=sk-your-openai-key-here
# OPENAI_MODEL=gpt-4o
```

---

### Step 3: Configure Embeddings for RAG

For the RAG (Retrieval-Augmented Generation) system, you have two options:

#### **Option A: OpenAI Embeddings (Recommended with Claude)**

Add to your `.env`:

```bash
# Use OpenAI for embeddings (works great with Claude for generation)
OPENAI_API_KEY=sk-your-openai-key-here
```

The system will automatically use OpenAI's `text-embedding-3-small` model for embeddings.

**Cost:** Very cheap (~$0.02 per 1M tokens) - [Pricing](https://openai.com/api/pricing/)

#### **Option B: Keep Local Ollama for Embeddings Only**

If you want to use Claude/OpenAI for generation but keep embeddings local:

```bash
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-api03-...

# The system will fall back to local Ollama for embeddings
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_EMBED_MODEL=nomic-embed-text:latest
```

This hybrid approach:
- ✅ Uses powerful Claude for test generation
- ✅ Uses free local embeddings for RAG
- ⚠️ Still requires Ollama installation

---

### Step 4: Verify Configuration

Test your setup:

```bash
# Test the LLM connection
npm run chat

# Or generate a test
npm run ai-generate
```

You should see:

```
🤖 Initializing LLM Provider: claude
🚀 Initializing Enhanced RAG Engine with configurable LLM provider...
🔍 Initializing Embeddings Provider: claude
✅ Successfully connected to Claude API!
```

---

## 💡 Usage Examples

### Generate Tests with Claude

```bash
# Interactive chat mode
npm run chat

# Direct test generation
npm run ai-generate
```

The system will now use Claude API instead of local Ollama!

### Example Output

```
🤖 Initializing LLM Provider: claude
🚀 Test Generation Agent with Claude 3.5 Sonnet
🔍 Analyzing page: https://www.adobe.com
✨ Generating comprehensive test suite...
📝 Generated 15 test scenarios with 98% coverage
✅ Tests written to: teams/adobe-team/feature-name.spec.ts
```

---

## 🎛️ Model Options

### Claude Models (Anthropic)

```bash
# Best for code generation (recommended)
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Fast and cost-effective
CLAUDE_MODEL=claude-3-5-haiku-20241022

# Most powerful (if available)
CLAUDE_MODEL=claude-3-opus-20240229
```

### OpenAI Models

```bash
# Latest and most capable
OPENAI_MODEL=gpt-4o

# Cost-effective alternative
OPENAI_MODEL=gpt-4o-mini

# Older but reliable
OPENAI_MODEL=gpt-4-turbo
```

### Local Ollama (Fallback)

```bash
LLM_PROVIDER=ollama
OLLAMA_MODEL=deepseek-r1:14b
```

---

## 🔄 Switching Between Providers

You can easily switch providers by changing one environment variable:

```bash
# Use Claude (Cursor's LLM) - Best code quality
export LLM_PROVIDER=claude

# Use OpenAI (GPT-4) - Alternative
export LLM_PROVIDER=openai

# Use Local Ollama - No API costs
export LLM_PROVIDER=ollama
```

---

## 💰 Cost Estimation

### Claude API (Recommended)

**Typical test generation:**
- Input: ~10,000 tokens (page analysis + context)
- Output: ~5,000 tokens (generated tests)
- **Cost per test suite: ~$0.10-0.15**

**Monthly estimate (100 test suites):**
- **$10-15 per month** for active development

### OpenAI API

**Typical test generation:**
- **Cost per test suite: ~$0.05-0.20** (depending on model)
- **Monthly estimate: $5-20 per month**

### Local Ollama

- **$0** (but requires powerful hardware)
- GPU recommended: RTX 3090 or better
- 32GB+ RAM recommended

---

## 🎯 Agentic Context Engineering vs Traditional RAG

### What Changed?

Traditional RAG (Retrieval-Augmented Generation):
```
User Query → Embed → Vector Search → Retrieve Chunks → LLM Generation
```

**Agentic Context Engineering** (what Claude does):
```
User Query → Intelligent Agent → Dynamic Context Building → Reasoning → Action
```

### ReAct Agent Pattern

The system now uses **ReAct** (Reasoning + Acting):

1. **Think**: Agent reasons about what information is needed
2. **Act**: Agent uses tools (page analyzer, codebase query, etc.)
3. **Observe**: Agent processes tool results
4. **Reflect**: Agent evaluates if task is complete
5. **Repeat**: Continue until goal achieved

This is more intelligent than simple vector search!

---

## 🔧 Troubleshooting

### "ANTHROPIC_API_KEY is required" Error

```bash
# Make sure your .env file has the key:
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Or set it directly:
export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### "OPENAI_API_KEY not found for embeddings, falling back to Ollama"

This is normal if you only have Claude configured. Options:

1. Add OpenAI key for embeddings (recommended)
2. Keep local Ollama just for embeddings
3. System will auto-fallback to local

### Rate Limit Errors

If you hit API rate limits:

```bash
# Reduce temperature for more deterministic (and faster) responses
LLM_TEMPERATURE=0.3

# Or switch to a different model temporarily
CLAUDE_MODEL=claude-3-5-haiku-20241022
```

---

## 📊 Comparison: Claude vs Local Ollama

### Code Generation Quality

**Test generated with Claude:**
```typescript
// Comprehensive, well-structured, follows best practices
test('should handle complex user workflow with proper assertions', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  
  // Accessibility check
  await expect(page.getByLabel('Main navigation')).toBeAttached();
  
  // Performance assertion
  await expect(page).toHaveTitle(/Dashboard/, { timeout: 3000 });
});
```

**Test generated with Local Ollama:**
```typescript
// Simpler, may miss edge cases
test('dashboard test', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForSelector('h1');
});
```

---

## 🎉 Benefits You'll Notice

1. **Better Test Quality**: More comprehensive assertions and edge cases
2. **Faster Generation**: Cloud API is typically faster than local models
3. **No Setup Hassle**: No downloading large model files
4. **Always Updated**: Access to latest model improvements
5. **Reliable**: 99.9% API uptime vs local machine issues

---

## 📚 Next Steps

1. ✅ Configure your API key
2. 🚀 Generate your first test suite
3. 📖 Read about [ReAct Agents](./BETTER_APPROACHES.md)
4. 🔄 Compare results with local Ollama
5. 🎯 Optimize your prompts for best results

---

## 💬 Need Help?

- **API Issues**: Check [Anthropic Status](https://status.anthropic.com/)
- **Cost Concerns**: See [Pricing Calculator](https://www.anthropic.com/pricing)
- **Model Questions**: Read [Claude Documentation](https://docs.anthropic.com/)

---

**Happy Testing with Claude! 🎉**

*Same powerful AI that Cursor uses, now generating your tests!*
