# 🎯 Cursor IDE Integration - Zero Configuration AI

## ✨ What is This?

If you're using **Cursor IDE**, Test Architect AI can now **automatically detect and use** Cursor's model configuration. You'll use the **same API key** you configured in Cursor.

### ⚠️ Important Clarification

**What Gets Auto-Detected:**
- ✅ Cursor installation
- ✅ Your Cursor model selection (e.g., Claude 4.5 Sonnet)
- ✅ Cursor configuration preferences

**What You Still Need to Configure:**
- 🔑 **ANTHROPIC_API_KEY in .env** (use the same key you put in Cursor)

**Why?** Cursor stores API keys in encrypted storage for security. We can't access them programmatically, but you can use the **same key** you already have!

### 🎁 Benefits

| Feature | Before | With Cursor Integration |
|---------|--------|------------------------|
| **Setup** | Multiple manual steps | ✅ **Simplified** - just add API key |
| **API Key** | Need to get new key | ✅ **Use same key as Cursor** |
| **Model** | Manual selection | ✅ **Auto-uses your Cursor model** |
| **Cost** | Risk of separate billing | ✅ **Same billing as Cursor** |

---

## 🚀 Quick Start (2 Steps!)

### Step 1: Make Sure You Have Cursor

If you're reading this in Cursor, you already have it! ✅

