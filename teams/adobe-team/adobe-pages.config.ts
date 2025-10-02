/**
 * Adobe Team - Pages Configuration Class
 * 
 * OPTION 2: Advanced approach with a dedicated Pages class
 * This provides type safety, environment awareness, and easy URL building
 * 
 * Usage:
 *   const pages = new AdobePages('stage');
 *   const url = pages.brandConcierge();
 *   const urlWithParams = pages.brandConcierge({ locale: 'en_US' });
 */

import { ENVIRONMENTS } from '../../config/environments';

export interface PageOptions {
  params?: Record<string, string>;
  hash?: string;
}

/**
 * Adobe Pages Configuration Class
 * 
 * Provides centralized URL management with environment support
 */
export class AdobePages {
  private env: 'dev' | 'stage' | 'prod';
  private baseURL: string;

  constructor(env: 'dev' | 'stage' | 'prod' = 'stage') {
    this.env = env;
    this.baseURL = ENVIRONMENTS.adobe[env].baseURL;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Build a complete URL with optional query params and hash
   */
  private buildURL(path: string, options?: PageOptions): string {
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${cleanBaseURL}${cleanPath}`;

    // Add query parameters
    if (options?.params && Object.keys(options.params).length > 0) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    // Add hash
    if (options?.hash) {
      url += `#${options.hash}`;
    }

    return url;
  }

  /**
   * Get current environment
   */
  getEnvironment(): 'dev' | 'stage' | 'prod' {
    return this.env;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  // ============================================================================
  // PAGE URLS
  // ============================================================================

  /**
   * Home page
   */
  home(options?: PageOptions): string {
    return this.buildURL('/', options);
  }

  /**
   * Brand Concierge page
   */
  brandConcierge(options?: PageOptions): string {
    return this.buildURL('/cc-shared/fragments/uar/brand-concierge/brand-concierge', options);
  }

  /**
   * Creativity & Design page
   */
  creativityDesign(options?: PageOptions): string {
    return this.buildURL('/products/creativity-design', options);
  }

  /**
   * PDF & E-Signatures page
   */
  pdfSignatures(options?: PageOptions): string {
    return this.buildURL('/products/pdf-signatures', options);
  }

  /**
   * Login page
   */
  login(options?: PageOptions): string {
    return this.buildURL('/auth/login', options);
  }

  /**
   * Logout page
   */
  logout(options?: PageOptions): string {
    return this.buildURL('/auth/logout', options);
  }

  /**
   * Profile page
   */
  profile(options?: PageOptions): string {
    return this.buildURL('/profile', options);
  }

  /**
   * Settings page
   */
  settings(options?: PageOptions): string {
    return this.buildURL('/settings', options);
  }

  // ============================================================================
  // API ENDPOINTS
  // ============================================================================

  /**
   * Get API base URL
   */
  getAPIBaseURL(): string {
    return ENVIRONMENTS.adobe[this.env].apiURL || this.baseURL;
  }

  /**
   * Brand Concierge API endpoint
   */
  apiBrandConcierge(options?: PageOptions): string {
    const apiBase = this.getAPIBaseURL();
    const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const path = '/v1/brand-concierge';
    let url = `${cleanBase}${path}`;

    if (options?.params) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Analytics API endpoint
   */
  apiAnalytics(options?: PageOptions): string {
    const apiBase = this.getAPIBaseURL();
    const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    const path = '/v1/analytics';
    let url = `${cleanBase}${path}`;

    if (options?.params) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  // ============================================================================
  // ENVIRONMENT-SPECIFIC OVERRIDES
  // ============================================================================

  /**
   * Get product page (different paths per environment)
   */
  product(productId: string, options?: PageOptions): string {
    // Dev environment might use different structure
    if (this.env === 'dev') {
      return this.buildURL(`/dev/products/${productId}`, options);
    }
    
    // Stage and prod use standard structure
    return this.buildURL(`/products/${productId}`, options);
  }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Create a Pages instance for a specific environment
 */
export function createAdobePages(env: 'dev' | 'stage' | 'prod' = 'stage'): AdobePages {
  return new AdobePages(env);
}

/**
 * Get environment from process.env or default to 'stage'
 */
export function getEnvironment(): 'dev' | 'stage' | 'prod' {
  const env = process.env.TEST_ENV || process.env.NODE_ENV || 'stage';
  
  if (env === 'development') return 'dev';
  if (env === 'production') return 'prod';
  if (['dev', 'stage', 'prod'].includes(env)) {
    return env as 'dev' | 'stage' | 'prod';
  }
  
  return 'stage';
}

/**
 * Default pages instance (uses environment from process.env)
 */
export const adobePages = new AdobePages(getEnvironment());

