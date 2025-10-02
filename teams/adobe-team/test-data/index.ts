/**
 * Test Data - Central Export
 * 
 * Export all test data from a single location for easy imports.
 * 
 * Usage:
 *   import { CHAT_QUERIES, VIEWPORTS, NAVIGATION_ITEMS } from '../test-data';
 */

// Brand Concierge specific data
export * from './brand-concierge.data';

// Global Adobe data
export * from './global.data';

// Configurations (viewports, performance, accessibility)
export * from './configurations';

/**
 * Helper function to get test data by category
 */
export function getTestData(category: string) {
  // Can be extended to load data from files, APIs, databases, etc.
  return {};
}

/**
 * Helper function to validate test data
 */
export function validateTestData(data: any): boolean {
  // Add validation logic
  return true;
}

