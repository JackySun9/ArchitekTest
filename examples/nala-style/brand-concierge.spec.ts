/**
 * Brand Concierge Test Specification
 * 
 * Pattern: Milo/Nala features/*.spec.js
 * Source: https://github.com/adobecom/milo/tree/stage/nala
 * 
 * This file contains:
 * - Test specifications (what to test)
 * - Test data (data for each test)
 * - Test metadata (tags, IDs, requirements)
 */

export interface Feature {
  tcid: string;           // Test Case ID (e.g., 'BC001')
  name: string;           // Test name with embedded tags
  path: string;           // URL path to test
  tags: string[];         // Tags for filtering
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security';
  data?: any;             // Test-specific data
  
  // Optional metadata
  requirements?: string[];
  jiraTickets?: string[];
  estimatedTime?: number;
}

export interface FeatureSpec {
  name: string;           // Feature name
  features: Feature[];    // Array of test cases
}

/**
 * Brand Concierge Test Specification
 * 
 * All test cases and data in ONE place (Nala style)
 */
export const BrandConciergeSpec: FeatureSpec = {
  name: 'Brand Concierge',
  
  features: [
    // ========================================================================
    // BC001: Core Page Load
    // ========================================================================
    {
      tcid: 'BC001',
      name: '@BrandConcierge @smoke @critical @page-load',
      path: '/brand-concierge',
      tags: ['@smoke', '@critical', '@brand-concierge', '@page-load'],
      priority: 'critical',
      category: 'functional',
      
      data: {
        expectedHeading: 'Explore what you can do with Adobe apps.',
        expectedDescription: 'Choose an option or tell us what interests you',
        minQuickActions: 3,
        maxLoadTime: 3000, // ms
      },
      
      requirements: ['REQ-BC-001', 'REQ-PAGE-LOAD'],
      jiraTickets: ['ADOBE-1234'],
      estimatedTime: 30,
    },

    // ========================================================================
    // BC002: Quick Action Buttons
    // ========================================================================
    {
      tcid: 'BC002',
      name: '@BrandConcierge @smoke @regression @interaction',
      path: '/brand-concierge',
      tags: ['@smoke', '@regression', '@brand-concierge', '@interaction'],
      priority: 'high',
      category: 'functional',
      
      data: {
        quickActions: [
          {
            text: 'Create a design',
            action: 'design',
            expectedProducts: ['Photoshop', 'Illustrator', 'InDesign'],
          },
          {
            text: 'Edit a photo',
            action: 'photo',
            expectedProducts: ['Photoshop', 'Lightroom'],
          },
          {
            text: 'Make a video',
            action: 'video',
            expectedProducts: ['Premiere Pro', 'After Effects'],
          },
          {
            text: 'Sign a document',
            action: 'sign',
            expectedProducts: ['Acrobat', 'Sign'],
          },
        ],
        minButtonCount: 3,
      },
      
      requirements: ['REQ-BC-002', 'REQ-QUICK-ACTIONS'],
      jiraTickets: ['ADOBE-1235'],
      estimatedTime: 45,
    },

    // ========================================================================
    // BC003: AI Chat Interface
    // ========================================================================
    {
      tcid: 'BC003',
      name: '@BrandConcierge @regression @ai @chat @critical',
      path: '/brand-concierge',
      tags: ['@regression', '@ai', '@chat', '@critical', '@brand-concierge'],
      priority: 'critical',
      category: 'functional',
      
      data: {
        chatQueries: [
          {
            input: 'I want to create a logo',
            expectedKeywords: ['Illustrator', 'logo', 'design'],
            timeout: 10000,
          },
          {
            input: 'I need help with photo editing',
            expectedKeywords: ['Photoshop', 'Lightroom', 'photo'],
            timeout: 10000,
          },
          {
            input: 'How do I edit videos?',
            expectedKeywords: ['Premiere Pro', 'video', 'edit'],
            timeout: 10000,
          },
        ],
        
        placeholders: {
          chatInput: 'Type your message...',
        },
        
        buttons: {
          send: 'Send',
        },
      },
      
      requirements: ['REQ-BC-003', 'REQ-AI-CHAT'],
      jiraTickets: ['ADOBE-1236', 'ADOBE-1237'],
      estimatedTime: 120,
    },

    // ========================================================================
    // BC004: AI Chat - Edge Cases
    // ========================================================================
    {
      tcid: 'BC004',
      name: '@BrandConcierge @regression @ai @chat @edge-cases',
      path: '/brand-concierge',
      tags: ['@regression', '@ai', '@chat', '@edge-cases', '@brand-concierge'],
      priority: 'high',
      category: 'functional',
      
      data: {
        edgeCases: {
          emptyInput: '',
          whitespaceOnly: '   ',
          longInput: 'a'.repeat(1000),
          specialChars: '!@#$%^&*()_+',
          emojis: '🎨 Design with emojis 📸',
          xssAttempt: '<script>alert("test")</script>',
          sqlInjection: 'SELECT * FROM users',
        },
        
        expectedBehaviors: {
          emptyInput: 'button should be disabled',
          whitespaceOnly: 'button should be disabled',
          longInput: 'should accept or truncate',
          specialChars: 'should handle gracefully',
          emojis: 'should support emojis',
          xssAttempt: 'should sanitize',
          sqlInjection: 'should escape',
        },
      },
      
      requirements: ['REQ-BC-004', 'REQ-EDGE-CASES', 'REQ-SECURITY'],
      jiraTickets: ['ADOBE-1238', 'ADOBE-SEC-201'],
      estimatedTime: 90,
    },

    // ========================================================================
    // BC007: Accessibility
    // ========================================================================
    {
      tcid: 'BC007',
      name: '@BrandConcierge @regression @a11y @wcag @critical',
      path: '/brand-concierge',
      tags: ['@regression', '@a11y', '@wcag', '@critical', '@brand-concierge'],
      priority: 'critical',
      category: 'accessibility',
      
      data: {
        wcagLevel: 'AA',
        minContrastRatio: 4.5,
        
        keyboardNav: {
          keys: ['Tab', 'Shift+Tab', 'Enter', 'Space'],
          expectedTabStops: ['chatInput', 'sendButton', 'quickActionButtons'],
        },
        
        aria: {
          requiredLabels: ['chatInput', 'sendButton'],
          requiredRoles: ['textbox', 'button'],
        },
        
        touchTargets: {
          minSize: 44, // pixels
        },
      },
      
      requirements: ['REQ-A11Y-001', 'REQ-WCAG-AA'],
      jiraTickets: ['ADOBE-A11Y-100'],
      estimatedTime: 180,
    },

    // ========================================================================
    // BC008: Performance
    // ========================================================================
    {
      tcid: 'BC008',
      name: '@BrandConcierge @regression @performance @metrics',
      path: '/brand-concierge',
      tags: ['@regression', '@performance', '@metrics', '@brand-concierge'],
      priority: 'high',
      category: 'performance',
      
      data: {
        thresholds: {
          pageLoadTime: 3000,        // ms
          firstContentfulPaint: 1800, // ms
          largestContentfulPaint: 2500, // ms
          timeToInteractive: 3800,   // ms
          cumulativeLayoutShift: 0.1,
          totalPageWeight: 2048,     // KB
          maxNetworkRequests: 150,
        },
        
        imageOptimization: {
          requiredAttributes: ['alt', 'loading'],
          preferredFormat: ['webp', 'avif'],
        },
      },
      
      requirements: ['REQ-PERF-001', 'REQ-WEB-VITALS'],
      jiraTickets: ['ADOBE-PERF-500'],
      estimatedTime: 60,
    },

    // ========================================================================
    // BC009: Privacy & Legal
    // ========================================================================
    {
      tcid: 'BC009',
      name: '@BrandConcierge @regression @privacy @legal @critical',
      path: '/brand-concierge',
      tags: ['@regression', '@privacy', '@legal', '@critical', '@brand-concierge'],
      priority: 'critical',
      category: 'security',
      
      data: {
        requiredNotices: [
          'beta AI chatbot',
          'subject to Adobe',
          'use of AI',
        ],
        
        requiredLinks: [
          { text: 'Privacy', href: '/privacy' },
          { text: 'Terms', href: '/terms' },
          { text: 'Generative AI', href: '/ai-terms' },
        ],
        
        security: {
          protocol: 'https',
          requiredHeaders: [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
          ],
        },
      },
      
      requirements: ['REQ-PRIV-001', 'REQ-LEGAL-001', 'REQ-GDPR'],
      jiraTickets: ['ADOBE-SEC-200'],
      estimatedTime: 45,
    },

    // ========================================================================
    // BC010: Responsive Design
    // ========================================================================
    {
      tcid: 'BC010',
      name: '@BrandConcierge @regression @responsive @mobile @tablet',
      path: '/brand-concierge',
      tags: ['@regression', '@responsive', '@mobile', '@tablet', '@brand-concierge'],
      priority: 'high',
      category: 'functional',
      
      data: {
        viewports: {
          mobile: { width: 375, height: 667, name: 'iPhone SE' },
          mobileLarge: { width: 414, height: 896, name: 'iPhone 11' },
          tablet: { width: 768, height: 1024, name: 'iPad' },
          tabletLarge: { width: 1024, height: 1366, name: 'iPad Pro' },
          desktop: { width: 1920, height: 1080, name: 'Desktop' },
          ultrawide: { width: 3440, height: 1440, name: 'Ultrawide' },
        },
        
        expectations: {
          noHorizontalScroll: true,
          touchTargetMinSize: 44,
          textReadability: true,
        },
      },
      
      requirements: ['REQ-RWD-001', 'REQ-MOBILE-FIRST'],
      jiraTickets: ['ADOBE-1240'],
      estimatedTime: 90,
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS (Nala style)
// ============================================================================

/**
 * Get features by tag
 * Usage: getFeaturesByTag('@smoke')
 */
export function getFeaturesByTag(tag: string): Feature[] {
  return BrandConciergeSpec.features.filter(f => f.tags.includes(tag));
}

/**
 * Get feature by test case ID
 * Usage: getFeatureById('BC001')
 */
export function getFeatureById(tcid: string): Feature | undefined {
  return BrandConciergeSpec.features.find(f => f.tcid === tcid);
}

/**
 * Get features by priority
 */
export function getFeaturesByPriority(priority: Feature['priority']): Feature[] {
  return BrandConciergeSpec.features.filter(f => f.priority === priority);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: Feature['category']): Feature[] {
  return BrandConciergeSpec.features.filter(f => f.category === category);
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  BrandConciergeSpec.features.forEach(f => {
    f.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get test summary
 */
export function getTestSummary() {
  return {
    total: BrandConciergeSpec.features.length,
    bySmokeTests: getFeaturesByTag('@smoke').length,
    byPriority: {
      critical: getFeaturesByPriority('critical').length,
      high: getFeaturesByPriority('high').length,
      medium: getFeaturesByPriority('medium').length,
      low: getFeaturesByPriority('low').length,
    },
    byCategory: {
      functional: getFeaturesByCategory('functional').length,
      accessibility: getFeaturesByCategory('accessibility').length,
      performance: getFeaturesByCategory('performance').length,
      security: getFeaturesByCategory('security').length,
    },
    estimatedTime: BrandConciergeSpec.features.reduce(
      (sum, f) => sum + (f.estimatedTime || 0),
      0
    ),
  };
}

// Export default for easy import
export default BrandConciergeSpec;


