export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

export const USER_LOGIN_SCENARIOS: TestScenario[] = [
  {
    id: 'FUNC001',
    description: 'Successful login with valid credentials',
    priority: 'high',
    category: 'functional',
    steps: [
      "Navigate to the login page",
      "Enter a valid email address in the email field",
      "Enter the corresponding valid password in the password field",
      "Click the login button"
],
    expectedResults: [
      "User is redirected to the authenticated area/homepage",
      "A welcome message with the user's name is displayed",
      "Login session is established (verified by cookies or local storage)"
]
  },
  {
    id: 'FUNC002',
    description: 'Login attempt with invalid email format',
    priority: 'high',
    category: 'functional',
    steps: [
      "Navigate to the login page",
      "Enter an invalid email address (e.g., missing @ symbol) in the email field",
      "Enter a valid password in the password field",
      "Click the login button"
],
    expectedResults: [
      "An appropriate error message is displayed indicating invalid email format.",
      "The page remains on the login page.",
      "No login session is established."
]
  },
  {
    id: 'FUNC003',
    description: 'Login attempt with incorrect password',
    priority: 'high',
    category: 'functional',
    steps: [
      "Navigate to the login page",
      "Enter a valid email address in the email field",
      "Enter an incorrect password in the password field",
      "Click the login button"
],
    expectedResults: [
      "An appropriate error message is displayed indicating incorrect password.",
      "The page remains on the login page.",
      "No login session is established."
]
  },
  {
    id: 'FUNC004',
    description: 'Login attempt with empty email and password fields',
    priority: 'high',
    category: 'functional',
    steps: [
      "Navigate to the login page",
      "Leave the email field empty",
      "Leave the password field empty",
      "Click the login button"
],
    expectedResults: [
      "Error messages are displayed for both email and password fields, indicating they are required.",
      "The page remains on the login page.",
      "No login session is established."
]
  },
  {
    id: 'ACC001',
    description: 'Verify page is navigable using keyboard only',
    priority: 'high',
    category: 'accessibility',
    steps: [
      "Navigate to the login page",
      "Attempt to navigate through all interactive elements (email field, password field, login button) using the Tab key.",
      "Verify that the focus is visibly indicated for each element."
],
    expectedResults: [
      "All interactive elements are reachable using the Tab key.",
      "A clear and visible focus indicator is present for each element when it is focused.",
      "The Tab order follows a logical and intuitive sequence."
]
  },
  {
    id: 'ACC002',
    description: 'Verify screen reader compatibility',
    priority: 'high',
    category: 'accessibility',
    steps: [
      "Navigate to the login page",
      "Activate a screen reader (e.g., NVDA, VoiceOver).",
      "Verify that the screen reader accurately announces all elements, including labels, input fields, and the login button."
],
    expectedResults: [
      "The screen reader accurately announces all elements and their purpose.",
      "Input fields are announced with appropriate labels (e.g., “Email address edit box”, “Password edit box”).",
      "The login button is announced as “Login button” or similar."
]
  },
  {
    id: 'PERF001',
    description: 'Verify login page load time',
    priority: 'medium',
    category: 'performance',
    steps: [
      "Navigate to the login page.",
      "Measure the time it takes for the page to fully load and become interactive."
],
    expectedResults: [
      "The page loads and becomes interactive within 3 seconds.",
      "No excessive loading delays or performance bottlenecks are observed."
]
  },
  {
    id: 'SEC001',
    description: 'Verify password field masking',
    priority: 'high',
    category: 'security',
    steps: [
      "Navigate to the login page.",
      "Enter a password in the password field.",
      "Verify that the password characters are masked (displayed as asterisks or dots)."
],
    expectedResults: [
      "The password characters are masked in the password field.",
      "The password is not visible in plain text on the screen."
]
  },
  {
    id: 'USAB001',
    description: 'Verify responsiveness on different screen sizes',
    priority: 'medium',
    category: 'usability',
    steps: [
      "Navigate to the login page.",
      "Resize the browser window to different screen sizes (desktop, tablet, mobile).",
      "Verify that the page layout and elements adapt appropriately to the different screen sizes.",
      "Verify that the page is usable and readable on all screen sizes."
],
    expectedResults: [
      "The page layout and elements adapt appropriately to the different screen sizes.",
      "The page is usable and readable on all screen sizes.",
      "No elements are truncated or overlap on any screen size."
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