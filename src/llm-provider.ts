import 'dotenv/config';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { Ollama } from '@langchain/community/llms/ollama';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseLanguageModel } from '@langchain/core/language_models/base';

export type LLMProvider = 'claude' | 'openai' | 'ollama';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Factory for creating LLM instances based on configuration
 * Supports Claude (Anthropic), OpenAI, and Ollama providers
 */
export class LLMProviderFactory {
  /**
   * Create an LLM instance based on environment configuration
   */
  static createLLM(config?: Partial<LLMConfig>): BaseLanguageModel {
    const provider = (config?.provider || process.env.LLM_PROVIDER || 'claude') as LLMProvider;

    console.log(`🤖 Initializing LLM Provider: ${provider}`);

    switch (provider) {
      case 'claude':
        return this.createClaude(config);
      case 'openai':
        return this.createOpenAI(config);
      case 'ollama':
        return this.createOllama(config);
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }

  /**
   * Create Claude (Anthropic) LLM instance
   * This is what Cursor uses - excellent for code generation
   */
  private static createClaude(config?: Partial<LLMConfig>): ChatAnthropic {
    const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY is required. Get it from: https://console.anthropic.com/\n' +
        'Set it in .env: ANTHROPIC_API_KEY=sk-ant-...'
      );
    }

    return new ChatAnthropic({
      anthropicApiKey: apiKey,
      modelName: config?.model || process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      temperature: config?.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: 4096,
    });
  }

  /**
   * Create OpenAI LLM instance
   * Alternative to Claude - GPT-4o or GPT-4-turbo recommended
   */
  private static createOpenAI(config?: Partial<LLMConfig>): ChatOpenAI {
    const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is required. Get it from: https://platform.openai.com/api-keys\n' +
        'Set it in .env: OPENAI_API_KEY=sk-...'
      );
    }

    return new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: config?.model || process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: config?.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: 4096,
    });
  }

  /**
   * Create Ollama LLM instance (local)
   * Fallback option - runs locally but less powerful
   */
  private static createOllama(config?: Partial<LLMConfig>): Ollama {
    return new Ollama({
      baseUrl: config?.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: config?.model || process.env.OLLAMA_MODEL || 'deepseek-r1:14b',
      temperature: config?.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
    });
  }

  /**
   * Create embedding model for RAG
   * Uses appropriate embedding model for each provider
   */
  static createEmbeddings(config?: Partial<LLMConfig>) {
    const provider = (config?.provider || process.env.LLM_PROVIDER || 'claude') as LLMProvider;

    console.log(`🔍 Initializing Embeddings Provider: ${provider}`);

    switch (provider) {
      case 'claude':
      case 'openai':
        // OpenAI has the best embeddings API
        const { OpenAIEmbeddings } = require('@langchain/openai');
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
          console.warn('⚠️  OPENAI_API_KEY not found for embeddings, falling back to Ollama');
          return this.createOllamaEmbeddings();
        }

        return new OpenAIEmbeddings({
          openAIApiKey: apiKey,
          modelName: 'text-embedding-3-small', // Cost-effective and fast
        });

      case 'ollama':
        return this.createOllamaEmbeddings();

      default:
        throw new Error(`Unsupported embedding provider: ${provider}`);
    }
  }

  private static createOllamaEmbeddings() {
    const { OllamaEmbeddings } = require('@langchain/community/embeddings/ollama');
    return new OllamaEmbeddings({
      model: process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text:latest',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    });
  }
}

/**
 * Get recommended model based on task
 */
export function getRecommendedModel(task: 'code-generation' | 'reasoning' | 'fast'): LLMConfig {
  const provider = (process.env.LLM_PROVIDER || 'claude') as LLMProvider;

  const recommendations: Record<LLMProvider, Record<string, string>> = {
    claude: {
      'code-generation': 'claude-3-5-sonnet-20241022', // Best for code
      'reasoning': 'claude-3-5-sonnet-20241022', // Best reasoning
      'fast': 'claude-3-5-haiku-20241022', // Fast and cheap
    },
    openai: {
      'code-generation': 'gpt-4o',
      'reasoning': 'gpt-4o',
      'fast': 'gpt-4o-mini',
    },
    ollama: {
      'code-generation': 'deepseek-r1:14b',
      'reasoning': 'qwen3:32b',
      'fast': 'deepseek-r1:8b',
    },
  };

  return {
    provider,
    model: recommendations[provider][task],
  };
}
