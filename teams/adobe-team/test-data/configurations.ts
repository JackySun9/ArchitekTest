/**
 * Test Configurations
 * 
 * Centralized configuration for:
 * - Viewports (devices)
 * - Performance thresholds
 * - Accessibility requirements
 * - Browser configurations
 * - Environment settings
 */

/**
 * Viewport Configurations - Device sizes
 */
export const VIEWPORTS = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
    deviceType: 'mobile',
  },
  mobileLarge: {
    width: 414,
    height: 896,
    name: 'iPhone 11 Pro Max',
    deviceType: 'mobile',
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
    deviceType: 'tablet',
  },
  tabletLarge: {
    width: 1024,
    height: 1366,
    name: 'iPad Pro',
    deviceType: 'tablet',
  },
  desktop: {
    width: 1920,
    height: 1080,
    name: 'Desktop HD',
    deviceType: 'desktop',
  },
  desktopLarge: {
    width: 2560,
    height: 1440,
    name: 'Desktop 2K',
    deviceType: 'desktop',
  },
  ultrawide: {
    width: 3440,
    height: 1440,
    name: 'Ultrawide Monitor',
    deviceType: 'desktop',
  },
};

/**
 * Performance Thresholds - Web Vitals & Custom Metrics
 */
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  webVitals: {
    FCP: 1800,   // First Contentful Paint - 1.8s (good)
    LCP: 2500,   // Largest Contentful Paint - 2.5s (good)
    FID: 100,    // First Input Delay - 100ms (good)
    CLS: 0.1,    // Cumulative Layout Shift - 0.1 (good)
    TTI: 3800,   // Time to Interactive - 3.8s (good)
    TTFB: 600,   // Time to First Byte - 600ms (good)
  },

  // Page Load Metrics
  loading: {
    pageLoadTime: 3000,        // 3 seconds max
    domContentLoaded: 2000,    // 2 seconds max
    networkIdle: 5000,         // 5 seconds max
  },

  // Resource Metrics
  resources: {
    totalPageWeight: 2048,     // 2MB max (in KB)
    imageSize: 500,            // 500KB max per image
    jsSize: 500,               // 500KB max for JS bundles
    cssSize: 100,              // 100KB max for CSS
    fontSize: 200,             // 200KB max for fonts
  },

  // Network Metrics
  network: {
    maxRequests: 50,           // Max HTTP requests
    maxDomainLookups: 10,      // Max DNS lookups
    maxRedirects: 2,           // Max redirects
  },

  // Application-Specific
  application: {
    chatResponseTime: 10000,   // 10 seconds max for AI response
    searchTime: 2000,          // 2 seconds max for search
    filterTime: 500,           // 500ms max for filtering
    imageLoadTime: 2000,       // 2 seconds max for images
  },
};

/**
 * Accessibility Requirements - WCAG 2.1 Level AA
 */
export const ACCESSIBILITY_REQUIREMENTS = {
  // WCAG Guidelines
  wcag: {
    level: 'AA',
    version: '2.1',
  },

  // Color Contrast
  contrast: {
    normalText: 4.5,           // 4.5:1 for normal text
    largeText: 3.0,            // 3:1 for large text (18pt+)
    uiComponents: 3.0,         // 3:1 for UI components
  },

  // Keyboard Navigation
  keyboard: {
    maxTabStops: 50,           // Max tab stops per page
    minFocusIndicatorSize: 2,  // 2px minimum focus indicator
    tabOrderLogical: true,     // Tab order should be logical
  },

  // ARIA Requirements
  aria: {
    requiredLandmarks: ['navigation', 'main', 'contentinfo', 'banner'],
    requiredRoles: ['button', 'link', 'textbox'],
    requiredLabels: true,      // All interactive elements need labels
  },

  // Touch Targets (Mobile)
  touchTargets: {
    minWidth: 44,              // 44px minimum width
    minHeight: 44,             // 44px minimum height
    minSpacing: 8,             // 8px minimum spacing between targets
  },

  // Screen Readers
  screenReaders: [
    'NVDA',
    'JAWS',
    'VoiceOver',
    'TalkBack',
    'Narrator',
  ],

  // Text Requirements
  text: {
    minFontSize: 12,           // 12px minimum font size
    maxLineLength: 80,         // 80 characters max per line
    minLineHeight: 1.5,        // 1.5 line height minimum
  },
};

/**
 * Browser Configurations
 */
export const BROWSERS = {
  chrome: {
    name: 'Google Chrome',
    version: '120+',
    engine: 'Chromium',
    marketShare: 65,
  },
  firefox: {
    name: 'Mozilla Firefox',
    version: '119+',
    engine: 'Gecko',
    marketShare: 10,
  },
  safari: {
    name: 'Safari',
    version: '17+',
    engine: 'WebKit',
    marketShare: 20,
  },
  edge: {
    name: 'Microsoft Edge',
    version: '120+',
    engine: 'Chromium',
    marketShare: 5,
  },
};

/**
 * Security Requirements
 */
export const SECURITY_REQUIREMENTS = {
  https: true,                 // Must use HTTPS
  headers: {
    contentSecurityPolicy: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    strictTransportSecurity: true,
  },
  cookies: {
    secure: true,              // Secure flag required
    httpOnly: true,            // HttpOnly flag required
    sameSite: 'Lax',          // SameSite attribute required
  },
};

/**
 * Test Timeouts
 */
export const TIMEOUTS = {
  test: 30000,                 // 30 seconds per test
  action: 15000,               // 15 seconds per action
  navigation: 30000,           // 30 seconds for navigation
  expect: 5000,                // 5 seconds for assertions
  
  // Specific actions
  chatResponse: 10000,         // 10 seconds for chat
  fileUpload: 30000,           // 30 seconds for upload
  download: 60000,             // 60 seconds for download
};

/**
 * Retry Configuration
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,            // 1 second between retries
  exponentialBackoff: true,
};

/**
 * Test Data Limits
 */
export const DATA_LIMITS = {
  maxInputLength: 1000,        // Max characters in input
  maxFileSize: 10485760,       // 10MB max file size
  maxImagesPerPage: 20,        // Max images to test
};

/**
 * Environment-Specific Settings
 */
export const ENVIRONMENT_SETTINGS = {
  dev: {
    debugMode: true,
    verboseLogging: true,
    screenshotsOnFailure: true,
    videoRecording: true,
  },
  stage: {
    debugMode: false,
    verboseLogging: false,
    screenshotsOnFailure: true,
    videoRecording: true,
  },
  prod: {
    debugMode: false,
    verboseLogging: false,
    screenshotsOnFailure: true,
    videoRecording: false,
  },
};

