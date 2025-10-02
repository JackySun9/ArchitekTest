/**
 * Brand Concierge Test Data
 * 
 * Centralized test data for Brand Concierge tests.
 * This file can be maintained by:
 * - QA engineers
 * - Product owners
 * - Non-technical team members
 * 
 * Data can be:
 * - Version controlled
 * - Generated from external sources (API, DB, CSV)
 * - Shared across multiple test files
 * - Updated without changing test logic
 */

/**
 * Chat Queries - Different types of user questions
 */
export const CHAT_QUERIES = {
  // Valid creative queries
  valid: [
    'I need help with photo editing',
    'What can I do with Photoshop?',
    'How do I create a logo?',
    'I want to design a website',
    'Help me edit videos',
  ],

  // Creative professional queries
  creative: [
    'I want to design a poster for a concert',
    'Help me with video editing for YouTube',
    'Create a marketing campaign for my business',
    'Design a brand identity package',
    'Edit product photos for e-commerce',
  ],

  // Specific product queries
  productSpecific: [
    'Show me Photoshop features',
    'What can Illustrator do?',
    'InDesign tutorials',
    'Premiere Pro video editing',
    'After Effects animation',
  ],

  // Edge cases
  edge_cases: [
    '',                    // Empty query
    ' ',                   // Whitespace only
    'a'.repeat(1000),      // Very long query
    '!@#$%^&*()_+',       // Special characters
    '😀🎨🖼️📸',            // Emojis
    '<script>alert("test")</script>', // XSS attempt
    'SELECT * FROM users', // SQL injection attempt
  ],

  // Invalid or problematic queries
  invalid: [
    'asdfghjkl',          // Random characters
    '12345',              // Just numbers
    '....',               // Just punctuation
  ],
};

/**
 * Quick Action Buttons
 */
export const QUICK_ACTION_BUTTONS = [
  {
    id: 'btn-design',
    text: 'Create a design',
    action: 'design',
    expectedProducts: ['Photoshop', 'Illustrator', 'InDesign'],
  },
  {
    id: 'btn-photo',
    text: 'Edit a photo',
    action: 'photo',
    expectedProducts: ['Photoshop', 'Lightroom'],
  },
  {
    id: 'btn-video',
    text: 'Make a video',
    action: 'video',
    expectedProducts: ['Premiere Pro', 'After Effects'],
  },
  {
    id: 'btn-sign',
    text: 'Sign a document',
    action: 'sign',
    expectedProducts: ['Acrobat', 'Sign'],
  },
];

/**
 * User Personas - Different types of users
 */
export const USER_PERSONAS = {
  designer: {
    name: 'Sarah Designer',
    role: 'Graphic Designer',
    experience: 'professional',
    queries: [
      'I need to create a brand identity package',
      'Help me design marketing materials',
      'Show me advanced Photoshop techniques',
    ],
    expectedRecommendations: ['Photoshop', 'Illustrator', 'InDesign'],
  },

  photographer: {
    name: 'Mike Photographer',
    role: 'Professional Photographer',
    experience: 'professional',
    queries: [
      'How do I batch edit photos?',
      'Color correction tips',
      'RAW photo processing',
    ],
    expectedRecommendations: ['Photoshop', 'Lightroom'],
  },

  videoEditor: {
    name: 'Alex Video',
    role: 'Video Editor',
    experience: 'professional',
    queries: [
      'Edit a promotional video',
      'Add motion graphics',
      'Color grading for video',
    ],
    expectedRecommendations: ['Premiere Pro', 'After Effects'],
  },

  beginner: {
    name: 'Jamie Newbie',
    role: 'Small Business Owner',
    experience: 'beginner',
    queries: [
      'I need help designing a logo',
      'How do I create social media graphics?',
      'Simple photo editing',
    ],
    expectedRecommendations: ['Express', 'Photoshop'],
  },

  marketer: {
    name: 'Chris Marketing',
    role: 'Marketing Manager',
    experience: 'intermediate',
    queries: [
      'Create campaign assets',
      'Design email templates',
      'Social media content',
    ],
    expectedRecommendations: ['Express', 'Photoshop', 'Premiere Pro'],
  },
};

/**
 * Adobe Products - Expected in recommendations
 */
export const ADOBE_PRODUCTS = {
  photoshop: {
    name: 'Photoshop',
    category: 'Photo editing',
    keywords: ['photo', 'edit', 'retouch', 'image'],
  },
  illustrator: {
    name: 'Illustrator',
    category: 'Vector graphics',
    keywords: ['logo', 'vector', 'design', 'illustration'],
  },
  indesign: {
    name: 'InDesign',
    category: 'Layout design',
    keywords: ['layout', 'publication', 'book', 'magazine'],
  },
  premierePro: {
    name: 'Premiere Pro',
    category: 'Video editing',
    keywords: ['video', 'edit', 'footage', 'timeline'],
  },
  afterEffects: {
    name: 'After Effects',
    category: 'Motion graphics',
    keywords: ['animation', 'motion', 'effects', 'vfx'],
  },
  lightroom: {
    name: 'Lightroom',
    category: 'Photo management',
    keywords: ['photo', 'organize', 'batch', 'raw'],
  },
  acrobat: {
    name: 'Acrobat',
    category: 'PDF',
    keywords: ['pdf', 'document', 'sign', 'form'],
  },
  express: {
    name: 'Adobe Express',
    category: 'Quick creation',
    keywords: ['quick', 'easy', 'template', 'social'],
  },
};

/**
 * Expected UI Elements
 */
export const UI_ELEMENTS = {
  headings: {
    main: 'Explore what you can do with Adobe apps.',
    description: 'Choose an option or tell us what interests you',
  },
  
  placeholders: {
    chatInput: 'Type your message...',
  },
  
  buttons: {
    send: 'Send',
    submit: 'Submit',
  },
  
  links: {
    privacy: 'Privacy Notice',
    terms: 'Terms of Use',
    generativeAI: 'Generative AI',
  },
};

/**
 * API Response Examples (for mocking)
 */
export const MOCK_RESPONSES = {
  photoEditing: {
    products: ['Photoshop', 'Lightroom'],
    message: 'For photo editing, I recommend using Adobe Photoshop for advanced edits or Lightroom for quick adjustments and organization.',
  },
  
  logoDesign: {
    products: ['Illustrator'],
    message: 'Adobe Illustrator is perfect for creating logos with vector graphics that scale to any size.',
  },
  
  videoEditing: {
    products: ['Premiere Pro', 'After Effects'],
    message: 'For video editing, Premiere Pro is excellent for timeline editing, and After Effects for motion graphics.',
  },
};

/**
 * Error Messages - Expected error handling
 */
export const ERROR_MESSAGES = {
  emptyInput: 'Please enter a message',
  networkError: 'Unable to connect. Please try again.',
  serverError: 'Something went wrong. Please try again later.',
  timeout: 'Request timed out. Please try again.',
};

/**
 * Timing Expectations
 */
export const TIMING = {
  chatResponseTime: 10000,  // 10 seconds max
  typingDelay: 100,         // Typing simulation delay
  animationDuration: 300,   // UI animations
};

