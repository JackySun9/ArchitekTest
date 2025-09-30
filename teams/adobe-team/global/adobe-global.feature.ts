/**
 * Adobe Global Components - Feature Definitions
 * 
 * SCOPE: Test scenarios for global header and footer components
 * These components appear across ALL Adobe pages and should be tested once
 * 
 * DO NOT duplicate these tests in page-specific test suites
 */

export interface GlobalTestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  component: 'header' | 'footer';
  steps: string[];
  expectedResults: string[];
  testData?: any;
}

export const ADOBE_GLOBAL_SCENARIOS: GlobalTestScenario[] = [
  // Global Header Scenarios
  {
    id: 'GH001',
    description: 'Verify Adobe global navigation header is present',
    priority: 'high',
    category: 'functional',
    component: 'header',
    steps: [
      'Navigate to any Adobe page',
      'Verify global navigation header exists',
      'Verify navigation has interactive elements'
    ],
    expectedResults: [
      'Global navigation header is visible',
      'Header contains navigation links/buttons',
      'Header is properly positioned at top of page'
    ]
  },

  {
    id: 'GH002',
    description: 'Verify main navigation menu items',
    priority: 'high',
    category: 'functional',
    component: 'header',
    steps: [
      'Locate main navigation menu',
      'Check for primary navigation items',
      'Verify navigation items are clickable',
      'Test dropdown menus if present'
    ],
    expectedResults: [
      'Primary navigation items are visible',
      'Navigation items include: Creativity & Design, PDF, Marketing, Support',
      'All navigation items are interactive',
      'Dropdown menus work properly'
    ],
    testData: {
      navigationItems: [
        'Creativity & Design',
        'PDF & E-signatures',
        'Marketing & Commerce',
        'Learn & Support'
      ]
    }
  },

  {
    id: 'GH003',
    description: 'Verify sign-in and user account functionality',
    priority: 'high',
    category: 'functional',
    component: 'header',
    steps: [
      'Locate sign-in button or user account menu',
      'Verify button/menu is visible',
      'Check for appropriate aria labels',
      'Verify click triggers sign-in flow'
    ],
    expectedResults: [
      'Sign-in button is visible when not authenticated',
      'User account menu is visible when authenticated',
      'Button has proper aria labels for accessibility',
      'Clicking initiates appropriate action'
    ]
  },

  {
    id: 'GH004',
    description: 'Verify app switcher functionality',
    priority: 'medium',
    category: 'functional',
    component: 'header',
    steps: [
      'Locate app switcher button',
      'Verify app switcher icon/button is visible',
      'Click app switcher',
      'Verify dropdown menu appears',
      'Check for Adobe app links'
    ],
    expectedResults: [
      'App switcher button is visible',
      'Button has recognizable icon',
      'Clicking opens dropdown menu',
      'Menu contains links to Adobe apps',
      'Menu is properly styled and positioned'
    ]
  },

  {
    id: 'GH005',
    description: 'Verify header accessibility compliance',
    priority: 'high',
    category: 'accessibility',
    component: 'header',
    steps: [
      'Test keyboard navigation through header',
      'Verify ARIA labels on interactive elements',
      'Check focus indicators',
      'Test screen reader compatibility',
      'Verify skip-to-content link'
    ],
    expectedResults: [
      'All header elements are keyboard accessible',
      'Tab order is logical',
      'Focus indicators are clearly visible',
      'ARIA labels provide meaningful descriptions',
      'Skip-to-content link is available for screen readers'
    ]
  },

  {
    id: 'GH006',
    description: 'Verify header responsive behavior',
    priority: 'medium',
    category: 'usability',
    component: 'header',
    steps: [
      'Test header on desktop viewport',
      'Test header on tablet viewport',
      'Test header on mobile viewport',
      'Verify hamburger menu on mobile',
      'Test mobile navigation interactions'
    ],
    expectedResults: [
      'Header adapts to different screen sizes',
      'Mobile menu (hamburger) appears on small screens',
      'Navigation remains accessible on all devices',
      'Header doesn\'t overlap content',
      'Touch targets are appropriately sized'
    ]
  },

  // Global Footer Scenarios
  {
    id: 'GF001',
    description: 'Verify Adobe global footer is present',
    priority: 'high',
    category: 'functional',
    component: 'footer',
    steps: [
      'Scroll to bottom of page',
      'Verify footer element exists',
      'Check footer has substantial content',
      'Verify footer is properly styled'
    ],
    expectedResults: [
      'Footer is visible at bottom of page',
      'Footer contains multiple sections',
      'Footer has proper Adobe branding',
      'Footer is responsive across devices'
    ]
  },

  {
    id: 'GF002',
    description: 'Verify footer categories and sections',
    priority: 'medium',
    category: 'functional',
    component: 'footer',
    steps: [
      'Locate footer sections',
      'Verify main category headings',
      'Check for business categories',
      'Verify support and contact sections'
    ],
    expectedResults: [
      'Footer has organized sections with headings',
      'Categories include: Individuals, Business, Organizations',
      'Support and Contact sections are present',
      'Adobe corporate section is visible'
    ],
    testData: {
      expectedSections: [
        'For individuals & small business',
        'For medium & large business',
        'For organizations',
        'Support',
        'Contact',
        'Adobe'
      ]
    }
  },

  {
    id: 'GF003',
    description: 'Verify featured Adobe products in footer',
    priority: 'medium',
    category: 'functional',
    component: 'footer',
    steps: [
      'Locate featured products section',
      'Verify major Adobe products are listed',
      'Check product links are functional',
      'Verify product descriptions if present'
    ],
    expectedResults: [
      'Featured products section is visible',
      'Major products include: Acrobat, Photoshop, Firefly, Express',
      'Product links navigate to correct pages',
      'Products are properly formatted and styled'
    ],
    testData: {
      expectedProducts: [
        'Acrobat Reader',
        'Adobe Firefly',
        'Adobe Express',
        'Photoshop',
        'Illustrator',
        'Premiere Pro',
        'Creative Cloud'
      ]
    }
  },

  {
    id: 'GF004',
    description: 'Verify social media links',
    priority: 'low',
    category: 'functional',
    component: 'footer',
    steps: [
      'Locate social media section in footer',
      'Verify social media icons/links',
      'Check links point to correct social platforms',
      'Verify icons are accessible'
    ],
    expectedResults: [
      'Social media section is visible',
      'Links to major platforms: Facebook, Instagram, Twitter, LinkedIn',
      'Icons have proper aria labels',
      'Links open in new tabs',
      'Links point to official Adobe accounts'
    ],
    testData: {
      socialPlatforms: [
        { name: 'Facebook', domain: 'facebook.com' },
        { name: 'Instagram', domain: 'instagram.com' },
        { name: 'Twitter/X', domain: 'twitter.com' },
        { name: 'LinkedIn', domain: 'linkedin.com' },
        { name: 'YouTube', domain: 'youtube.com' }
      ]
    }
  },

  {
    id: 'GF005',
    description: 'Verify legal and privacy links',
    priority: 'high',
    category: 'security',
    component: 'footer',
    steps: [
      'Locate legal/privacy section in footer',
      'Verify privacy policy link',
      'Verify terms of use link',
      'Check cookie preferences link',
      'Verify all legal links are functional'
    ],
    expectedResults: [
      'Legal links section is visible',
      'Privacy policy link is present and functional',
      'Terms of use link is present and functional',
      'Cookie preferences link allows user control',
      'All links point to correct legal pages'
    ],
    testData: {
      requiredLegalLinks: [
        'Privacy',
        'Terms of Use',
        'Cookie preferences',
        'Do Not Sell My Personal Information'
      ]
    }
  },

  {
    id: 'GF006',
    description: 'Verify footer accessibility',
    priority: 'medium',
    category: 'accessibility',
    component: 'footer',
    steps: [
      'Test keyboard navigation through footer',
      'Verify footer links are keyboard accessible',
      'Check ARIA landmarks',
      'Verify heading hierarchy',
      'Test with screen reader'
    ],
    expectedResults: [
      'All footer links are keyboard accessible',
      'Footer has proper contentinfo role',
      'Heading hierarchy is logical',
      'Links have descriptive text',
      'Focus indicators are visible'
    ]
  }
];

