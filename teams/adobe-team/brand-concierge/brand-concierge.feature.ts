import { BRAND_CONCIERGE_QUERIES, QUICK_ACTION_BUTTONS, NAVIGATION_ITEMS } from '../../../shared/test-data';
// ✨ NEW: Import from centralized test-data folder
import { CHAT_QUERIES, USER_PERSONAS } from '../test-data/brand-concierge.data';
import { VIEWPORTS, PERFORMANCE_THRESHOLDS, ACCESSIBILITY_REQUIREMENTS, TIMEOUTS } from '../test-data/configurations';

/**
 * Enhanced Test Scenario Interface
 * 
 * Professional test case design with:
 * - Tags for flexible execution (Nala style)
 * - Traceability to requirements and JIRA
 * - Time estimation for planning
 * - Environment and browser specification
 */
export interface TestScenario {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';  // ✨ Added 'critical'
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  
  // ✨ NEW: Tags for flexible execution
  tags: string[];
  
  steps: string[];
  expectedResults: string[];
  testData?: any;
  
  // ✨ NEW: Traceability and metadata
  requirements?: string[];
  jiraTickets?: string[];
  documentation?: string;
  estimatedTime?: number;  // in seconds
  
  // ✨ NEW: Environment specification
  environments?: ('dev' | 'stage' | 'prod')[];
  browsers?: string[];
}

/**
 * Brand Concierge Test Scenarios
 * 
 * SCOPE: These tests focus ONLY on body > main content specific to Brand Concierge
 * EXCLUDES: Global header/footer tests (see teams/adobe-team/global/adobe-global.feature.ts)
 * 
 * Active Scenarios: BC001-BC004, BC007-BC011 (9 scenarios)
 * Moved to Global: BC005-BC006 (Header), BC012 (Footer)
 */
