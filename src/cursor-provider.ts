import 'dotenv/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

/**
 * Cursor AI Provider
 * Integrates with Cursor IDE/CLI to use Cursor's AI directly
 * 
 * This provider leverages:
 * 1. Cursor's configured API key (if available)
 * 2. Cursor's model selection (claude-4.5-sonnet-thinking, etc.)
 * 3. Cursor's privacy settings and context
 */
export class CursorProvider {
  private cursorCliPath: string | null = null;
  private cursorConfig: any = null;
  private apiKey: string | null = null;

  constructor() {
    this.detectCursor();
  }

  /**
   * Detect Cursor installation and configuration
   */
  private detectCursor(): void {
    // Try to find Cursor CLI
    const possiblePaths = [
      '/Applications/Cursor.app/Contents/Resources/app/bin/cursor',
      path.join(os.homedir(), '.cursor', 'bin', 'cursor'),
      '/usr/local/bin/cursor',
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        this.cursorCliPath = p;
        console.log(`✅ Found Cursor CLI at: ${p}`);
        break;
      }
    }

    // Load Cursor configuration
    const configPath = path.join(os.homedir(), '.cursor', 'cli-config.json');
    if (fs.existsSync(configPath)) {
      try {
        this.cursorConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log(`✅ Loaded Cursor config: Model = ${this.cursorConfig?.model?.displayName}`);
      } catch (error) {
        console.warn('⚠️  Failed to load Cursor config:', error);
      }
    }

    // Try to find API key from environment or Cursor's storage
    this.apiKey = this.findApiKey();
  }

  /**
   * Find API key from various sources
   */
  private findApiKey(): string | null {
    // 1. Check environment variable (user-provided)
    if (process.env.CURSOR_API_KEY) {
      return process.env.CURSOR_API_KEY;
    }

    // 2. Check if Anthropic API key is available (Cursor uses this)
    if (process.env.ANTHROPIC_API_KEY) {
      return process.env.ANTHROPIC_API_KEY;
    }

    // Note: Cursor stores API keys in encrypted storage, not directly accessible
    // User needs to set ANTHROPIC_API_KEY or CURSOR_API_KEY in .env
    
    return null;
  }

  /**
   * Check if Cursor integration is available
   */
  isAvailable(): boolean {
    return this.cursorCliPath !== null || this.apiKey !== null;
  }

  /**
   * Get Cursor's configured model
   */
  getCursorModel(): string {
    if (this.cursorConfig?.model?.modelId) {
      return this.cursorConfig.model.modelId;
    }
    return 'claude-3-5-sonnet-20241022'; // Default fallback
  }

  /**
   * Get configuration for use with LangChain
   */
  getConfig(): { apiKey: string; model: string; source: string } | null {
    if (!this.apiKey) {
      return null;
    }

    return {
      apiKey: this.apiKey,
      model: this.getCursorModel(),
      source: 'cursor-config'
    };
  }

  /**
   * Execute a prompt using Cursor's CLI (experimental)
   * This is a fallback if direct API integration doesn't work
   */
  async executePrompt(prompt: string): Promise<string> {
    if (!this.cursorCliPath) {
      throw new Error('Cursor CLI not found. Please install Cursor or set ANTHROPIC_API_KEY.');
    }

    try {
      // Note: This is experimental - Cursor CLI might not support direct prompting
      // In practice, we'll use the API key with Claude directly
      const { stdout } = await execAsync(`"${this.cursorCliPath}" --version`);
      console.log('Cursor version:', stdout.trim());
      
      // For now, return guidance message
      return 'Note: Direct Cursor CLI prompting not yet supported. Using Cursor\'s API key with Claude API.';
    } catch (error) {
      throw new Error(`Failed to execute Cursor CLI: ${error}`);
    }
  }

  /**
   * Get status message about Cursor integration
   */
  getStatus(): string {
    if (!this.cursorCliPath && !this.apiKey) {
      return '❌ Cursor not detected. Install Cursor or set ANTHROPIC_API_KEY in .env';
    }

    const parts = [];
    
    if (this.cursorCliPath) {
      parts.push(`✅ Cursor CLI found`);
    }
    
    if (this.apiKey) {
      parts.push(`✅ API key available`);
    }
    
    if (this.cursorConfig?.model) {
      parts.push(`✅ Model: ${this.cursorConfig.model.displayName}`);
    }

    return parts.join(' | ');
  }
}

/**
 * Check if user has Cursor installed and configured
 */
export function checkCursorAvailability(): {
  available: boolean;
  message: string;
  config: any;
} {
  const provider = new CursorProvider();
  const config = provider.getConfig();

  return {
    available: provider.isAvailable(),
    message: provider.getStatus(),
    config: config
  };
}

/**
 * Get Cursor's API configuration for use with LangChain
 */
export function getCursorLLMConfig(): {
  provider: 'claude';
  apiKey: string;
  model: string;
} | null {
  const cursorProvider = new CursorProvider();
  const config = cursorProvider.getConfig();

  if (!config) {
    return null;
  }

  return {
    provider: 'claude',
    apiKey: config.apiKey,
    model: config.model
  };
}
