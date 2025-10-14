/**
 * Quote Block Test Specification
 * 
 * Based on: https://github.com/adobecom/milo/tree/stage/nala
 * Pattern: features/*.spec.js
 * 
 * This file contains test specifications and test data.
 * In Nala, this drives the entire test execution.
 */

export interface Feature {
  tcid: string;           // Test Case ID
  name: string;           // Test name (includes @tags)
  path: string;           // URL path to test
  data?: any;             // Test data specific to this feature
  tags: string;           // Space-separated tags
  browserParams?: string; // Browser-specific parameters
}

export interface FeatureSpec {
  name: string;           // Feature name
  features: Feature[];    // Array of test cases
}

/**
 * Quote Block Test Specification
 * 
 * Real example from Milo/Nala:
 * https://github.com/adobecom/milo/tree/stage/nala/features
 */
export const QuoteSpec: FeatureSpec = {
  name: 'Quote Block',
  features: [
    {
      tcid: '0',
      name: '@Quote @smoke @regression @milo',
      path: '/drafts/nala/blocks/quote/quote',
      data: {
        quoteCopy: '3D is a crucial part of how we explore the brand in a digital workflow',
        figCaption: 'Benny Lee',
        cite: 'Global Manager of Experiential Design, Coca-Cola Company',
      },
      tags: '@smoke @regression @milo',
    },
    {
      tcid: '1',
      name: '@Quote-Contained @smoke @regression @milo',
      path: '/drafts/nala/blocks/quote/quote-contained',
      data: {
        quoteCopy: 'The future of work is creative collaboration',
        figCaption: 'John Smith',
        cite: 'Creative Director, Adobe',
        variant: 'contained',
      },
      tags: '@smoke @regression @milo',
    },
    {
      tcid: '2',
      name: '@Quote-Inline @regression @milo',
      path: '/drafts/nala/blocks/quote/quote-inline',
      data: {
        quoteCopy: 'Design is not just what it looks like, design is how it works',
        figCaption: 'Steve Jobs',
        cite: 'Co-founder, Apple Inc.',
        variant: 'inline',
      },
      tags: '@regression @milo',
    },
  ],
};

// Export for easy access
export default QuoteSpec;

/**
 * Helper function to get features by tag
 * Usage: getFeaturesByTag('@smoke')
 */
export function getFeaturesByTag(tag: string): Feature[] {
  return QuoteSpec.features.filter(f => f.tags.includes(tag));
}

/**
 * Helper function to get feature by test case ID
 * Usage: getFeatureById('0')
 */
export function getFeatureById(tcid: string): Feature | undefined {
  return QuoteSpec.features.find(f => f.tcid === tcid);
}