export const BRAND_CONCIERGE_SCENARIOS: TestScenario[] = [
  {
    id: 'BC001',
    description: 'Verify Brand Concierge page loads successfully with all core elements',
    priority: 'critical',
    category: 'functional',
    
    // ✨ Tags for flexible execution
    tags: ['@smoke', '@regression', '@adobe', '@brand-concierge', '@critical'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Wait for page to load completely',
      'Verify main heading is visible',
      'Verify description text is present',
      'Verify quick action buttons are present'
    ],
    expectedResults: [
      'Page loads without errors within 3 seconds',
      'Main heading "Explore what you can do with Adobe apps." is displayed',
      'Description text about choosing options is visible',
      'At least 3 quick action buttons are visible',
      'Chat interface is ready for interaction'
    ],
    
    // ✨ Test data reference
    testData: {
      performance: PERFORMANCE_THRESHOLDS,
    },
    
    // ✨ Traceability
    requirements: ['REQ-BC-001', 'REQ-PAGE-LOAD'],
    jiraTickets: ['ADOBE-1234'],
    documentation: 'https://wiki.adobe.com/brand-concierge/page-load',
    estimatedTime: 30,
    
    // ✨ Where to run
    environments: ['dev', 'stage', 'prod'],
    browsers: ['chrome', 'firefox', 'safari'],
  },

  {
    id: 'BC002', 
    description: 'Verify all quick action buttons are present and clickable',
    priority: 'high',
    category: 'functional',
    tags: ['@smoke', '@regression', '@adobe', '@brand-concierge', '@interaction'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Locate all quick action buttons',
      'Verify each button is visible and clickable',
      'Test hover and focus states',
      'Test clicking each button'
    ],
    expectedResults: [
      'All 4 quick action buttons are visible',
      'Buttons have proper text and icons',
      'Buttons respond to hover with visual feedback',
      'Buttons are clickable and respond to user interaction',
      'Each button triggers appropriate action or navigation'
    ],
    
    testData: { buttons: QUICK_ACTION_BUTTONS },
    
    requirements: ['REQ-BC-002', 'REQ-QUICK-ACTIONS'],
    jiraTickets: ['ADOBE-1235'],
    documentation: 'https://wiki.adobe.com/brand-concierge/quick-actions',
    estimatedTime: 45,
    environments: ['stage', 'prod'],
    browsers: ['chrome', 'firefox', 'safari'],
  },

  {
    id: 'BC003',
    description: 'Verify AI chat interface functionality with various user personas',
    priority: 'critical', 
    category: 'functional',
    tags: ['@regression', '@adobe', '@brand-concierge', '@ai', '@chat', '@critical'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Locate chat input field',
      'Verify send button is initially disabled',
      'For each user persona:',
      '  - Enter persona-specific queries',
      '  - Verify send button becomes enabled',
      '  - Click send button',
      '  - Verify AI responds appropriately',
      '  - Check response relevance and timing'
    ],
    expectedResults: [
      'Chat input field is visible with placeholder text',
      'Send button is disabled when input is empty',
      'Send button enables when text is entered',
      'AI provides relevant responses for each persona',
      'Responses include appropriate Adobe app suggestions',
      'Response time is under 10 seconds',
      'Responses are helpful and actionable'
    ],
    
    testData: { 
      personas: USER_PERSONAS,
      queries: CHAT_QUERIES,
      timeouts: TIMEOUTS,
    },
    
    requirements: ['REQ-BC-003', 'REQ-AI-CHAT', 'REQ-PERSONALIZATION'],
    jiraTickets: ['ADOBE-1236', 'ADOBE-1237'],
    documentation: 'https://wiki.adobe.com/brand-concierge/ai-chat',
    estimatedTime: 120,
    environments: ['stage', 'prod'],
    browsers: ['chrome', 'firefox'],
  },

  {
    id: 'BC004',
    description: 'Test AI chat with various creative queries and edge cases',
    priority: 'high',
    category: 'functional', 
    tags: ['@regression', '@adobe', '@brand-concierge', '@ai', '@chat', '@edge-cases'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Test valid creative queries',
      'Test product-specific queries',
      'Test edge cases (empty, long, special chars)',
      'Verify AI responds appropriately to each',
      'Check response relevance and accuracy'
    ],
    expectedResults: [
      'AI provides relevant product recommendations',
      'Responses include appropriate Adobe app suggestions',
      'Response time is reasonable (< 10 seconds)',
      'Edge cases are handled gracefully',
      'No errors with special characters or emojis',
      'Responses are helpful and actionable'
    ],
    
    testData: { 
      queries: CHAT_QUERIES,
      fallbackQueries: BRAND_CONCIERGE_QUERIES 
    },
    
    requirements: ['REQ-BC-004', 'REQ-EDGE-CASES'],
    jiraTickets: ['ADOBE-1238'],
    documentation: 'https://wiki.adobe.com/brand-concierge/query-handling',
    estimatedTime: 90,
    environments: ['stage', 'prod'],
    browsers: ['chrome', 'firefox'],
  },

  // ============================================================================
  // BC005 and BC006: Moved to teams/adobe-team/global/adobe-global.feature.ts
  // These test global header components (navigation, sign-in, app switcher)
  // See ADOBE_GLOBAL_SCENARIOS: GH002 (Navigation), GH003 (Sign-in), GH004 (App switcher)
  // ============================================================================

  {
    id: 'BC007',
    description: 'Verify accessibility compliance (WCAG 2.1 Level AA)',
    priority: 'critical',
    category: 'accessibility',
    tags: ['@regression', '@adobe', '@brand-concierge', '@a11y', '@wcag', '@critical'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Test keyboard navigation (Tab, Shift+Tab, Enter, Space)',
      'Verify all ARIA labels and roles are present',
      'Check color contrast ratios (minimum 4.5:1)',
      'Test screen reader compatibility (NVDA, JAWS, VoiceOver)',
      'Verify focus indicators are visible',
      'Test touch targets on mobile (minimum 44x44px)'
    ],
    expectedResults: [
      'All interactive elements are keyboard accessible',
      'Tab order is logical and intuitive',
      'ARIA labels provide meaningful descriptions',
      'Color contrast meets WCAG 2.1 Level AA standards (4.5:1)',
      'Screen readers can navigate content effectively',
      'Focus indicators are clearly visible',
      'Touch targets meet minimum size requirements'
    ],
    
    testData: {
      accessibility: ACCESSIBILITY_REQUIREMENTS,
    },
    
    requirements: ['REQ-A11Y-001', 'REQ-WCAG-AA', 'REQ-ARIA'],
    jiraTickets: ['ADOBE-A11Y-100'],
    documentation: 'https://wiki.adobe.com/accessibility/wcag-standards',
    estimatedTime: 180,
    environments: ['prod'],
    browsers: ['chrome', 'firefox', 'safari'],
  },

  {
    id: 'BC008',
    description: 'Performance benchmarking and optimization validation',
    priority: 'high',
    category: 'performance',
    tags: ['@regression', '@adobe', '@brand-concierge', '@performance', '@metrics'],
    
    steps: [
      'Measure First Contentful Paint (FCP)',
      'Measure Largest Contentful Paint (LCP)',
      'Measure Time to Interactive (TTI)',
      'Check Cumulative Layout Shift (CLS)',
      'Monitor network requests and payload size',
      'Verify lazy loading of images',
      'Check resource optimization',
      'Test page responsiveness'
    ],
    expectedResults: [
      'FCP < 1.8 seconds',
      'LCP < 2.5 seconds',
      'TTI < 3.8 seconds',
      'CLS < 0.1',
      'Total page weight < 2MB',
      'Images are lazy-loaded and optimized',
      'Network requests are minimized (< 50)',
      'Fonts are optimized and preloaded'
    ],
    
    testData: {
      performance: PERFORMANCE_THRESHOLDS,
    },
    
    requirements: ['REQ-PERF-001', 'REQ-WEB-VITALS'],
    jiraTickets: ['ADOBE-PERF-500'],
    documentation: 'https://wiki.adobe.com/performance/web-vitals',
    estimatedTime: 60,
    environments: ['prod'],
    browsers: ['chrome'],
  },

  {
    id: 'BC009',
    description: 'Verify privacy and legal compliance',
    priority: 'critical',
    category: 'security',
    tags: ['@regression', '@adobe', '@brand-concierge', '@privacy', '@legal', '@critical'],
    
    steps: [
      'Navigate to Brand Concierge page',
      'Verify privacy notice is displayed',
      'Test privacy policy link',
      'Test generative AI terms link',
      'Verify data handling disclosure',
      'Check cookie consent mechanism',
      'Verify HTTPS connection',
      'Check security headers'
    ],
    expectedResults: [
      'Privacy notice is clearly visible',
      'Privacy policy link opens correct page',
      'Generative AI terms link works properly',
      'Data handling information is transparent',
      'User consent mechanisms are in place',
      'Cookie consent is properly displayed',
      'Page uses HTTPS protocol',
      'Security headers are properly configured'
    ],
    
    requirements: ['REQ-PRIV-001', 'REQ-LEGAL-001', 'REQ-GDPR'],
    jiraTickets: ['ADOBE-SEC-200'],
    documentation: 'https://wiki.adobe.com/legal/privacy-compliance',
    estimatedTime: 45,
    environments: ['prod'],
    browsers: ['chrome', 'firefox', 'safari'],
  },

  {
    id: 'BC010',
    description: 'Test responsive design across all viewport sizes',
    priority: 'high',
    category: 'usability',
    tags: ['@regression', '@adobe', '@brand-concierge', '@responsive', '@mobile', '@tablet'],
    
    steps: [
      'Test on mobile viewport (375x667)',
      'Test on large mobile viewport (414x896)',
      'Test on tablet viewport (768x1024)', 
      'Test on large tablet viewport (1024x1366)',
      'Test on desktop viewport (1920x1080)',
      'Test on ultrawide viewport (3440x1440)',
      'Verify element positioning and sizing',
      'Test touch interactions on mobile/tablet',
      'Verify no horizontal scrolling on any viewport'
    ],
    expectedResults: [
      'Layout adapts properly to all viewport sizes',
      'All elements remain accessible and usable',
      'Touch targets are minimum 44x44px on mobile',
      'Content is readable without horizontal scrolling',
      'Navigation remains functional across all devices',
      'Images scale appropriately',
      'Text remains legible at all sizes'
    ],
    
    testData: {
      viewports: VIEWPORTS,
    },
    
    requirements: ['REQ-RWD-001', 'REQ-MOBILE-FIRST'],
    jiraTickets: ['ADOBE-1240'],
    documentation: 'https://wiki.adobe.com/design/responsive',
    estimatedTime: 90,
    environments: ['stage', 'prod'],
    browsers: ['chrome', 'firefox', 'safari'],
  },

  {
    id: 'BC011',
    description: 'Test error handling and edge cases',
    priority: 'high',
    category: 'functional',
    tags: ['@regression', '@adobe', '@brand-concierge', '@error-handling', '@edge-cases'],
    
    steps: [
      'Test with empty chat input',
      'Test with extremely long chat messages (1000+ chars)',
      'Test with special characters and emojis',
      'Test with XSS attempts (script tags)',
      'Test with SQL injection patterns',
      'Test network disconnection scenarios',
      'Test rapid successive interactions (spam clicks)',
      'Test timeout scenarios'
    ],
    expectedResults: [
      'Empty input is handled gracefully',
      'Long messages are processed or truncated appropriately',
      'Special characters and emojis don\'t break functionality',
      'XSS attempts are sanitized',
      'SQL injection patterns are escaped',
      'Network errors show user-friendly messages',
      'Rapid clicks don\'t cause UI issues or duplicate requests',
      'Timeouts are handled with retry options'
    ],
    
    testData: {
      edgeCases: CHAT_QUERIES.edge_cases,
    },
    
    requirements: ['REQ-ERR-001', 'REQ-SECURITY', 'REQ-VALIDATION'],
    jiraTickets: ['ADOBE-1241', 'ADOBE-SEC-201'],
    documentation: 'https://wiki.adobe.com/error-handling',
    estimatedTime: 75,
    environments: ['stage', 'prod'],
    browsers: ['chrome', 'firefox'],
  }

  // ============================================================================
  // BC012: Moved to teams/adobe-team/global/adobe-global.feature.ts
  // Footer is a global component tested separately
  // See ADOBE_GLOBAL_SCENARIOS: GF001-GF005 (Footer presence, sections, products, social, legal)
  // ============================================================================
];