export const GLOBAL_COMPONENT_SELECTORS = {
  header: {
    navigation: '.global-navigation, nav[aria-label="Main"], header nav',
    signIn: 'button:has-text("Sign in"), a:has-text("Sign in"), [aria-label*="sign in" i]',
    appSwitcher: 'button[aria-label*="App switcher" i], button[aria-label*="Apps" i]',
    creativityNav: 'button:has-text("Creativity"), a:has-text("Creativity")',
    pdfNav: 'button:has-text("PDF"), a:has-text("PDF")',
    marketingNav: 'button:has-text("Marketing"), a:has-text("Marketing")',
    supportNav: 'button:has-text("Learn"), button:has-text("Support"), a:has-text("Support")'
  },
  footer: {
    main: 'footer, [role="contentinfo"], #footer, [class*="footer"]',
    sections: 'footer h2, footer h3, [role="contentinfo"] h2, [role="contentinfo"] h3',
    legalLinks: 'a:has-text("Privacy"), a:has-text("Terms"), a:has-text("Cookie")',
    socialLinks: 'a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"]'
  }
};

export const ACCESSIBILITY_REQUIREMENTS = {
  header: {
    keyboardNavigation: true,
    ariaLabels: true,
    focusIndicators: true,
    skipToContent: true
  },
  footer: {
    keyboardNavigation: true,
    contentinfoRole: true,
    headingHierarchy: true,
    descriptiveLinks: true
  }
};

export const RESPONSIVE_BREAKPOINTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

