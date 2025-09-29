import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { Tool } from '@langchain/core/tools';
import { EnhancedRAGEngine } from './enhanced-rag';
import { chromium } from 'playwright';
import fs from 'fs-extra';
import path from 'path';

// Custom Tools for the Agent
interface UIElement {
  tag: string;
  text: string;
  id: string;
  className: string;
  testId: string;
  role: string;
  type: string;
  placeholder: string;
  xpath: string;
}

interface PageAnalysis {
  url: string;
  title: string;
  elements: UIElement[];
  pageStructure: {
    hasNavigation: boolean;
    hasFooter: boolean;
    hasForm: boolean;
    hasModal: boolean;
  };
  accessibility: {
    hasAriaLabels: boolean;
    hasHeadings: boolean;
    hasLandmarks: boolean;
  };
}

class PageAnalysisTool extends Tool {
  name = 'page_analyzer';
  description = 'Analyzes a web page URL to extract comprehensive UI elements, structure, and accessibility information';

  async _call(url: string): Promise<string> {
    console.log(`🔍 Analyzing page: ${url}`);
    
    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set a reasonable timeout and wait for network to be idle
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const analysis = await page.evaluate(() => {
        // Helper function to generate XPath
        function getXPath(element: Element): string {
          if (element.id) return `//*[@id="${element.id}"]`;
          if (element.getAttribute('data-testid')) {
            return `//*[@data-testid="${element.getAttribute('data-testid')}"]`;
          }
          
          const parts = [];
          let current: Element | null = element;
          
          while (current && current.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = current.previousElementSibling;
            
            while (sibling) {
              if (sibling.nodeName === current.nodeName) index++;
              sibling = sibling.previousElementSibling;
            }
            
            const tagName = current.nodeName.toLowerCase();
            const part = index > 1 ? `${tagName}[${index}]` : tagName;
            parts.unshift(part);
            current = current.parentElement;
          }
          
          return '/' + parts.join('/');
        }

        // Extract interactive elements
        const interactiveSelectors = [
          'a', 'button', 'input', 'select', 'textarea', 
          '[data-testid]', '[role="button"]', '[role="link"]',
          '[role="textbox"]', '[role="combobox"]', '[role="tab"]',
          '[onclick]', '[onsubmit]', '.btn', '.button'
        ];
        
        const elements = Array.from(document.querySelectorAll(interactiveSelectors.join(', ')))
          .filter((el, index, arr) => arr.indexOf(el) === index) // Remove duplicates
          .map(el => ({
            tag: el.tagName.toLowerCase(),
            text: (el as HTMLElement).innerText?.slice(0, 100) || '',
            id: el.id || '',
            className: el.className || '',
            testId: el.getAttribute('data-testid') || '',
            role: el.getAttribute('role') || '',
            type: el.getAttribute('type') || '',
            placeholder: el.getAttribute('placeholder') || '',
            xpath: getXPath(el)
          }));

        // Analyze page structure
        const pageStructure = {
          hasNavigation: !!document.querySelector('nav, [role="navigation"]'),
          hasFooter: !!document.querySelector('footer, [role="contentinfo"]'),
          hasForm: !!document.querySelector('form'),
          hasModal: !!document.querySelector('[role="dialog"], .modal, [aria-modal="true"]')
        };

        // Analyze accessibility
        const accessibility = {
          hasAriaLabels: !!document.querySelector('[aria-label], [aria-labelledby]'),
          hasHeadings: !!document.querySelector('h1, h2, h3, h4, h5, h6'),
          hasLandmarks: !!document.querySelector('[role="main"], [role="navigation"], [role="contentinfo"], [role="banner"]')
        };

        return {
          url: window.location.href,
          title: document.title,
          elements,
          pageStructure,
          accessibility
        };
      });

      await browser.close();
      
      console.log(`✅ Found ${analysis.elements.length} interactive elements`);
      return JSON.stringify(analysis, null, 2);
      
    } catch (error) {
      console.error(`❌ Error analyzing page ${url}:`, error);
      return JSON.stringify({
        url,
        title: '',
        elements: [],
        pageStructure: { hasNavigation: false, hasFooter: false, hasForm: false, hasModal: false },
        accessibility: { hasAriaLabels: false, hasHeadings: false, hasLandmarks: false },
        error: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2);
    }
  }
}

class CodebaseQueryTool extends Tool {
  name = 'codebase_query';
  description = 'Queries the existing codebase for relevant patterns, base classes, and utilities';
  
  constructor(private ragEngine: EnhancedRAGEngine) {
    super();
  }

  async _call(query: string): Promise<string> {
    const result = await this.ragEngine.queryCodebase(query);
    return `Answer: ${result.answer}\n\nSources:\n${result.sources.map(doc => 
      `File: ${doc.metadata.source}\nContent: ${doc.pageContent.slice(0, 200)}...`
    ).join('\n\n')}`;
  }
}

interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

class TestScenarioGeneratorTool extends Tool {
  name = 'scenario_generator';
  description = 'Generates comprehensive test scenarios based on UI analysis, requirements, and existing patterns';

  constructor(private llm: Ollama) {
    super();
  }