// ============================================================================
// HELPER FUNCTIONS (Nala-inspired utilities)
// ============================================================================

/**
 * Get scenarios by tag
 * @param tag - Tag to filter by (e.g., '@smoke', '@regression')
 * @returns Filtered array of test scenarios
 */
export function getScenariosByTag(tag: string): TestScenario[] {
  return BRAND_CONCIERGE_SCENARIOS.filter(s => s.tags?.includes(tag));
}

/**
 * Get scenarios by priority
 * @param priority - Priority level to filter by
 * @returns Filtered array of test scenarios
 */
export function getScenariosByPriority(priority: TestScenario['priority']): TestScenario[] {
  return BRAND_CONCIERGE_SCENARIOS.filter(s => s.priority === priority);
}

/**
 * Get scenarios by category
 * @param category - Category to filter by
 * @returns Filtered array of test scenarios
 */
export function getScenariosByCategory(category: TestScenario['category']): TestScenario[] {
  return BRAND_CONCIERGE_SCENARIOS.filter(s => s.category === category);
}

/**
 * Get scenario by ID
 * @param id - Scenario ID (e.g., 'BC001')
 * @returns Test scenario or undefined if not found
 */
export function getScenarioById(id: string): TestScenario | undefined {
  return BRAND_CONCIERGE_SCENARIOS.find(s => s.id === id);
}

