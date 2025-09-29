export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

export const REACT_TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'FUNC001',
    description: 'Verify navigation items functionality',
    priority: 'high',
    category: 'functional',
    steps: [
      "Click on 'Creativity & Design' in the navigation list",
      "Verify that the page navigates to the creativity section"
],
    expectedResults: [
      "Page navigates to the creativity section",
      "URL reflects the selected navigation item"
]
  },
  {
    id: 'FUNC002',
    description: 'Test quick action buttons functionality',
    priority: 'medium',
    category: 'functional',
    steps: [
      "Click on 'I'd like to explore templates' in the quick actions",
      "Verify that the page navigates to the template section"
],
    expectedResults: [
      "Page navigates to the template section",
      "URL reflects the selected quick action button"
]
  },
  {
    id: 'ACCESS001',
    description: 'Test keyboard navigation accessibility',
    priority: 'high',
    category: 'accessibility',
    steps: [
      "Use TAB key to navigate through page elements",
      "Verify focus order using browser dev tools"
],
    expectedResults: [
      "Focus moves correctly between interactive elements",
      "No keyboard traps detected during navigation"
]
  },
  {
    id: 'PERF001',
    description: 'Test page load performance',
    priority: 'high',
    category: 'performance',
    steps: [
      "Navigate to the main page without any user interaction",
      "Measure page load time using playwright's metrics"
],
    expectedResults: [
      "Page loads within 5 seconds",
      "No critical resource errors during loading"
]
  },
  {
    id: 'USABILITY001',
    description: 'Test error handling in form submission',
    priority: 'low',
    category: 'usability',
    steps: [
      "Submit an empty form field",
      "Verify that an error message displays"
],
    expectedResults: [
      "Error message appears above the form field",
      "Message clearly indicates required field validation"
]
  }
];

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

export const PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000, // 3 seconds
  responseTime: 2000,  // 2 seconds
  imageLoadTime: 1000  // 1 second
};