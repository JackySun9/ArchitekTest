/**
 * Global Adobe Test Data
 * 
 * Shared test data used across multiple Adobe team tests:
 * - Navigation items
 * - Header/Footer data
 * - User accounts
 * - Common URLs
 * - Shared UI elements
 */

/**
 * Navigation Items - Global Adobe Header
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'nav-creativity',
    text: 'Creativity & Design',
    url: '/products/creativity-design',
    category: 'products',
  },
  {
    id: 'nav-pdf',
    text: 'PDF & E-Signatures',
    url: '/products/pdf-signatures',
    category: 'products',
  },
  {
    id: 'nav-marketing',
    text: 'Marketing & Commerce',
    url: '/products/marketing-commerce',
    category: 'products',
  },
  {
    id: 'nav-help',
    text: 'Help & Support',
    url: '/support',
    category: 'support',
  },
];

/**
 * Footer Links - Global Adobe Footer
 */
export const FOOTER_LINKS = {
  products: [
    { text: 'Photoshop', url: '/products/photoshop' },
    { text: 'Illustrator', url: '/products/illustrator' },
    { text: 'InDesign', url: '/products/indesign' },
    { text: 'Premiere Pro', url: '/products/premiere' },
    { text: 'Acrobat', url: '/products/acrobat' },
  ],
  
  company: [
    { text: 'About Adobe', url: '/about' },
    { text: 'Careers', url: '/careers' },
    { text: 'Newsroom', url: '/news' },
    { text: 'Corporate Responsibility', url: '/corporate-responsibility' },
    { text: 'Investor Relations', url: '/investor-relations' },
  ],
  
  support: [
    { text: 'Support Home', url: '/support' },
    { text: 'Contact Us', url: '/support/contact' },
    { text: 'Download & Install', url: '/support/download-install' },
    { text: 'Community Forums', url: '/support/forums' },
  ],
  
  legal: [
    { text: 'Privacy', url: '/privacy' },
    { text: 'Terms of Use', url: '/terms' },
    { text: 'Cookie Preferences', url: '/cookies' },
    { text: 'Do Not Sell My Info', url: '/privacy/opt-out' },
  ],
  
  social: [
    { name: 'Facebook', url: 'https://facebook.com/adobe', icon: 'facebook' },
    { name: 'Twitter', url: 'https://twitter.com/adobe', icon: 'twitter' },
    { name: 'Instagram', url: 'https://instagram.com/adobe', icon: 'instagram' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/adobe', icon: 'linkedin' },
  ],
};

/**
 * Test User Accounts
 */
export const TEST_USERS = {
  standard: {
    email: 'test.user@adobe.com',
    password: 'TestPassword123!',
    role: 'standard',
    permissions: ['view', 'edit'],
  },
  
  admin: {
    email: 'admin.user@adobe.com',
    password: 'AdminPassword123!',
    role: 'admin',
    permissions: ['view', 'edit', 'delete', 'admin'],
  },
  
  readonly: {
    email: 'readonly.user@adobe.com',
    password: 'ReadonlyPassword123!',
    role: 'readonly',
    permissions: ['view'],
  },
  
  // Invalid user for negative testing
  invalid: {
    email: 'invalid@example.com',
    password: 'WrongPassword',
    role: 'none',
    permissions: [],
  },
};

/**
 * Common URLs
 */
export const COMMON_URLS = {
  // Main pages
  home: '/',
  products: '/products',
  pricing: '/pricing',
  support: '/support',
  
  // Authentication
  login: '/auth/login',
  logout: '/auth/logout',
  signup: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  
  // Account
  profile: '/account/profile',
  settings: '/account/settings',
  billing: '/account/billing',
  
  // Legal
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  
  // Help
  helpCenter: '/help',
  contactUs: '/contact',
  faq: '/faq',
};

/**
 * Common UI Elements
 */
export const COMMON_UI_ELEMENTS = {
  buttons: {
    primary: 'button[class*="primary"]',
    secondary: 'button[class*="secondary"]',
    close: 'button[aria-label="Close"]',
    submit: 'button[type="submit"]',
  },
  
  forms: {
    input: 'input[type="text"]',
    email: 'input[type="email"]',
    password: 'input[type="password"]',
    checkbox: 'input[type="checkbox"]',
    radio: 'input[type="radio"]',
    textarea: 'textarea',
  },
  
  navigation: {
    header: 'header',
    nav: 'nav',
    footer: 'footer',
    breadcrumb: '[aria-label="Breadcrumb"]',
    menu: '[role="menu"]',
  },
  
  feedback: {
    success: '[role="alert"][class*="success"]',
    error: '[role="alert"][class*="error"]',
    warning: '[role="alert"][class*="warning"]',
    info: '[role="alert"][class*="info"]',
  },
};

/**
 * Common Messages
 */
export const COMMON_MESSAGES = {
  success: {
    saved: 'Changes saved successfully',
    deleted: 'Deleted successfully',
    created: 'Created successfully',
    updated: 'Updated successfully',
  },
  
  errors: {
    required: 'This field is required',
    invalid: 'Invalid input',
    network: 'Network error. Please try again.',
    server: 'Server error. Please try again later.',
    unauthorized: 'You are not authorized to perform this action',
    notFound: 'Page not found',
  },
  
  warnings: {
    unsavedChanges: 'You have unsaved changes',
    sessionExpiring: 'Your session is about to expire',
  },
};

/**
 * Regular Expressions for Validation
 */
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
};

/**
 * Locales - For internationalization testing
 */
export const LOCALES = {
  'en_US': { name: 'English (US)', direction: 'ltr' },
  'en_GB': { name: 'English (UK)', direction: 'ltr' },
  'es_ES': { name: 'Spanish (Spain)', direction: 'ltr' },
  'fr_FR': { name: 'French (France)', direction: 'ltr' },
  'de_DE': { name: 'German (Germany)', direction: 'ltr' },
  'ja_JP': { name: 'Japanese (Japan)', direction: 'ltr' },
  'zh_CN': { name: 'Chinese (Simplified)', direction: 'ltr' },
  'ar_SA': { name: 'Arabic (Saudi Arabia)', direction: 'rtl' },
};