/**
 * Get scenarios by environment
 * @param env - Environment to filter by
 * @returns Filtered array of test scenarios
 */
export function getScenariosByEnvironment(env: 'dev' | 'stage' | 'prod'): TestScenario[] {
  return BRAND_CONCIERGE_SCENARIOS.filter(s => 
    !s.environments || s.environments.includes(env)
  );
}

/**
 * Get scenarios by browser
 * @param browser - Browser to filter by
 * @returns Filtered array of test scenarios
 */
export function getScenariosByBrowser(browser: string): TestScenario[] {
  return BRAND_CONCIERGE_SCENARIOS.filter(s => 
    !s.browsers || s.browsers.includes(browser)
  );
}

/**
 * Get test summary - useful for reporting
 * @returns Summary object with counts and statistics
 */
export function getTestSummary() {
  return {
    total: BRAND_CONCIERGE_SCENARIOS.length,
    
    byPriority: {
      critical: getScenariosByPriority('critical').length,
      high: getScenariosByPriority('high').length,
      medium: getScenariosByPriority('medium').length,
      low: getScenariosByPriority('low').length,
    },
    
    byCategory: {
      functional: getScenariosByCategory('functional').length,
      accessibility: getScenariosByCategory('accessibility').length,
      performance: getScenariosByCategory('performance').length,
      security: getScenariosByCategory('security').length,
      usability: getScenariosByCategory('usability').length,
    },
    
    byTags: {
      smoke: getScenariosByTag('@smoke').length,
      regression: getScenariosByTag('@regression').length,
      critical: getScenariosByTag('@critical').length,
      ai: getScenariosByTag('@ai').length,
      a11y: getScenariosByTag('@a11y').length,
    },
    
    estimatedTotalTime: BRAND_CONCIERGE_SCENARIOS
      .reduce((sum, s) => sum + (s.estimatedTime || 0), 0),
    
    estimatedTimeByPriority: {
      critical: getScenariosByPriority('critical')
        .reduce((sum, s) => sum + (s.estimatedTime || 0), 0),
      high: getScenariosByPriority('high')
        .reduce((sum, s) => sum + (s.estimatedTime || 0), 0),
      medium: getScenariosByPriority('medium')
        .reduce((sum, s) => sum + (s.estimatedTime || 0), 0),
      low: getScenariosByPriority('low')
        .reduce((sum, s) => sum + (s.estimatedTime || 0), 0),
    },
  };
}

