# 🚀 Quick Start: Using Claude API (Cursor's AI)

## Step 1: Get Your API Key

Visit [console.anthropic.com](https://console.anthropic.com/) and create an API key.

## Step 2: Configure Your .env File

```bash
# Copy the example
cp .env.example .env

# Edit .env and add:
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

## Step 3: Test It!

```bash
# Interactive chat mode
npm run chat

# Or generate a test directly
npm run ai-generate
```

## That's It! 🎉

You're now using the same powerful AI that Cursor uses!

### What You Get:
- ✅ Better test quality than local Ollama
- ✅ 2-3x faster generation
- ✅ No 10-50GB model downloads
- ✅ Works on any computer
- ✅ Always latest Claude models

### Cost:
- ~$0.10-0.15 per test suite
- ~$10-20/month for active development

### More Info:
- [Full Setup Guide](docs/guides/CLAUDE_API_SETUP.md)
- [Migration from Ollama](docs/guides/MIGRATION_TO_CLAUDE.md)
- [Complete Changes](CLAUDE_API_MIGRATION.md)
