import { BRAND_CONCIERGE_QUERIES, QUICK_ACTION_BUTTONS, NAVIGATION_ITEMS } from '../../../shared/test-data';

export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
  testData?: any;
}

export const BRAND_CONCIERGE_SCENARIOS: TestScenario[] = [
  {
    id: 'BC001',
    description: 'Verify Brand Concierge page loads successfully with all core elements',
    priority: 'high',
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Wait for page to load completely',
      'Verify main heading is visible',
      'Verify description text is present',
      'Verify Adobe header and footer are present'
    ],
    expectedResults: [
      'Page loads without errors',
      'Main heading "Explore what you can do with Adobe apps." is displayed',
      'Description text about choosing options is visible',
      'Adobe navigation header is present',
      'Adobe footer with links is present'
    ]
  },

  {
    id: 'BC002', 
    description: 'Verify all quick action buttons are present and clickable',
    priority: 'high',
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Locate all quick action buttons',
      'Verify each button is visible and clickable',
      'Test clicking each button'
    ],
    expectedResults: [
      'All 4 quick action buttons are visible',
      'Buttons have proper text and icons',
      'Buttons are clickable and respond to user interaction',
      'Each button triggers appropriate action or navigation'
    ],
    testData: { buttons: QUICK_ACTION_BUTTONS }
  },

  {
    id: 'BC003',
    description: 'Verify AI chat interface functionality',
    priority: 'high', 
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Locate chat input field',
      'Verify send button is initially disabled',
      'Enter text in chat input',
      'Verify send button becomes enabled',
      'Click send button'
    ],
    expectedResults: [
      'Chat input field is visible with placeholder text',
      'Send button is disabled when input is empty',
      'Send button enables when text is entered',
      'Chat message is processed when sent',
      'User receives appropriate response'
    ]
  },

  {
    id: 'BC004',
    description: 'Test AI chat with various creative queries',
    priority: 'high',
    category: 'functional', 
    steps: [
      'Navigate to Brand Concierge page',
      'Test each predefined creative query',
      'Verify AI responds appropriately',
      'Check response relevance and accuracy'
    ],
    expectedResults: [
      'AI provides relevant product recommendations',
      'Responses include appropriate Adobe app suggestions',
      'Response time is reasonable (< 10 seconds)',
      'Responses are helpful and actionable'
    ],
    testData: { queries: BRAND_CONCIERGE_QUERIES }
  },

  {
    id: 'BC005',
    description: 'Verify main navigation functionality',
    priority: 'medium',
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Test each main navigation item',
      'Verify dropdown menus appear on hover/click',
      'Test navigation to different sections'
    ],
    expectedResults: [
      'All navigation items are clickable',
      'Dropdown menus display relevant options',
      'Navigation leads to correct pages/sections',
      'Navigation state is properly maintained'
    ],
    testData: { navigationItems: NAVIGATION_ITEMS }
  },

  {
    id: 'BC006',
    description: 'Test sign-in functionality and app switcher',
    priority: 'medium',
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Click sign-in button',
      'Verify sign-in process initiation',
      'Test app switcher button',
      'Verify app switcher menu'
    ],
    expectedResults: [
      'Sign-in button is visible and clickable',
      'Sign-in flow is initiated correctly',
      'App switcher displays available applications',
      'App switcher menu is properly formatted'
    ]
  },

  {
    id: 'BC007',
    description: 'Verify accessibility compliance',
    priority: 'high',
    category: 'accessibility',
    steps: [
      'Navigate to Brand Concierge page',
      'Test keyboard navigation',
      'Verify ARIA labels and roles',
      'Check color contrast ratios',
      'Test screen reader compatibility'
    ],
    expectedResults: [
      'All interactive elements are keyboard accessible',
      'Tab order is logical and intuitive',
      'ARIA labels provide meaningful descriptions',
      'Color contrast meets WCAG standards',
      'Screen readers can navigate content effectively'
    ]
  },

  {
    id: 'BC008',
    description: 'Test page performance and loading times',
    priority: 'medium',
    category: 'performance',
    steps: [
      'Measure initial page load time',
      'Check for lazy loading of images',
      'Verify resource optimization',
      'Test page responsiveness',
      'Monitor network requests'
    ],
    expectedResults: [
      'Page loads within 3 seconds',
      'Images are properly optimized and lazy loaded',
      'Network requests are minimized',
      'Page is responsive across different screen sizes',
      'No unnecessary resource loading'
    ]
  },

  {
    id: 'BC009',
    description: 'Verify privacy and legal compliance',
    priority: 'high',
    category: 'security',
    steps: [
      'Navigate to Brand Concierge page',
      'Verify privacy notice is displayed',
      'Test privacy policy link',
      'Test generative AI terms link',
      'Verify data handling disclosure'
    ],
    expectedResults: [
      'Privacy notice is clearly visible',
      'Privacy policy link opens correct page',
      'Generative AI terms link works properly',
      'Data handling information is transparent',
      'User consent mechanisms are in place'
    ]
  },

  {
    id: 'BC010',
    description: 'Test responsive design across different devices',
    priority: 'medium',
    category: 'usability',
    steps: [
      'Test page on desktop viewport',
      'Test page on tablet viewport', 
      'Test page on mobile viewport',
      'Verify element positioning and sizing',
      'Test touch interactions on mobile'
    ],
    expectedResults: [
      'Page layout adapts properly to different screen sizes',
      'All elements remain accessible and usable',
      'Touch targets are appropriately sized for mobile',
      'Content is readable without horizontal scrolling',
      'Navigation remains functional across devices'
    ]
  },

  {
    id: 'BC011',
    description: 'Test error handling and edge cases',
    priority: 'medium',
    category: 'functional',
    steps: [
      'Test with empty chat input',
      'Test with extremely long chat messages',
      'Test with special characters and emojis',
      'Test network disconnection scenarios',
      'Test rapid successive interactions'
    ],
    expectedResults: [
      'Empty input is handled gracefully',
      'Long messages are processed or truncated appropriately',
      'Special characters don\'t break functionality',
      'Network errors are handled with user-friendly messages',
      'Rapid clicks don\'t cause UI issues'
    ]
  },

  {
    id: 'BC012',
    description: 'Verify footer links and corporate information',
    priority: 'low',
    category: 'functional',
    steps: [
      'Navigate to Brand Concierge page',
      'Scroll to footer section',
      'Verify all footer categories are present',
      'Test footer links functionality',
      'Verify social media links'
    ],
    expectedResults: [
      'Footer contains all expected categories',
      'All footer links are working and lead to correct pages',
      'Social media links open in new tabs',
      'Corporate information is up to date',
      'Footer design is consistent with Adobe branding'
    ]
  }
];

// Test data for different scenarios
export const TEST_CONFIGURATIONS = {
  desktop: {
    viewport: { width: 1920, height: 1080 },
    userAgent: 'desktop'
  },
  tablet: {
    viewport: { width: 768, height: 1024 },
    userAgent: 'tablet'
  },
  mobile: {
    viewport: { width: 375, height: 667 },
    userAgent: 'mobile'
  }
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000, // 3 seconds
  chatResponseTime: 10000, // 10 seconds
  imageLoadTime: 2000 // 2 seconds
};

// Accessibility requirements
export const ACCESSIBILITY_REQUIREMENTS = {
  minColorContrast: 4.5,
  maxTabStops: 50,
  requiredAriaLabels: ['navigation', 'main', 'contentinfo']
};
