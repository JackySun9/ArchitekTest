/**
 * Environment variable validation
 * Ensures all required environment variables are set before running
 * 
 * Usage:
 *   import { validateEnvironment } from './config/env-validator';
 *   validateEnvironment();
 */

export interface EnvConfig {
  required: string[];
  optional: string[];
}

const ENV_CONFIG: EnvConfig = {
  required: [
    // Commented out TEST_ENV since it has a default value in code
    // 'TEST_ENV', // dev, stage, prod
  ],
  optional: [
    'TEST_ENV',         // Environment: dev, stage, prod (has default)
    'TEST_TEAM',        // Team name for running specific team tests
    // AI Provider Configuration
    'LLM_PROVIDER',     // AI provider: claude, openai, or ollama
    'LLM_TEMPERATURE',  // Temperature for LLM (0.0-1.0)
    'ANTHROPIC_API_KEY', // Claude API key
    'CLAUDE_MODEL',     // Claude model name
    'OPENAI_API_KEY',   // OpenAI API key
    'OPENAI_MODEL',     // OpenAI model name
    'OLLAMA_MODEL',     // Ollama model for local AI
    'OLLAMA_BASE_URL',  // Ollama server URL
    'OLLAMA_EMBED_MODEL', // Ollama embedding model
    // Other Configuration
    'LOG_LEVEL',        // Logging level: DEBUG, INFO, WARN, ERROR
    'BASE_URL',         // Override base URL for testing
    'CI',               // CI environment flag
  ],
};

export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of ENV_CONFIG.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables (just for information)
  for (const key of ENV_CONFIG.optional) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  // Report missing required variables
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n💡 Create a .env file with these variables');
    console.error('   Copy .env.example to .env and configure it');
    process.exit(1);
  }

  // Report missing optional variables in non-production environments
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.info('ℹ️  Optional environment variables not set (using defaults):');
    warnings.forEach((key) => console.info(`   - ${key}`));
  }

  console.log('✅ Environment validation passed');
}

/**
 * Get environment with validation
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not set and no default provided`);
  }
  return value || defaultValue!;
}

/**
 * Get environment with type safety
 */
export function getEnvAsNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set and no default provided`);
  }
  if (!value) return defaultValue!;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} is not a valid number: ${value}`);
  }
  return num;
}

/**
 * Get boolean environment variable
 */
export function getEnvAsBoolean(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set and no default provided`);
  }
  if (!value) return defaultValue!;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Validate URL format
 */
export function validateUrl(url: string, name: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error(`Invalid URL for ${name}: ${url}`);
  }
}

export default validateEnvironment;