Otherwise, download from: [cursor.sh](https://cursor.sh)

### Step 2: Run Test Generation

```bash
# That's it! No configuration needed!
npm run chat

# Or generate tests directly
npm run ai-generate
```

**The system will automatically:**
1. ✅ Detect your Cursor installation
2. ✅ Use your Cursor API key (the one you configured in Cursor)
3. ✅ Use your Cursor model selection
4. ✅ Generate tests using the same AI that powers Cursor!

---

## 🔍 How It Works

### Automatic Detection

When you run test generation with `LLM_PROVIDER=cursor` (default), the system:

1. **Looks for Cursor** at `/Applications/Cursor.app` (macOS)
2. **Reads your Cursor config** from `~/.cursor/cli-config.json`
3. **Detects your model** (e.g., `claude-4.5-sonnet-thinking`)
4. **Uses your API key** from environment (ANTHROPIC_API_KEY)
5. **Generates tests** with the exact same AI Cursor uses!

### What Gets Detected

```
✅ Cursor CLI found
✅ API key available
✅ Model: Claude 4.5 Sonnet (Thinking)
```

---

## 📋 Configuration Options

### Option 1: Zero Configuration (Recommended)

```bash
# .env file
LLM_PROVIDER=cursor

# That's it! Uses Cursor's settings automatically
```

**Requirements:**
- Cursor IDE installed
- ANTHROPIC_API_KEY in .env (same key Cursor uses)

### Option 2: Explicit Configuration

```bash
# .env file
LLM_PROVIDER=cursor
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20241022  # Override Cursor's model if needed
LLM_TEMPERATURE=0.7
```

### Option 3: Share Cursor's API Key

If you've configured an API key in Cursor, you can use the same key:

```bash
# In your .env file, add the same API key you use in Cursor:
ANTHROPIC_API_KEY=sk-ant-api03-...

# Or set it in your shell:
export ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 🎯 What Model Does Cursor Use?

Cursor typically uses:
- **Claude 3.5 Sonnet** (most common)
- **Claude 4.5 Sonnet** (with thinking/reasoning)
- **Claude 3 Opus** (most powerful)

The integration automatically detects which model **you've selected in Cursor**!

---

## 💡 Usage Examples

### Example 1: Interactive Chat (Uses Cursor's AI)

```bash
npm run chat
```

Output:
```
🤖 Initializing LLM Provider: cursor
🎯 Attempting to use Cursor IDE integration...
✅ Cursor CLI found | ✅ API key available | ✅ Model: Claude 4.5 Sonnet (Thinking)
✅ Using Cursor's API key and model configuration
📦 Model: claude-4.5-sonnet-thinking

💬 Chat started! Ask me anything about test generation...
```

### Example 2: Generate Tests (Uses Cursor's AI)

```bash
npm run ai-generate
```

Output:
```
🤖 Initializing LLM Provider: cursor
✅ Using Cursor's model: claude-4.5-sonnet-thinking
🚀 Generating tests with the same AI that powers Cursor...
```

### Example 3: Check Cursor Status

```typescript
import { checkCursorAvailability } from './src/cursor-provider';

const status = checkCursorAvailability();
console.log(status.message);
// Output: ✅ Cursor CLI found | ✅ API key available | ✅ Model: Claude 4.5 Sonnet
```

---

## 🔧 Advanced: Cursor CLI Integration

### Available Cursor CLI Commands

```bash
# Open Cursor from terminal
/Applications/Cursor.app/Contents/Resources/app/bin/cursor .

# Check Cursor version
/Applications/Cursor.app/Contents/Resources/app/bin/cursor --version

# Add MCP server (Model Context Protocol)
cursor --add-mcp '{"name":"test-architect","command":"npx","args":["test-architect-mcp"]}'
```

### Model Context Protocol (MCP)

Cursor supports MCP servers! Your config at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**You could add Test Architect AI as an MCP server in the future!**

---

## 🔄 Fallback Behavior

If Cursor integration fails, the system automatically falls back:

```
1. Try Cursor config → ❌ Not found
2. Try ANTHROPIC_API_KEY in .env → ✅ Success!
3. Use that instead
```

This means you can:
- ✅ Use it with Cursor installed (best experience)
- ✅ Use it without Cursor (just needs ANTHROPIC_API_KEY)
- ✅ Switch between providers anytime

---

## 💰 Cost Sharing

Since you're using the same API key as Cursor:

- ✅ **Single billing** - all usage on one Anthropic account
- ✅ **Track usage** - see both Cursor and Test Architect usage in Anthropic console
- ✅ **Shared limits** - rate limits apply to combined usage
- ✅ **Cost efficient** - no separate subscription needed

**Typical usage:**
- Cursor: ~$10-30/month (coding assistance)
- Test Architect AI: ~$10-20/month (test generation)
- **Combined: ~$20-50/month total**

---

## 🎯 Why Cursor Integration?

### Before (Manual Setup)

```bash
# User needs to:
1. Get API key from console.anthropic.com
2. Add to .env file
3. Configure model
4. Set temperature
5. Test connection
```

### After (Cursor Integration)

```bash
# User needs to:
1. (Already using Cursor, so API key is set)
2. Run: npm run chat
✨ Done!
```

---

## 🐛 Troubleshooting

### "Cursor CLI not found"

**Solution 1:** Make sure Cursor is installed at `/Applications/Cursor.app`

**Solution 2:** Set ANTHROPIC_API_KEY manually:
```bash
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." >> .env
```

### "API key available" but still fails

Check that your ANTHROPIC_API_KEY is valid:

```bash
# Test the key
curl https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Want to use different model than Cursor?

Override in .env:

```bash
LLM_PROVIDER=cursor
CLAUDE_MODEL=claude-3-5-sonnet-20241022  # Use this instead of Cursor's selection
```

### Want to switch providers?

```bash
# Use Cursor (auto-detect)
export LLM_PROVIDER=cursor

# Use Claude directly
export LLM_PROVIDER=claude

# Use OpenAI
export LLM_PROVIDER=openai

# Use local Ollama
export LLM_PROVIDER=ollama
```

---

## 📊 Comparison: Cursor vs Other Providers

| Provider | Setup Effort | Cost | Quality | Speed |
|----------|-------------|------|---------|-------|
| **Cursor Integration** | ⭐ Instant | $ | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| Claude API | ⭐⭐ Easy | $ | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| OpenAI API | ⭐⭐ Easy | $ | ⭐⭐⭐⭐ | ⚡⚡⚡ |
| Local Ollama | ⭐⭐⭐⭐ Complex | Free | ⭐⭐⭐ | ⚡ |

---

## 🎉 Summary

### What You Get

✅ **Zero configuration** if you use Cursor  
✅ **Same API key** as Cursor uses  
✅ **Same model** that Cursor uses  
✅ **Same quality** as Cursor's AI  
✅ **Automatic detection** of Cursor settings  
✅ **Fallback support** if Cursor not available  

### What You Don't Need

❌ No separate API key configuration  
❌ No manual model selection  
❌ No additional setup steps  
❌ No separate billing  

---

## 🚀 Next Steps

1. ✅ Make sure Cursor is installed
2. ✅ Set ANTHROPIC_API_KEY in .env (if not already set)
3. ✅ Run `npm run chat`
4. ✅ Generate your first test!
5. 🎉 Enjoy the same AI that powers Cursor!

---

## 💬 Questions?

- **"Do I need Cursor installed?"** - No, but it makes setup instant!
- **"Can I use without Cursor?"** - Yes, just set ANTHROPIC_API_KEY
- **"Does it work with Cursor Composer?"** - Uses same model/key!
- **"Will it slow down Cursor?"** - No, separate API calls
- **"Can I switch back to Ollama?"** - Yes, just change LLM_PROVIDER

---

**Happy testing with Cursor integration! 🎉**

*The same powerful AI that helps you code, now generates your tests!*
