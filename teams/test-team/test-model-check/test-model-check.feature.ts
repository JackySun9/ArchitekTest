export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

export const TEST_MODEL_CHECK_SCENARIOS: TestScenario[] = [
  {
    id: 'FUNC001',
    description: 'Verify navigation items display correctly',
    priority: 'high',
    category: 'functional',
    steps: [
      "Click on 'Creativity & Design' in the navigation section",
      "Wait for page to load after clicking"
],
    expectedResults: [
      "Page navigates to Creativity & Design section",
      "Navigation highlight indicates active section"
]
  },
  {
    id: 'FUNC002',
    description: 'Test quick action buttons functionality',
    priority: 'high',
    category: 'functional',
    steps: [
      "Click on 'I'd like to explore templates' button",
      "Wait for page to load after clicking"
],
    expectedResults: [
      "Page navigates to templates section",
      "Quick action indicator appears visually"
]
  },
  {
    id: 'ACC001',
    description: 'Check keyboard navigation accessibility',
    priority: 'medium',
    category: 'accessibility',
    steps: [
      "Use TAB key to navigate through page elements",
      "Press ENTER on a clickable element"
],
    expectedResults: [
      "Focus moves correctly between interactive elements",
      "Selected element responds to keyboard input"
]
  },
  {
    id: 'PERF001',
    description: 'Measure page load performance',
    priority: 'high',
    category: 'performance',
    steps: [
      "Navigate to the page",
      "Wait for page to fully load"
],
    expectedResults: [
      "Page loads within 5 seconds",
      "All resources load successfully without errors"
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