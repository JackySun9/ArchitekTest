/**
 * Test Architect AI Configuration
 * Copy this file to config.ts and customize for your environment
 * 
 * Based on your available models analysis - optimized for your system!
 */

export const CONFIG = {
  // Ollama Configuration
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    
    // Model Selection - YOUR BEST AVAILABLE MODELS
    // Based on testing: DeepSeek-R1:14b produces excellent test scenarios
    model: process.env.OLLAMA_MODEL || 'deepseek-r1:14b', // RECOMMENDED: Best tested quality
    
    // YOUR AVAILABLE MODELS (analyzed and ranked):
    availableModels: {
      // 🏆 BEST QUALITY - TESTED AND PROVEN
      'deepseek-r1:14b': { 
        size: '9.0GB', 
        quality: 'excellent', 
        speed: 'good',
        status: '✅ TESTED - BEST CHOICE',
        speciality: 'Reasoning and code generation'
      },
      
      // 🥈 GOOD BACKUP OPTIONS
      'deepseek-r1:8b': { 
        size: '5.2GB', 
        quality: 'very-good', 
        speed: 'fast',
        status: '✅ Available - Good for fast iteration',
        speciality: 'Lightweight reasoning'
      },
      
      // 🥉 UNTESTED BUT PROMISING
      'qwen3:32b': { 
        size: '20GB', 
        quality: 'likely-excellent', 
        speed: 'slow',
        status: '❓ Untested - Worth trying if you have RAM',
        speciality: 'General reasoning'
      },
      
      'devstral:24b': { 
        size: '14GB', 
        quality: 'very-good', 
        speed: 'medium',
        status: '❓ Untested - Good for code generation',
        speciality: 'Code and development tasks'
      },
      
      'gpt-oss:20b': { 
        size: '13GB', 
        quality: 'good', 
        speed: 'medium',
        status: '❓ Untested - General purpose',
        speciality: 'General language tasks'
      },
      
      // ⚠️ RESOURCE INTENSIVE
      'llama3.3:70b': { 
        size: '42GB', 
        quality: 'would-be-excellent', 
        speed: 'very-slow',
        status: '❌ Crashes - Too resource heavy',
        speciality: 'Best quality but needs massive RAM'
      },
      
      'qwen2.5vl:32b': { 
        size: '21GB', 
        quality: 'unknown', 
        speed: 'slow',
        status: '❓ Vision model - Not for text generation',
        speciality: 'Vision and language'
      },
      
      // 👎 AVOID
      'gemma3:27b': { 
        size: '17GB', 
        quality: 'poor', 
        speed: 'medium',
        status: '❌ TESTED - Poor quality scenarios',
        speciality: 'General (but weak reasoning)'
      }
    }
  },

  // Vector Store Configuration
  vectorStore: {
    path: process.env.VECTOR_STORE_PATH || './vector-store',
    embeddingsModel: process.env.EMBEDDINGS_MODEL || 'nomic-embed-text',
  },

  // Performance Settings
  performance: {
    maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '3'),
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    pageAnalysisTimeout: 30000,
    networkIdleTimeout: 5000,
  },

  // Test Generation Settings - Optimized for your models
  testGeneration: {
    maxScenariosPerCategory: 3, // DeepSeek-R1:14b can handle more complex scenarios
    maxElementsToAnalyze: 25, // Increased for better UI understanding
    maxMethodsPerPageObject: 20, // More methods for comprehensive page objects
    includePerformanceTests: true,
    includeAccessibilityTests: true,
    includeSecurityTests: true,
    
    // Model-specific optimizations
    modelOptimizations: {
      'deepseek-r1:14b': {
        complexScenarios: true, // Can handle complex test logic
        detailedSteps: true, // Generates detailed step descriptions
        realisticData: true // Uses realistic test data
      },
      'deepseek-r1:8b': {
        complexScenarios: true,
        detailedSteps: true,
        realisticData: true
      },
      'gemma3:27b': {
        complexScenarios: false, // Keep it simple for weaker models
        detailedSteps: false,
        realisticData: false
      }
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableDebug: process.env.DEBUG === 'true',
  }
};

/**
 * YOUR MODEL QUALITY ANALYSIS (Based on Testing):
 * 
 * 🏆 PROVEN EXCELLENT (Tested):
 * - deepseek-r1:14b: Generated 12 high-quality scenarios with realistic steps
 * - deepseek-r1:8b: Good backup, faster execution
 * 
 * 🥈 LIKELY EXCELLENT (Untested):
 * - qwen3:32b: Should be very good based on model architecture
 * - devstral:24b: Specialized for code, should excel at Playwright generation
 * 
 * ⚠️ RESOURCE ISSUES:
 * - llama3.3:70b: Would be best quality but crashes on your system
 * 
 * 👎 AVOID:
 * - gemma3:27b: TESTED - Produces poor, generic scenarios
 */

// USAGE EXAMPLES FOR YOUR SYSTEM:

/**
 * 🚀 QUICK START:
 * 
 * 1. Copy this file to config.ts:
 *    cp config.example.ts config.ts
 * 
 * 2. Use your best model:
 *    export OLLAMA_MODEL=deepseek-r1:14b
 * 
 * 3. Generate tests:
 *    npm run start -- generate --feature "login" --team "auth" --requirements "test user authentication"
 */

/**
 * 🔄 MODEL SWITCHING:
 * 
 * For different scenarios:
 * - Fast iteration: export OLLAMA_MODEL=deepseek-r1:8b
 * - Best quality: export OLLAMA_MODEL=deepseek-r1:14b
 * - Code focus: export OLLAMA_MODEL=devstral:24b
 * - Experimental: export OLLAMA_MODEL=qwen3:32b
 */

/**
 * 🎯 PERFORMANCE TIPS:
 * 
 * If models are slow:
 * export OLLAMA_NUM_PARALLEL=2
 * export OLLAMA_MAX_LOADED_MODELS=1
 * export OLLAMA_FLASH_ATTENTION=1
 */