/**
 * Team-Specific Environment Configuration
 * 
 * Each team can have different:
 * - Base URLs per environment
 * - Authentication endpoints
 * - API endpoints
 * - Test data
 * - Custom settings
 */

export interface TeamEnvironment {
  name: string;
  baseURL: string;
  authURL?: string;
  apiURL?: string;
  timeout?: number;
  customSettings?: Record<string, any>;
}

export interface TeamConfig {
  dev: TeamEnvironment;
  stage: TeamEnvironment;
  prod: TeamEnvironment;
}

// ============================================================================
// ADOBE TEAM CONFIGURATION
// ============================================================================
export const ADOBE_TEAM: TeamConfig = {
  dev: {
    name: 'Adobe Dev',
    baseURL: 'https://dev.adobe.com',
    authURL: 'https://dev-auth.adobe.com',
    apiURL: 'https://dev-api.adobe.com',
    timeout: 30000,
    customSettings: {
      enableBetaFeatures: true,
      skipOnboarding: true
    }
  },
  stage: {
    name: 'Adobe Stage',
    baseURL: 'https://www.stage.adobe.com',
    authURL: 'https://stage-auth.adobe.com',
    apiURL: 'https://stage-api.adobe.com',
    timeout: 30000,
    customSettings: {
      enableBetaFeatures: true,
      skipOnboarding: false
    }
  },
  prod: {
    name: 'Adobe Production',
    baseURL: 'https://www.adobe.com',
    authURL: 'https://auth.adobe.com',
    apiURL: 'https://api.adobe.com',
    timeout: 30000,
    customSettings: {
      enableBetaFeatures: false,
      skipOnboarding: false
    }
  }
};

// ============================================================================
// SEARCH TEAM CONFIGURATION
// ============================================================================
export const SEARCH_TEAM: TeamConfig = {
  dev: {
    name: 'Search Dev',
    baseURL: 'https://dev-search.example.com',
    apiURL: 'https://dev-search-api.example.com',
    timeout: 20000
  },
  stage: {
    name: 'Search Stage',
    baseURL: 'https://stage-search.example.com',
    apiURL: 'https://stage-search-api.example.com',
    timeout: 20000
  },
  prod: {
    name: 'Search Production',
    baseURL: 'https://search.example.com',
    apiURL: 'https://search-api.example.com',
    timeout: 20000
  }
};

// ============================================================================
// AUTH TEAM CONFIGURATION
// ============================================================================
export const AUTH_TEAM: TeamConfig = {
  dev: {
    name: 'Auth Dev',
    baseURL: 'https://dev-auth.example.com',
    apiURL: 'https://dev-auth-api.example.com',
    timeout: 15000,
    customSettings: {
      allowTestAccounts: true,
      skipMFA: true
    }
  },
  stage: {
    name: 'Auth Stage',
    baseURL: 'https://stage-auth.example.com',
    apiURL: 'https://stage-auth-api.example.com',
    timeout: 15000,
    customSettings: {
      allowTestAccounts: true,
      skipMFA: false
    }
  },
  prod: {
    name: 'Auth Production',
    baseURL: 'https://auth.example.com',
    apiURL: 'https://auth-api.example.com',
    timeout: 15000,
    customSettings: {
      allowTestAccounts: false,
      skipMFA: false
    }
  }
};

// ============================================================================
// AI TEAM CONFIGURATION
// ============================================================================
export const AI_TEAM: TeamConfig = {
  dev: {
    name: 'AI Dev',
    baseURL: 'https://dev-ai.example.com',
    apiURL: 'https://dev-ai-api.example.com',
    timeout: 60000, // AI responses can be slower
    customSettings: {
      modelVersion: 'gpt-4',
      maxTokens: 2000
    }
  },
  stage: {
    name: 'AI Stage',
    baseURL: 'https://stage-ai.example.com',
    apiURL: 'https://stage-ai-api.example.com',
    timeout: 60000,
    customSettings: {
      modelVersion: 'gpt-4',
      maxTokens: 2000
    }
  },
  prod: {
    name: 'AI Production',
    baseURL: 'https://ai.example.com',
    apiURL: 'https://ai-api.example.com',
    timeout: 60000,
    customSettings: {
      modelVersion: 'gpt-4',
      maxTokens: 2000
    }
  }
};

// ============================================================================
// TEST TEAM CONFIGURATION
// ============================================================================
export const TEST_TEAM: TeamConfig = {
  dev: {
    name: 'Test Dev',
    baseURL: 'https://dev.example.com',
    apiURL: 'https://dev-api.example.com',
    timeout: 30000
  },
  stage: {
    name: 'Test Stage',
    baseURL: 'https://stage.example.com',
    apiURL: 'https://stage-api.example.com',
    timeout: 30000
  },
  prod: {
    name: 'Test Production',
    baseURL: 'https://example.com',
    apiURL: 'https://api.example.com',
    timeout: 30000
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get environment configuration for a team
 */
export function getTeamEnvironment(team: string, env: string = 'stage'): TeamEnvironment {
  const teamConfigs: Record<string, TeamConfig> = {
    adobe: ADOBE_TEAM,
    search: SEARCH_TEAM,
    auth: AUTH_TEAM,
    ai: AI_TEAM,
    test: TEST_TEAM
  };

  const teamConfig = teamConfigs[team.toLowerCase()];
  if (!teamConfig) {
    throw new Error(`Unknown team: ${team}. Available teams: ${Object.keys(teamConfigs).join(', ')}`);
  }

  const envConfig = teamConfig[env as keyof TeamConfig];
  if (!envConfig) {
    throw new Error(`Unknown environment: ${env}. Available environments: dev, stage, prod`);
  }

  return envConfig;
}

/**
 * Get base URL for a team and environment
 */
export function getBaseURL(team: string, env: string = 'stage'): string {
  return getTeamEnvironment(team, env).baseURL;
}

/**
 * Get API URL for a team and environment
 */
export function getAPIURL(team: string, env: string = 'stage'): string {
  const envConfig = getTeamEnvironment(team, env);
  return envConfig.apiURL || envConfig.baseURL;
}