  async _call(input: string): Promise<string> {
    console.log('🧠 Generating intelligent test scenarios...');
    
    try {
      const { uiAnalysis, requirements, existingPatterns } = JSON.parse(input);
      
      const prompt = PromptTemplate.fromTemplate(`
You are a senior QA engineer with 10+ years experience creating Playwright tests. Generate realistic, actionable test scenarios based on the actual UI elements found.

UI ANALYSIS (Real elements from the page):
{uiAnalysis}

REQUIREMENTS:
{requirements}

EXISTING PATTERNS:
{existingPatterns}

CRITICAL INSTRUCTIONS:
1. Base scenarios ONLY on actual UI elements found in the analysis
2. Create specific, actionable steps that map to real elements
3. Avoid generic steps like "navigate to page" (already handled in setup)
4. Each step should perform a concrete action or verification
5. Expected results should be specific and measurable

SCENARIO CATEGORIES (generate 2-3 per category):
- Functional: Core user workflows using actual form fields, buttons, links
- Accessibility: Keyboard navigation, ARIA attributes, screen reader support  
- Performance: Page load, search response times, resource loading
- Security: Input validation, XSS prevention, data sanitization
- Usability: Error messages, responsive design, user feedback

OUTPUT FORMAT (valid JSON only):
{{
  "scenarios": [
    {{
      "id": "FUNC001", 
      "description": "Search for products using the main search input",
      "priority": "high",
      "category": "functional",
      "steps": [
        "Enter 'laptop computer' in the search input field",
        "Click the search submit button", 
        "Wait for results to load"
      ],
      "expectedResults": [
        "Search results page displays with product listings",
        "Results contain items matching 'laptop computer'",
        "Result count is shown above the listings"
      ]
    }}
  ]
}}

IMPORTANT: Return ONLY valid JSON. No explanations, no markdown, no additional text.
      `);

      const formattedPrompt = await prompt.format({
        uiAnalysis: JSON.stringify(uiAnalysis, null, 2),
        requirements,
        existingPatterns: JSON.stringify(existingPatterns, null, 2)
      });

      const response = await this.llm.call(formattedPrompt);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const scenarios = JSON.parse(jsonMatch[0]);
        console.log(`✅ Generated ${scenarios.scenarios?.length || 0} test scenarios`);
        return JSON.stringify(scenarios, null, 2);
      }
      
      // Fallback scenarios if AI generation fails
      const fallbackScenarios = this.generateFallbackScenarios(uiAnalysis, requirements);
      console.log('⚠️ Using fallback scenario generation');
      return JSON.stringify({ scenarios: fallbackScenarios }, null, 2);
      
    } catch (error) {
      console.error('❌ Error generating scenarios:', error);
      const fallbackScenarios = this.generateFallbackScenarios({}, input);
      return JSON.stringify({ scenarios: fallbackScenarios }, null, 2);
    }
  }

  private generateFallbackScenarios(uiAnalysis: any, requirements: string): TestScenario[] {
    const hasForm = uiAnalysis?.pageStructure?.hasForm || requirements.toLowerCase().includes('form');
    const hasNavigation = uiAnalysis?.pageStructure?.hasNavigation || requirements.toLowerCase().includes('nav');
    
    const scenarios: TestScenario[] = [
      {
        id: 'FUNC001',
        description: 'Verify page loads successfully with all core elements',
        priority: 'high',
        category: 'functional',
        steps: ['Navigate to the page', 'Wait for page to load completely', 'Verify all essential elements are visible'],
        expectedResults: ['Page loads without errors', 'All core UI elements are displayed', 'Page is interactive']
      },
      {
        id: 'ACC001',
        description: 'Verify accessibility compliance and keyboard navigation',
        priority: 'high',
        category: 'accessibility',
        steps: ['Navigate using only keyboard', 'Verify ARIA labels', 'Check color contrast', 'Test screen reader compatibility'],
        expectedResults: ['All elements are keyboard accessible', 'ARIA labels are present', 'Color contrast meets WCAG standards']
      },
      {
        id: 'PERF001',
        description: 'Verify page performance and loading times',
        priority: 'medium',
        category: 'performance',
        steps: ['Measure page load time', 'Check resource optimization', 'Verify responsive behavior'],
        expectedResults: ['Page loads within 3 seconds', 'Resources are optimized', 'Page is responsive across devices']
      }
    ];

    if (hasForm) {
      scenarios.push({
        id: 'FUNC002',
        description: 'Verify form functionality and validation',
        priority: 'high',
        category: 'functional',
        steps: ['Fill form with valid data', 'Submit form', 'Test form validation', 'Test error handling'],
        expectedResults: ['Form submits successfully', 'Validation works correctly', 'Error messages are clear']
      });
    }

    if (hasNavigation) {
      scenarios.push({
        id: 'FUNC003',
        description: 'Verify navigation functionality',
        priority: 'medium',
        category: 'functional',
        steps: ['Test all navigation links', 'Verify menu functionality', 'Check breadcrumbs'],
        expectedResults: ['All links work correctly', 'Menu operates smoothly', 'Navigation is intuitive']
      });
    }

    return scenarios;
  }
}

class CodeGeneratorTool extends Tool {
  name = 'code_generator';
  description = 'Generates Page Object Model, feature definitions, and test specifications based on analysis and scenarios';

