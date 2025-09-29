export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

export const SEARCH_FUNCTIONALITY_SCENARIOS: TestScenario[] = [
  {
    id: 'FUNC001',
    description: 'Search for products using the main search input',
    priority: 'high',
    category: 'functional',
    steps: [
      "Enter 'laptop computer' in the main search input field",
      "Click the Google Search button",
      "Wait for the search results to load"
],
    expectedResults: [
      "Search results page displays with product listings related to 'laptop computer'",
      "The results contain items matching the search query",
      "A result count is displayed above the listings"
]
  },
  {
    id: 'FUNC002',
    description: 'Test autocomplete functionality with partial input',
    priority: 'high',
    category: 'functional',
    steps: [
      "Enter 'apple' in the search input field",
      "Wait for autocomplete suggestions to appear",
      "Verify that suggestions include 'Apple Inc.' and other relevant options",
      "Select 'Apple Inc.' from the suggestions and press Enter"
],
    expectedResults: [
      "Autocomplete suggestions are displayed when typing 'apple'",
      "Suggested items match the partial input",
      "Search results for 'Apple Inc.' appear after selection"
]
  },
  {
    id: 'FUNC003',
    description: 'Test search with empty query string',
    priority: 'high',
    category: 'functional',
    steps: [
      "Click the Google Search button without entering any text in the input field"
],
    expectedResults: [
      "The homepage displays or a message prompts to enter a search query"
]
  },
  {
    id: 'ACCESS001',
    description: 'Test keyboard navigation using Tab key',
    priority: 'high',
    category: 'accessibility',
    steps: [
      "Start with the cursor at the 'Sign in' link (tab index 0)",
      "Press Tab repeatedly to navigate through elements",
      "Ensure focus moves correctly through interactive elements"
],
    expectedResults: [
      "Focus highlights navigation links and buttons in correct order",
      "Keyboard interaction triggers expected actions (e.g., clicking a button)"
]
  },
  {
    id: 'PERF001',
    description: 'Measure response time for search results',
    priority: 'high',
    category: 'performance',
    steps: [
      "Enter 'top programming languages' in the search input field",
      "Click the Google Search button",
      "Wait for the page to fully load"
],
    expectedResults: [
      "Search results are displayed within 2 seconds (or a defined threshold)"
]
  },
  {
    id: 'SEC001',
    description: 'Test search with special characters',
    priority: 'high',
    category: 'security',
    steps: [
      "Enter '*' in the search input field and press Enter"
],
    expectedResults: [
      "Search results are displayed without errors or unexpected behavior",
      "The system handles special characters safely"
]
  },
  {
    id: 'USAB001',
    description: 'Test error message for empty search query',
    priority: 'high',
    category: 'usability',
    steps: [
      "Click the Google Search button without entering any text in the input field"
],
    expectedResults: [
      "A clear error or prompt message is displayed to inform the user to enter a search query"
]
  },
  {
    id: 'USAB002',
    description: 'Test responsive design on mobile view',
    priority: 'high',
    category: 'usability',
    steps: [
      "Resize the browser window to simulate a mobile device screen",
      "Observe the layout and functionality of the search page"
],
    expectedResults: [
      "The search interface adapts to the smaller screen size",
      "Elements are positioned and scaled appropriately for touch interaction"
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