/**
 * Get all unique tags used in scenarios
 * @returns Array of unique tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  BRAND_CONCIERGE_SCENARIOS.forEach(s => {
    s.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get all unique requirements
 * @returns Array of unique requirements
 */
export function getAllRequirements(): string[] {
  const requirements = new Set<string>();
  BRAND_CONCIERGE_SCENARIOS.forEach(s => {
    s.requirements?.forEach(req => requirements.add(req));
  });
  return Array.from(requirements).sort();
}

/**
 * Get all unique JIRA tickets
 * @returns Array of unique JIRA tickets
 */
export function getAllJiraTickets(): string[] {
  const tickets = new Set<string>();
  BRAND_CONCIERGE_SCENARIOS.forEach(s => {
    s.jiraTickets?.forEach(ticket => tickets.add(ticket));
  });
  return Array.from(tickets).sort();
}

/**
 * Print test summary to console
 */
export function printTestSummary(): void {
  const summary = getTestSummary();
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 BRAND CONCIERGE TEST SUITE SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\n📋 Total Scenarios: ${summary.total}`);
  console.log(`⏱️  Estimated Total Time: ${Math.round(summary.estimatedTotalTime / 60)} minutes\n`);
  
  console.log('🎯 By Priority:');
  console.log(`  ⚡ Critical: ${summary.byPriority.critical} (${summary.estimatedTimeByPriority.critical}s)`);
  console.log(`  🔴 High: ${summary.byPriority.high} (${summary.estimatedTimeByPriority.high}s)`);
  console.log(`  🟡 Medium: ${summary.byPriority.medium} (${summary.estimatedTimeByPriority.medium}s)`);
  console.log(`  🟢 Low: ${summary.byPriority.low} (${summary.estimatedTimeByPriority.low}s)`);
  
  console.log('\n📂 By Category:');
  console.log(`  ⚙️  Functional: ${summary.byCategory.functional}`);
  console.log(`  ♿ Accessibility: ${summary.byCategory.accessibility}`);
  console.log(`  ⚡ Performance: ${summary.byCategory.performance}`);
  console.log(`  🔒 Security: ${summary.byCategory.security}`);
  console.log(`  👤 Usability: ${summary.byCategory.usability}`);
  
  console.log('\n🏷️  By Tags:');
  console.log(`  @smoke: ${summary.byTags.smoke}`);
  console.log(`  @regression: ${summary.byTags.regression}`);
  console.log(`  @critical: ${summary.byTags.critical}`);
  console.log(`  @ai: ${summary.byTags.ai}`);
  console.log(`  @a11y: ${summary.byTags.a11y}`);
  
  console.log('\n' + '='.repeat(70) + '\n');
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

// Test data for different scenarios (DEPRECATED - use test-data/configurations.ts)
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