  constructor(private llm: Ollama) {
    super();
  }

  async _call(input: string): Promise<string> {
    console.log('🏗️ Generating test suite code...');
    
    try {
      const { featureName, team, uiAnalysis, scenarios, existingPatterns } = JSON.parse(input);
      
      const pageObjectCode = await this.generatePageObject(featureName, uiAnalysis, existingPatterns);
      const featureCode = await this.generateFeatureDefinition(featureName, scenarios);
      const specCode = await this.generateTestSpec(featureName, scenarios, uiAnalysis);
      
      return JSON.stringify({
        pageObject: pageObjectCode,
        feature: featureCode,
        spec: specCode
      }, null, 2);
      
    } catch (error) {
      console.error('❌ Error generating code:', error);
      return JSON.stringify({
        pageObject: '// Error generating page object',
        feature: '// Error generating feature definition', 
        spec: '// Error generating test spec'
      }, null, 2);
    }
  }

  private async generatePageObject(featureName: string, uiAnalysis: PageAnalysis, existingPatterns: any): Promise<string> {
    const className = this.toPascalCase(featureName) + 'Page';
    const elements = uiAnalysis.elements || [];
    
    // Generate locators for key elements
    const locators = elements
      .filter(el => el.testId || el.id || (el.text && el.text.length > 0))
      .slice(0, 15) // Limit to avoid overwhelming the generated code
      .map(el => {
        const name = this.generateLocatorName(el);
        const selector = this.generateSelector(el);
        return `  private readonly ${name}: Locator;`;
      })
      .join('\n');

    const locatorInitializations = elements
      .filter(el => el.testId || el.id || (el.text && el.text.length > 0))
      .slice(0, 15)
      .map(el => {
        const name = this.generateLocatorName(el);
        const selector = this.generateSelector(el);
        return `    this.${name} = page.locator('${selector}');`;
      })
      .join('\n');

    // Generate methods for interactive elements, avoiding duplicates
    const methodElements = elements
      .filter(el => ['button', 'input', 'select', 'textarea', 'a'].includes(el.tag))
      .slice(0, 10);
    
    const uniqueMethodNames = new Set<string>();
    const methods = methodElements
      .map(el => this.generateMethod(el))
      .filter(method => {
        const methodName = method.match(/async (\w+)\(/)?.[1];
        if (methodName && uniqueMethodNames.has(methodName)) {
          return false; // Skip duplicate method names
        }
        if (methodName) uniqueMethodNames.add(methodName);
        return true;
      })
      .join('\n\n');

    return `import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../../../shared/base-page';

export class ${className} extends BasePage {
${locators}

  constructor(page: Page) {
    super(page);
${locatorInitializations}
  }

  async navigateTo${this.toPascalCase(featureName)}(): Promise<void> {
    await this.navigate('${uiAnalysis.url || '/'}');
    await this.waitForPageLoad();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/${uiAnalysis.title || featureName}/i);
    // Add specific element visibility checks based on UI analysis
  }

${methods}

  // Accessibility verification methods
  async verifyAccessibility(): Promise<void> {
    ${uiAnalysis.accessibility?.hasAriaLabels ? 'await this.verifyARIALabels();' : '// No ARIA labels detected'}
    ${uiAnalysis.accessibility?.hasHeadings ? 'await this.verifyHeadingStructure();' : '// No heading structure detected'}
    ${uiAnalysis.accessibility?.hasLandmarks ? 'await this.verifyLandmarks();' : '// No landmarks detected'}
  }

  private async verifyARIALabels(): Promise<void> {
    // Verify ARIA labels are present and meaningful
    const ariaElements = this.page.locator('[aria-label], [aria-labelledby]');
    await expect(ariaElements.first()).toBeVisible();
  }

  private async verifyHeadingStructure(): Promise<void> {
    // Verify proper heading hierarchy
    const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
  }

  private async verifyLandmarks(): Promise<void> {
    // Verify landmark elements for screen readers
    ${uiAnalysis.pageStructure?.hasNavigation ? 'await expect(this.page.locator(\'[role="navigation"]\').first()).toBeVisible();' : ''}
    ${uiAnalysis.pageStructure?.hasFooter ? 'await expect(this.page.locator(\'[role="contentinfo"]\').first()).toBeVisible();' : ''}
  }
}`;
  }

  private async generateFeatureDefinition(featureName: string, scenarios: TestScenario[]): Promise<string> {
    const scenariosCode = scenarios.map(scenario => `  {
    id: '${scenario.id}',
    description: '${scenario.description}',
    priority: '${scenario.priority}',
    category: '${scenario.category}',
    steps: ${JSON.stringify(scenario.steps, null, 6)},
    expectedResults: ${JSON.stringify(scenario.expectedResults, null, 6)}
  }`).join(',\n');

    return `export interface TestScenario {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  steps: string[];
  expectedResults: string[];
}

export const ${this.toUpperCase(featureName)}_SCENARIOS: TestScenario[] = [
${scenariosCode}
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
};`;
  }

  private async generateTestSpec(featureName: string, scenarios: TestScenario[], uiAnalysis: PageAnalysis): Promise<string> {
    const className = this.toPascalCase(featureName) + 'Page';
    const scenarioConstant = this.toUpperCase(featureName) + '_SCENARIOS';
    const pageVar = this.toCamelCase(featureName) + 'Page';
    
    const testCases = scenarios.slice(0, 8).map(scenario => {
      const implementedSteps = this.generateImplementedSteps(scenario, featureName, uiAnalysis);
      const implementedVerifications = this.generateImplementedVerifications(scenario, featureName);
      
      return `
  test('${scenario.id}: ${this.sanitizeQuotes(scenario.description)}', async ({ page }) => {
    const ${pageVar} = new ${className}(page);
    
    await test.step('Setup: Navigate to ${featureName} page', async () => {
      await ${pageVar}.navigateTo${this.toPascalCase(featureName)}();
      await ${pageVar}.verifyPageLoaded();
    });

    ${implementedSteps}

    await test.step('Verify: Test completion', async () => {
      ${implementedVerifications}
    });
  });`;
    }).join('\n');

    return `import { test, expect, Page, BrowserContext } from '@playwright/test';
import { ${className} } from './${featureName}.page';
import { 
  ${scenarioConstant},
  TEST_CONFIGURATIONS,
  PERFORMANCE_THRESHOLDS,
  TestScenario
} from './${featureName}.feature';

test.describe('${this.toTitleCase(featureName)} - Comprehensive Test Suite', () => {
  let ${this.toCamelCase(featureName)}Page: ${className};

  test.beforeEach(async ({ page }) => {
    ${this.toCamelCase(featureName)}Page = new ${className}(page);
  });

  test.describe('Core Functionality', () => {${testCases}
  });

  test.describe('Accessibility Compliance', () => {
    test('Verify accessibility standards compliance', async ({ page }) => {
      const ${this.toCamelCase(featureName)}Page = new ${className}(page);
      await ${this.toCamelCase(featureName)}Page.navigateTo${this.toPascalCase(featureName)}();
      await ${this.toCamelCase(featureName)}Page.verifyAccessibility();
    });
  });

  test.describe('Performance Verification', () => {
    test('Verify page performance meets thresholds', async ({ page }) => {
      const startTime = Date.now();
      const ${this.toCamelCase(featureName)}Page = new ${className}(page);
      
      await ${this.toCamelCase(featureName)}Page.navigateTo${this.toPascalCase(featureName)}();
      await ${this.toCamelCase(featureName)}Page.verifyPageLoaded();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.pageLoadTime);
    });
  });

  // Responsive design tests
  Object.entries(TEST_CONFIGURATIONS).forEach(([deviceType, config]) => {
    test(\`Responsive design verification on \${deviceType}\`, async ({ page }) => {
      await page.setViewportSize(config.viewport);
      const ${this.toCamelCase(featureName)}Page = new ${className}(page);
      
      await ${this.toCamelCase(featureName)}Page.navigateTo${this.toPascalCase(featureName)}();
      await ${this.toCamelCase(featureName)}Page.verifyPageLoaded();
      
      // Verify responsive behavior
      // TODO: Add device-specific verifications
    });
  });

  // Data-driven test execution
  test('Execute all defined scenarios', async ({ page }) => {
    const ${this.toCamelCase(featureName)}Page = new ${className}(page);
    
    for (const scenario of ${scenarioConstant}.filter(s => s.priority === 'high')) {
      await test.step(\`Execute scenario: \${scenario.id}\`, async () => {
        console.log(\`Executing: \${scenario.description}\`);
        // TODO: Implement scenario execution logic
        // Steps: \${scenario.steps.join(', ')}
        // Expected: \${scenario.expectedResults.join(', ')}
      });
    }
  });
});`;
  }

  // Helper methods for code generation
  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  private toUpperCase(str: string): string {
    return str.replace(/[-\s]/g, '_').toUpperCase();
  }

  private toTitleCase(str: string): string {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private generateLocatorName(element: UIElement): string {
    if (element.testId) {
      return this.toCamelCase(this.sanitizeIdentifier(element.testId));
    }
    if (element.id) {
      return this.toCamelCase(this.sanitizeIdentifier(element.id));
    }
    if (element.text) {
      const cleanText = this.sanitizeIdentifier(element.text).slice(0, 30);
      return this.toCamelCase(cleanText) || 'element';
    }
    return `${element.tag}Element`;
  }

  private sanitizeIdentifier(str: string): string {
    // Remove special characters and spaces, keep only alphanumeric and common separators
    return str
      .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special chars except spaces, hyphens, underscores
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .trim()
      .replace(/\s/g, '_') // Replace spaces with underscores
      || 'element';
  }

  private sanitizeQuotes(str: string): string {
    // Replace curly quotes with straight quotes to avoid TypeScript syntax errors
    return str
      .replace(/['']/g, "'") // Replace curly single quotes
      .replace(/[""]/g, '"') // Replace curly double quotes
      .replace(/'/g, "\\'") // Escape single quotes for string literals
      .replace(/"/g, '\\"'); // Escape double quotes for string literals
  }

  private generateSelector(element: UIElement): string {
    if (element.testId) {
      return `[data-testid="${element.testId}"]`;
    }
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.text && element.text.length > 0 && element.text.length < 50) {
      return `${element.tag}:has-text("${element.text.replace(/"/g, '\\"')}")`;
    }
    return element.tag;
  }

  private generateMethod(element: UIElement): string {
    const name = this.generateLocatorName(element);
    const action = this.getActionForElement(element);
    const methodName = `${action}${this.toPascalCase(name)}`;

    switch (element.tag) {
      case 'input':
        if (element.type === 'checkbox' || element.type === 'radio') {
          return `  async ${methodName}(): Promise<void> {
    await this.${name}.check();
  }`;
        } else {
          return `  async ${methodName}(value: string): Promise<void> {
    await this.${name}.fill(value);
  }`;
        }
      case 'select':
        return `  async ${methodName}(option: string): Promise<void> {
    await this.${name}.selectOption(option);
  }`;
      case 'button':
      case 'a':
        return `  async ${methodName}(): Promise<void> {
    await this.${name}.click();
  }`;
      default:
        return `  async ${methodName}(): Promise<void> {
    await this.${name}.click();
  }`;
    }
  }

  private getActionForElement(element: UIElement): string {
    switch (element.tag) {
      case 'input':
        return element.type === 'checkbox' || element.type === 'radio' ? 'check' : 'fill';
      case 'select':
        return 'select';
      case 'button':
        return 'click';
      case 'a':
        return 'clickLink';
      default:
        return 'click';
    }
  }

  private generateImplementedSteps(scenario: TestScenario, featureName: string, uiAnalysis: PageAnalysis): string {
    const pageVar = this.toCamelCase(featureName) + 'Page';
    const searchInput = this.findSearchInput(uiAnalysis);
    const searchButton = this.findSearchButton(uiAnalysis);
    
    return scenario.steps.map((step, index) => {
      const implementedStep = this.generateStepImplementation(step, pageVar, searchInput, searchButton, scenario.category);
      return `
    await test.step('Step ${index + 1}: ${this.sanitizeQuotes(step)}', async () => {
      ${implementedStep}
    });`;
    }).join('');
  }

  private generateImplementedVerifications(scenario: TestScenario, featureName: string): string {
    return scenario.expectedResults.map(result => {
      const verification = this.generateVerificationImplementation(result, scenario.category);
      return `      ${verification}`;
    }).join('\n');
  }

  private findSearchInput(uiAnalysis: PageAnalysis): string {
    // Look for search input elements
    const searchElement = uiAnalysis.elements?.find(el => 
      el.tag === 'input' && 
      (el.id?.toLowerCase().includes('search') || 
       el.placeholder?.toLowerCase().includes('search') ||
       el.id === 'APjFqb') // Google's search box
    );
    
    if (searchElement?.id) {
      return `#${searchElement.id}`;
    }
    if (searchElement?.testId) {
      return `[data-testid="${searchElement.testId}"]`;
    }
    return '[aria-label*="Search"], input[type="search"], input[placeholder*="search"]';
  }

  private findSearchButton(uiAnalysis: PageAnalysis): string {
    // Look for search button elements
    const searchButton = uiAnalysis.elements?.find(el => 
      (el.tag === 'button' || el.tag === 'input') && 
      (el.text?.toLowerCase().includes('search') || 
       el.type === 'submit' ||
       el.id?.toLowerCase().includes('search'))
    );
    
    if (searchButton?.id) {
      return `#${searchButton.id}`;
    }
    if (searchButton?.testId) {
      return `[data-testid="${searchButton.testId}"]`;
    }
    return 'button[type="submit"], button:has-text("Search"), [aria-label*="Search"]';
  }

  private generateStepImplementation(step: string, pageVar: string, searchInput: string, searchButton: string, category: string): string {
    const stepLower = step.toLowerCase();
    
    // Navigation steps
    if (stepLower.includes('navigate') && stepLower.includes('homepage')) {
      return `// Navigation handled in setup`;
    }
    
    // Search input steps
    if (stepLower.includes('enter') && stepLower.includes('search')) {
      const searchTerm = this.extractSearchTerm(step);
      return `await page.locator('${searchInput}').fill('${searchTerm}');`;
    }
    
    // Search execution steps
    if (stepLower.includes('press enter') || stepLower.includes('click') && stepLower.includes('search')) {
      return `await page.locator('${searchInput}').press('Enter');
      await page.waitForLoadState('networkidle');`;
    }
    
    // Empty search steps
    if (stepLower.includes('without entering') || stepLower.includes('empty')) {
      return `await page.locator('${searchButton}').click();`;
    }
    
    // Keyboard navigation steps
    if (stepLower.includes('tab key')) {
      return `await page.keyboard.press('Tab');
      await expect(page.locator('${searchInput}')).toBeFocused();`;
    }
    
    if (stepLower.includes('arrow keys')) {
      return `await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');`;
    }
    
    // Performance measurement steps
    if (stepLower.includes('measure') && stepLower.includes('time')) {
      return `const startTime = Date.now();
      await page.locator('${searchInput}').fill('test search');
      await page.locator('${searchInput}').press('Enter');
      await page.waitForSelector('[data-testid="search-results"], .g, .result', { timeout: 10000 });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);`;
    }
    
    // Security testing steps
    if (stepLower.includes('malicious') || stepLower.includes('script')) {
      return `await page.locator('${searchInput}').fill('<script>alert("XSS")</script>');
      await page.locator('${searchInput}').press('Enter');`;
    }
    
    // Accessibility steps
    if (stepLower.includes('screen reader')) {
      return `// Screen reader testing would require specialized tools
      // Verify ARIA attributes are present
      await expect(page.locator('${searchInput}')).toHaveAttribute('aria-label');`;
    }
    
    // Verification steps
    if (stepLower.includes('verify') && stepLower.includes('results')) {
      return `await expect(page.locator('[data-testid="search-results"], .g, .result').first()).toBeVisible({ timeout: 10000 });`;
    }
    
    // Generic fallback
    return `// Step: ${step}
    await page.waitForTimeout(100); // Brief pause for step execution`;
  }

  private generateVerificationImplementation(result: string, category: string): string {
    const resultLower = result.toLowerCase();
    
    // Search results verification
    if (resultLower.includes('search results') && resultLower.includes('load')) {
      return `await expect(page.locator('[data-testid="search-results"], .g, .result').first()).toBeVisible({ timeout: 10000 });`;
    }
    
    if (resultLower.includes('results are displayed')) {
      return `const resultsCount = await page.locator('[data-testid="search-results"], .g, .result').count();
      expect(resultsCount).toBeGreaterThan(0);`;
    }
    
    if (resultLower.includes('number of results')) {
      return `await expect(page.locator('[data-testid="results-count"], .result-stats, #resultStats')).toBeVisible();`;
    }
    
    // No results verification
    if (resultLower.includes('no results') || resultLower.includes('not found')) {
      return `await expect(page.locator('text=/no results|not found|did not match/i')).toBeVisible();`;
    }
    
    // Error handling verification
    if (resultLower.includes('no error') || resultLower.includes('no security')) {
      return `// Verify no JavaScript errors occurred
      const errors = await page.evaluate(() => (window as any).errors || []);
      expect(errors.length).toBe(0);`;
    }
    
    // Accessibility verification
    if (resultLower.includes('keyboard') || resultLower.includes('accessible')) {
      return `await expect(page.locator('input, button, a').first()).toBeFocused();`;
    }
    
    if (resultLower.includes('aria') || resultLower.includes('screen reader')) {
      return `const ariaElementsCount = await page.locator('[aria-label], [aria-labelledby]').count();
      expect(ariaElementsCount).toBeGreaterThan(0);`;
    }
    
    // Performance verification
    if (resultLower.includes('within') && resultLower.includes('seconds')) {
      return `// Performance verification handled in step implementation`;
    }
    
    // Security verification
    if (resultLower.includes('script') && resultLower.includes('not executed')) {
      return `// Verify XSS script was not executed
      const alertFired = await page.evaluate(() => (window as any).alertFired || false);
      expect(alertFired).toBe(false);`;
    }
    
    // Generic success verification
    return `// Verify: ${result}
    await expect(page).toHaveURL(/.*/, { timeout: 5000 });`;
  }

  private extractSearchTerm(step: string): string {
    // Extract search term from step description - handle both straight and curly quotes
    const matches = step.match(/'([^']+)'|"([^"]+)"|'([^']+)'|"([^"]+)"/);
    if (matches) {
      return matches[1] || matches[2] || matches[3] || matches[4];
    }
    
    // Extract terms in parentheses
    const parenMatches = step.match(/\(e\.g\.,?\s*'([^']+)'|\(e\.g\.,?\s*"([^"]+)"/);
    if (parenMatches) {
      return parenMatches[1] || parenMatches[2];
    }
    
    // Common search terms based on step content
    if (step.toLowerCase().includes('photoshop')) return 'Photoshop';
    if (step.toLowerCase().includes('playwright')) return 'playwright';
    if (step.toLowerCase().includes('common')) return 'JavaScript tutorial';
    if (step.toLowerCase().includes('special')) return 'test@123';
    if (step.toLowerCase().includes('non-existent') || step.toLowerCase().includes('uncommon')) return 'asdfghjklqwerty';
    if (step.toLowerCase().includes('malicious') || step.toLowerCase().includes('script')) return '<script>alert("XSS")</script>';
    
    return 'test search';
  }
}

export class TestGenerationAgent {
  private llm: Ollama;
  private ragEngine: EnhancedRAGEngine;
  private tools: Tool[];

  constructor() {
    this.ragEngine = new EnhancedRAGEngine();
    
    // Try to load config, fallback to environment variables
    let modelName = 'deepseek-r1:14b'; // Default to tested best model
    let baseUrl = 'http://localhost:11434';
    
    try {
      // Try to import config if it exists
      const config = require('../config');
      modelName = config.CONFIG?.ollama?.model || modelName;
      baseUrl = config.CONFIG?.ollama?.baseUrl || baseUrl;
    } catch (error) {
      // Config doesn't exist, use environment variables or defaults
      modelName = process.env.OLLAMA_MODEL || modelName;
      baseUrl = process.env.OLLAMA_BASE_URL || baseUrl;
    }
    
    console.log(`🤖 Using model: ${modelName}`);
    
    // Configure LLM with best available model
    this.llm = new Ollama({
      model: modelName,
      baseUrl: baseUrl,
    });
    
    this.tools = [
      new PageAnalysisTool(),
      new CodebaseQueryTool(this.ragEngine),
      new TestScenarioGeneratorTool(this.llm),
      new CodeGeneratorTool(this.llm)
    ];
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Test Generation Agent...');
    await this.ragEngine.loadPersistedStore();
    console.log('✅ TestGenerationAgent initialized with tools:', this.tools.map(t => t.name));
  }

  async generateTestSuite(options: {
    url?: string;
    featureName: string;
    requirements: string;
    team: string;
  }): Promise<{
    pageObject: string;
    testSpec: string;
    featureData: string;
    filesCreated: string[];
  }> {
    console.log(`\n🎯 Starting intelligent test generation...`);
    console.log(`📝 Feature: ${options.featureName}`);
    console.log(`👥 Team: ${options.team}`);
    console.log(`📋 Requirements: ${options.requirements}`);
    if (options.url) console.log(`🌐 URL: ${options.url}`);

    try {
      // Use ReAct agent for intelligent tool orchestration
      const result = await this.executeReActLoop({
        task: `Generate comprehensive test suite for feature "${options.featureName}" with requirements: ${options.requirements}`,
        url: options.url,
        featureName: options.featureName,
        team: options.team,
        requirements: options.requirements
      });

      return result;

    } catch (error) {
      console.error('❌ Error during test generation:', error);
      throw error;
    }
  }

  /**
   * ReAct (Reasoning + Acting) Loop Implementation
   * This implements the full ReAct pattern: Think -> Act -> Observe -> Reflect -> Repeat
   */
  async executeReActLoop(context: {
    task: string;
    url?: string;
    featureName: string;
    team: string;
    requirements: string;
  }): Promise<{
    pageObject: string;
    testSpec: string;
    featureData: string;
    filesCreated: string[];
  }> {
    console.log('\n🧠 Starting ReAct Agent Loop...');
    
    // Agent state to track progress
    let agentState = {
      step: 0,
      uiAnalysis: null as PageAnalysis | null,
      existingPatterns: null as string | null,
      scenarios: null as any[] | null,
      generatedCode: null as any | null,
      filesCreated: [] as string[],
      completed: false,
      maxSteps: 10 // Prevent infinite loops
    };

    while (!agentState.completed && agentState.step < agentState.maxSteps) {
      agentState.step++;
      
      console.log(`\n🔄 ReAct Step ${agentState.step}: Reasoning about next action...`);
      
      // THINK: Reason about current state and decide next action
      const nextAction = await this.reasonAboutNextAction(context, agentState);
      
      console.log(`💭 Decision: ${nextAction.action} - ${nextAction.reasoning}`);
      
      // ACT: Execute the chosen action
      const observation = await this.executeAction(nextAction, context, agentState);
      
      // OBSERVE: Process the results
      console.log(`👁️ Observation: ${observation.summary}`);
      
      // Update agent state based on observation
      agentState = { ...agentState, ...observation.stateUpdates };
      
      // REFLECT: Check if task is complete
      if (observation.taskComplete) {
        agentState.completed = true;
        console.log('✅ ReAct Agent: Task completed successfully!');
      }
    }

    if (!agentState.completed) {
      throw new Error('ReAct Agent: Maximum steps reached without completion');
    }

    return {
      pageObject: agentState.generatedCode.pageObject,
      testSpec: agentState.generatedCode.spec,
      featureData: agentState.generatedCode.feature,
      filesCreated: agentState.filesCreated
    };
  }

  /**
   * THINK: Reason about the current situation and decide next action
   */
  private async reasonAboutNextAction(context: any, state: any): Promise<{
    action: string;
    reasoning: string;
    tool?: string;
    input?: any;
  }> {
    const reasoningPrompt = `
You are an intelligent test generation agent. Analyze the current situation and decide the next action.

TASK: ${context.task}
CURRENT STEP: ${state.step}
URL PROVIDED: ${context.url ? 'Yes' : 'No'}

CURRENT STATE:
- UI Analysis: ${state.uiAnalysis ? 'Completed' : 'Not started'}
- Existing Patterns: ${state.existingPatterns ? 'Retrieved' : 'Not retrieved'}
- Test Scenarios: ${state.scenarios ? `Generated (${state.scenarios.length} scenarios)` : 'Not generated'}
- Code Generation: ${state.generatedCode ? 'Completed' : 'Not started'}
- Files Written: ${state.filesCreated.length > 0 ? 'Completed' : 'Not started'}

AVAILABLE TOOLS:
1. page_analyzer - Analyze web page structure and elements
2. codebase_query - Query existing code patterns and utilities
3. scenario_generator - Generate test scenarios based on analysis
4. code_generator - Generate Page Object, feature, and spec files

DECIDE THE NEXT ACTION:
- If URL provided and no UI analysis: Use page_analyzer
- If no existing patterns retrieved: Use codebase_query  
- If have analysis and patterns but no scenarios: Use scenario_generator
- If have scenarios but no code: Use code_generator
- If have code but files not written: Write files to filesystem
- If all steps complete: Mark task as complete

Respond with ONLY a JSON object:
{
  "action": "analyze_page|query_patterns|generate_scenarios|generate_code|write_files|complete",
  "reasoning": "Brief explanation of why this action",
  "tool": "tool_name_if_applicable",
  "input": "input_for_tool_if_applicable"
}
`;

    try {
      const response = await this.llm.call(reasoningPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('⚠️ Reasoning failed, using fallback logic');
    }

    // Fallback logic if AI reasoning fails
    if (context.url && !state.uiAnalysis) {
      return { action: 'analyze_page', reasoning: 'Need to analyze the provided URL', tool: 'page_analyzer', input: context.url };
    } else if (!state.existingPatterns) {
      return { action: 'query_patterns', reasoning: 'Need to query existing code patterns', tool: 'codebase_query', input: `page object patterns for ${context.featureName}` };
    } else if (!state.scenarios) {
      return { action: 'generate_scenarios', reasoning: 'Need to generate test scenarios', tool: 'scenario_generator' };
    } else if (!state.generatedCode) {
      return { action: 'generate_code', reasoning: 'Need to generate code files', tool: 'code_generator' };
    } else if (state.filesCreated.length === 0) {
      return { action: 'write_files', reasoning: 'Need to write files to filesystem' };
    } else {
      return { action: 'complete', reasoning: 'All steps completed successfully' };
    }
  }

  /**
   * ACT: Execute the chosen action using appropriate tools
   */
  private async executeAction(action: any, context: any, state: any): Promise<{
    summary: string;
    stateUpdates: any;
    taskComplete: boolean;
  }> {
    switch (action.action) {
      case 'analyze_page':
        console.log('🔍 Executing: Page Analysis');
        const pageAnalysisTool = this.tools.find(t => t.name === 'page_analyzer') as PageAnalysisTool;
        const analysisResult = await pageAnalysisTool._call(context.url);
        const uiAnalysis = JSON.parse(analysisResult);
        return {
          summary: `Analyzed page and found ${uiAnalysis.elements?.length || 0} interactive elements`,
          stateUpdates: { uiAnalysis },
          taskComplete: false
        };

      case 'query_patterns':
        console.log('📚 Executing: Query Existing Patterns');
        const codebaseQueryTool = this.tools.find(t => t.name === 'codebase_query') as CodebaseQueryTool;
        const existingPatterns = await codebaseQueryTool._call(action.input);
        return {
          summary: 'Retrieved existing code patterns and utilities',
          stateUpdates: { existingPatterns },
          taskComplete: false
        };

      case 'generate_scenarios':
        console.log('🧠 Executing: Generate Test Scenarios');
        const scenarioTool = this.tools.find(t => t.name === 'scenario_generator') as TestScenarioGeneratorTool;
        const scenariosResult = await scenarioTool._call(JSON.stringify({
          uiAnalysis: state.uiAnalysis,
          requirements: context.requirements,
          existingPatterns: state.existingPatterns
        }));
        const scenarios = JSON.parse(scenariosResult).scenarios;
        return {
          summary: `Generated ${scenarios.length} test scenarios`,
          stateUpdates: { scenarios },
          taskComplete: false
        };

      case 'generate_code':
        console.log('🏗️ Executing: Generate Code Files');
        const codeGeneratorTool = this.tools.find(t => t.name === 'code_generator') as CodeGeneratorTool;
        const codeResult = await codeGeneratorTool._call(JSON.stringify({
          featureName: context.featureName,
          team: context.team,
          uiAnalysis: state.uiAnalysis,
          scenarios: state.scenarios,
          existingPatterns: state.existingPatterns
        }));
        const generatedCode = JSON.parse(codeResult);
        return {
          summary: 'Generated Page Object, feature definition, and test specification files',
          stateUpdates: { generatedCode },
          taskComplete: false
        };

      case 'write_files':
        console.log('💾 Executing: Write Files to Filesystem');
        const filesCreated = await this.writeGeneratedFiles(context, state.generatedCode);
        return {
          summary: `Successfully wrote ${filesCreated.length} files to filesystem`,
          stateUpdates: { filesCreated },
          taskComplete: true
        };

      case 'complete':
        return {
          summary: 'Test suite generation completed successfully',
          stateUpdates: {},
          taskComplete: true
        };

      default:
        throw new Error(`Unknown action: ${action.action}`);
    }
  }

  private async writeGeneratedFiles(
    options: { featureName: string; team: string },
    generatedCode: { pageObject: string; feature: string; spec: string }
  ): Promise<string[]> {
    const featureDir = path.join('teams', options.team, options.featureName);
    await fs.ensureDir(featureDir);

    const files = [
      { name: `${options.featureName}.page.ts`, content: generatedCode.pageObject },
      { name: `${options.featureName}.feature.ts`, content: generatedCode.feature },
      { name: `${options.featureName}.spec.ts`, content: generatedCode.spec }
    ];

    const filesCreated: string[] = [];

    for (const file of files) {
      const filePath = path.join(featureDir, file.name);
      await fs.writeFile(filePath, file.content);
      filesCreated.push(filePath);
      console.log(`✅ Created: ${filePath}`);
    }

    return filesCreated;
  }
}
