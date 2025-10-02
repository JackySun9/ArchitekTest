/**
 * Adobe Team - Page URLs Configuration
 * 
 * Define all page paths/URLs for Adobe team here.
 * These will be combined with baseURL from environments.ts
 * 
 * Usage:
 *   const url = `${baseURL}${ADOBE_PAGES.brandConcierge}`;
 */

export interface PageUrls {
  // Main pages
  home: string;
  brandConcierge: string;
  creativityDesign: string;
  pdfSignatures: string;
  
  // Authentication pages
  login: string;
  logout: string;
  
  // Settings pages
  profile: string;
  settings: string;
  
  // API endpoints (if needed)
  api?: {
    brandConcierge: string;
    analytics: string;
  };
}

/**
 * Adobe Team Page URLs
 * 
 * Use relative paths that will be combined with baseURL from environments
 */
export const ADOBE_PAGES: PageUrls = {
  // Main pages
  home: '/',
  brandConcierge: '/cc-shared/fragments/uar/brand-concierge/brand-concierge',
  creativityDesign: '/products/creativity-design',
  pdfSignatures: '/products/pdf-signatures',
  
  // Authentication pages
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Settings pages
  profile: '/profile',
  settings: '/settings',
  
  // API endpoints
  api: {
    brandConcierge: '/api/v1/brand-concierge',
    analytics: '/api/v1/analytics',
  },
};

/**
 * Helper function to get full URL for a page
 * 
 * @param baseURL - Base URL from environment config
 * @param pagePath - Page path from ADOBE_PAGES
 * @returns Full URL
 */
export function getPageURL(baseURL: string, pagePath: string): string {
  // Remove trailing slash from baseURL if present
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  
  // Ensure pagePath starts with /
  const cleanPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
  
  return `${cleanBaseURL}${cleanPath}`;
}

/**
 * Helper function to build URL with query params
 */
export function buildURL(baseURL: string, pagePath: string, params?: Record<string, string>): string {
  const url = getPageURL(baseURL, pagePath);
  
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${url}?${queryString}`;
}

/**
 * Environment-specific overrides (if needed)
 * 
 * Some pages might have different paths in different environments
 */
export const ADOBE_PAGES_OVERRIDES = {
  dev: {
    // In dev, brand concierge might be on a different path
    brandConcierge: '/dev/brand-concierge',
  },
  stage: {
    // Use default paths from ADOBE_PAGES
  },
  prod: {
    // Use default paths from ADOBE_PAGES
  },
};

/**
 * Get page URLs with environment-specific overrides
 */
export function getAdobePages(env: 'dev' | 'stage' | 'prod' = 'stage'): PageUrls {
  const overrides = ADOBE_PAGES_OVERRIDES[env];
  return {
    ...ADOBE_PAGES,
    ...overrides,
  };
}

