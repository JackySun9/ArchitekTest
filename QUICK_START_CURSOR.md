# 🚀 Quick Start: Cursor IDE Integration

## Step 1: Add Your API Key

The same API key you use in Cursor works here!

```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

## Step 2: Run It!

```bash
npm run chat
```

## That's It! 🎉

You'll see:
```
🤖 Initializing LLM Provider: cursor
✅ Cursor CLI found
✅ API key available  
✅ Model: Claude 4.5 Sonnet (Thinking)
```

### What It Does:

- ✅ **Auto-detects** your Cursor installation
- ✅ **Uses your model** (the one you selected in Cursor)
- ✅ **Shares API key** (same billing as Cursor)
- ✅ **Generates tests** with the same AI!

### Benefits:

| Before | After (Cursor) |
|--------|----------------|
| 5 setup steps | 2 steps |
| Manual config | Auto-detected |
| Separate billing | Shared with Cursor |

### More Info:

- [Full Integration Guide](docs/guides/CURSOR_INTEGRATION.md)
- [Technical Details](CURSOR_INTEGRATION_SUMMARY.md)

**Happy testing with Cursor! 🎉**
