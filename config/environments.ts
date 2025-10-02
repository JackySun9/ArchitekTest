/**
 * Centralized Environment Configuration
 * 
 * Define all team environments here. Each team can have different URLs
 * for dev, stage, and prod environments.
 * 
 * Usage:
 *   import { ENVIRONMENTS } from './environments';
 *   const url = ENVIRONMENTS.adobe.dev.baseURL;
 */

export interface TeamEnvironment {
  baseURL: string;
  apiURL?: string;
  wsURL?: string;  // WebSocket URL if needed
}

export interface Environments {
  dev: TeamEnvironment;
  stage: TeamEnvironment;
  prod: TeamEnvironment;
}

/**
 * All team environments
 * 
 * Add new teams here as needed. Each team is independent.
 */
export const ENVIRONMENTS: Record<string, Environments> = {
  // Adobe Team
  adobe: {
    dev: {
      baseURL: 'https://dev.adobe.com',
      apiURL: 'https://api-dev.adobe.com',
    },
    stage: {
      baseURL: 'https://stage.adobe.com',
      apiURL: 'https://api-stage.adobe.com',
    },
    prod: {
      baseURL: 'https://www.adobe.com',
      apiURL: 'https://api.adobe.com',
    },
  },

  // Search Team
  search: {
    dev: {
      baseURL: 'https://dev-search.example.com',
      apiURL: 'https://search-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://stage-search.example.com',
      apiURL: 'https://search-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://search.example.com',
      apiURL: 'https://search-api.example.com',
    },
  },

  // Auth Team
  auth: {
    dev: {
      baseURL: 'https://auth-dev.example.com',
      apiURL: 'https://auth-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://auth-stage.example.com',
      apiURL: 'https://auth-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://auth.example.com',
      apiURL: 'https://auth-api.example.com',
    },
  },

  // AI Team
  ai: {
    dev: {
      baseURL: 'https://ai-dev.example.com',
      apiURL: 'https://ai-api-dev.example.com',
      wsURL: 'wss://ai-ws-dev.example.com',
    },
    stage: {
      baseURL: 'https://ai-stage.example.com',
      apiURL: 'https://ai-api-stage.example.com',
      wsURL: 'wss://ai-ws-stage.example.com',
    },
    prod: {
      baseURL: 'https://ai.example.com',
      apiURL: 'https://ai-api.example.com',
      wsURL: 'wss://ai-ws.example.com',
    },
  },

  // Test Team (for meta-testing)
  test: {
    dev: {
      baseURL: 'http://localhost:3000',
      apiURL: 'http://localhost:3001',
    },
    stage: {
      baseURL: 'https://test-stage.example.com',
      apiURL: 'https://test-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://test.example.com',
      apiURL: 'https://test-api.example.com',
    },
  },

  // ========================================
  // Add more teams below as needed
  // ========================================

  // Payment Team (example)
  payment: {
    dev: {
      baseURL: 'https://payment-dev.example.com',
      apiURL: 'https://payment-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://payment-stage.example.com',
      apiURL: 'https://payment-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://payment.example.com',
      apiURL: 'https://payment-api.example.com',
    },
  },

  // Analytics Team (example)
  analytics: {
    dev: {
      baseURL: 'https://analytics-dev.example.com',
      apiURL: 'https://analytics-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://analytics-stage.example.com',
      apiURL: 'https://analytics-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://analytics.example.com',
      apiURL: 'https://analytics-api.example.com',
    },
  },

  // Notification Team (example)
  notification: {
    dev: {
      baseURL: 'https://notify-dev.example.com',
      apiURL: 'https://notify-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://notify-stage.example.com',
      apiURL: 'https://notify-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://notify.example.com',
      apiURL: 'https://notify-api.example.com',
    },
  },

  // Messaging Team (example)
  messaging: {
    dev: {
      baseURL: 'https://msg-dev.example.com',
      apiURL: 'https://msg-api-dev.example.com',
      wsURL: 'wss://msg-ws-dev.example.com',
    },
    stage: {
      baseURL: 'https://msg-stage.example.com',
      apiURL: 'https://msg-api-stage.example.com',
      wsURL: 'wss://msg-ws-stage.example.com',
    },
    prod: {
      baseURL: 'https://msg.example.com',
      apiURL: 'https://msg-api.example.com',
      wsURL: 'wss://msg-ws.example.com',
    },
  },

  // Profile Team (example)
  profile: {
    dev: {
      baseURL: 'https://profile-dev.example.com',
      apiURL: 'https://profile-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://profile-stage.example.com',
      apiURL: 'https://profile-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://profile.example.com',
      apiURL: 'https://profile-api.example.com',
    },
  },

  // Settings Team (example)
  settings: {
    dev: {
      baseURL: 'https://settings-dev.example.com',
      apiURL: 'https://settings-api-dev.example.com',
    },
    stage: {
      baseURL: 'https://settings-stage.example.com',
      apiURL: 'https://settings-api-stage.example.com',
    },
    prod: {
      baseURL: 'https://settings.example.com',
      apiURL: 'https://settings-api.example.com',
    },
  },
};

/**
 * Helper function to get environment for a specific team
 */
export function getTeamEnvironment(
  team: string,
  env: 'dev' | 'stage' | 'prod' = 'dev'
): TeamEnvironment {
  const teamEnv = ENVIRONMENTS[team];
  
  if (!teamEnv) {
    console.warn(`⚠️  Team "${team}" not found in environments. Using default.`);
    return {
      baseURL: 'http://localhost:3000',
      apiURL: 'http://localhost:3001',
    };
  }

  return teamEnv[env];
}

/**
 * Get list of all configured teams
 */
export function getAllTeams(): string[] {
  return Object.keys(ENVIRONMENTS);
}

/**
 * Validate that all teams have required environment configs
 */
export function validateEnvironments(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const envs: ('dev' | 'stage' | 'prod')[] = ['dev', 'stage', 'prod'];

  for (const [team, config] of Object.entries(ENVIRONMENTS)) {
    for (const env of envs) {
      const envConfig = config[env];
      
      if (!envConfig) {
        errors.push(`Missing ${env} environment for team: ${team}`);
        continue;
      }

      if (!envConfig.baseURL) {
        errors.push(`Missing baseURL for ${team}.${env}`);
      }

      // Validate URL format
      try {
        new URL(envConfig.baseURL);
      } catch {
        errors.push(`Invalid baseURL for ${team}.${env}: ${envConfig.baseURL}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

