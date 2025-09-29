export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export interface ChatMessage {
  input: string;
  expectedResponse?: string;
  category: 'creative' | 'technical' | 'product' | 'general';
}

export const TEST_USERS = {
  standard: {
    email: 'test.user@adobe.com',
    password: 'TestPassword123',
    name: 'Test User'
  },
  premium: {
    email: 'premium.user@adobe.com', 
    password: 'PremiumPass456',
    name: 'Premium User'
  }
};

export const BRAND_CONCIERGE_QUERIES: ChatMessage[] = [
  {
    input: 'I want to create a logo for my business',
    category: 'creative',
    expectedResponse: 'Illustrator'
  },
  {
    input: 'How do I edit a PDF?',
    category: 'technical',
    expectedResponse: 'Acrobat'
  },
  {
    input: 'I need to remove background from photos',
    category: 'creative',
    expectedResponse: 'Photoshop'
  },
  {
    input: 'What apps are included in Creative Cloud?',
    category: 'product'
  },
  {
    input: 'I want to create social media posts',
    category: 'creative',
    expectedResponse: 'Express'
  }
];

export const NAVIGATION_ITEMS = [
  'Creativity & Design',
  'PDF & E-signatures', 
  'Marketing & Commerce',
  'Learn & Support'
];

export const QUICK_ACTION_BUTTONS = [
  "I'd like to explore templates to see what I can create.",
  "I want to touch up and enhance my photos.",
  "I'd like to edit PDFs and make them interactive.",
  "I want to turn my clips into polished videos."
];
