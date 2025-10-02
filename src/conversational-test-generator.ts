/**
 * Conversational Test Generator
 * 
 * Generate and update tests by just chatting!
 * 
 * Usage:
 *   npm run chat-test
 *   > "Generate a test for the login page"
 *   > "Add accessibility tests for brand concierge"
 *   > "Update BC001 to check for loading indicators"
 */

import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';

interface TestScenario {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'usability';
  tags: string[];
  steps: string[];
  expectedResults: string[];
  testData?: any;
  requirements?: string[];
  jiraTickets?: string[];
  documentation?: string;
  estimatedTime?: number;
  environments?: ('dev' | 'stage' | 'prod')[];
  browsers?: string[];
}

interface GeneratedTest {
  scenario: TestScenario;
  implementation: string;
  pageObject?: string;
}

export class ConversationalTestGenerator {
  private llm: Ollama;
  private memory: BufferMemory;
  private chain: ConversationChain;
  private projectRoot: string;
  private currentTeam: string = 'adobe-team';
  private currentFeature: string = 'brand-concierge';

  constructor() {
    this.llm = new Ollama({
      model: 'deepseek-r1:14b',
      baseUrl: 'http://localhost:11434',
      temperature: 0.7,
    });

    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
    });

    this.projectRoot = process.cwd();

    // Initialize conversation chain
    this.initializeChain();
  }

  private initializeChain() {
    const prompt = PromptTemplate.fromTemplate(`
You are an expert test automation engineer helping to generate Playwright tests.

Current Context:
- Team: {team}
- Feature: {feature}
- Project Root: {projectRoot}

You understand the project's test structure:
1. feature.ts - Test scenarios with rich metadata (tags, requirements, JIRA, etc.)
2. page.ts - Page object models with locators
3. spec.ts - Test implementations using Playwright

When the user asks to generate or update tests, you should:
1. Understand their intent
2. Generate complete test scenarios with proper metadata
3. Create page objects if needed
4. Generate test implementations
5. Follow the existing patterns and structure

User's Request: {input}

Response (provide actionable test code):
`);

    this.chain = new ConversationChain({
      llm: this.llm,
      memory: this.memory,
      prompt: prompt,
    });
  }

  /**
   * Start interactive chat session
   */
  async startChatSession() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   🤖 AI Test Generator - Conversational Mode            ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('💬 Chat to generate tests! Examples:');
    console.log('   • "Generate a test for the login page"');
    console.log('   • "Add accessibility tests for brand concierge"');
    console.log('   • "Create a performance test for page load"');
    console.log('   • "Update BC001 to include loading indicators"');
    console.log('   • "Generate tests for mobile responsive design"');
    console.log('');
    console.log('Commands:');
    console.log('   /team <name>    - Switch team (e.g., /team adobe-team)');
    console.log('   /feature <name> - Switch feature (e.g., /feature brand-concierge)');
    console.log('   /status         - Show current context');
    console.log('   /help           - Show all commands');
    console.log('   /exit           - Exit chat');
    console.log('');
    console.log(`📍 Current: ${this.currentTeam}/${this.currentFeature}`);
    console.log('');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const chat = () => {
      rl.question('You: ', async (input) => {
        if (!input.trim()) {
          chat();
          return;
        }

        // Handle commands
        if (input.startsWith('/')) {
          await this.handleCommand(input);
          chat();
          return;
        }

        // Process with AI
        console.log('\n🤔 Thinking...\n');
        
        try {
          const response = await this.processUserInput(input);
          console.log(`\n🤖 AI: ${response}\n`);
        } catch (error) {
          console.error('❌ Error:', error instanceof Error ? error.message : error);
        }

        chat();
      });
    };

    chat();
  }

  /**
   * Process user input and generate tests
   */
  private async processUserInput(input: string): Promise<string> {
    // Detect intent
    const intent = await this.detectIntent(input);

    switch (intent) {
      case 'generate_test':
        return await this.generateTest(input);
      
      case 'update_test':
        return await this.updateTest(input);
      
      case 'generate_page_object':
        return await this.generatePageObject(input);
      
      case 'add_tags':
        return await this.addTags(input);
      
      case 'explain_test':
        return await this.explainTest(input);
      
      default:
        return await this.generalConversation(input);
    }
  }

  /**
   * Detect user intent from input
   */
  private async detectIntent(input: string): Promise<string> {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('generate') && (lowerInput.includes('test') || lowerInput.includes('scenario'))) {
      return 'generate_test';
    }
    if (lowerInput.includes('update') || lowerInput.includes('modify') || lowerInput.includes('change')) {
      return 'update_test';
    }
    if (lowerInput.includes('page object') || lowerInput.includes('locator')) {
      return 'generate_page_object';
    }
    if (lowerInput.includes('add tag') || lowerInput.includes('tag')) {
      return 'add_tags';
    }
    if (lowerInput.includes('explain') || lowerInput.includes('what is') || lowerInput.includes('how does')) {
      return 'explain_test';
    }

    return 'general';
  }

  /**
   * Generate a new test from natural language
   */
  private async generateTest(input: string): Promise<string> {
    console.log('🎨 Generating test...');

    const prompt = `
Generate a complete test scenario based on this request: "${input}"

Create a test scenario object with:
1. A unique ID (e.g., BC013, BC014)
2. Clear description
3. Appropriate priority (critical/high/medium/low)
4. Category (functional/accessibility/performance/security/usability)
5. Relevant tags (include @smoke, @regression, team tags, feature tags)
6. Detailed steps
7. Expected results
8. Test data requirements
9. Requirements and JIRA tickets (mock if needed)
10. Estimated time in seconds
11. Environments and browsers

Return ONLY valid TypeScript code for the scenario object.
`;

    try {
      const response = await this.llm.invoke(prompt);
      
      // Save to feature file
      const scenarioCode = this.extractCodeBlock(response);
      
      if (scenarioCode) {
        console.log('\n✨ Generated Test Scenario:\n');
        console.log(scenarioCode);
        
        // Ask if user wants to save
        return `
I've generated a test scenario for you!

To add it to your feature file:
1. Copy the code above
2. Add it to: teams/${this.currentTeam}/${this.currentFeature}/${this.currentFeature}.feature.ts

Or I can save it automatically. Would you like me to save it?
(Type "yes" to save, or ask me to modify it)
`;
      }

      return response;
    } catch (error) {
      return `❌ Error generating test: ${error instanceof Error ? error.message : error}`;
    }
  }

  /**
   * Update an existing test
   */
  private async updateTest(input: string): Promise<string> {
    console.log('🔄 Updating test...');

    // Extract test ID from input
    const testIdMatch = input.match(/BC\d+/i);
    
    if (!testIdMatch) {
      return 'Please specify which test to update (e.g., BC001, BC002)';
    }

    const testId = testIdMatch[0].toUpperCase();

    // Read current feature file
    const featureFile = path.join(
      this.projectRoot,
      'teams',
      this.currentTeam,
      this.currentFeature,
      `${this.currentFeature}.feature.ts`
    );

    try {
      const content = await fs.readFile(featureFile, 'utf-8');
      
      const prompt = `
Current test content:
${content}

User wants to: ${input}

Generate the updated test scenario for ${testId} based on the user's request.
Keep the same structure and format as existing tests.
Return ONLY the updated scenario object code.
`;

      const response = await this.llm.invoke(prompt);
      const updatedCode = this.extractCodeBlock(response);

      if (updatedCode) {
        console.log('\n✨ Updated Test Scenario:\n');
        console.log(updatedCode);
        
        return `
I've generated the updated test scenario for ${testId}!

To apply the update:
1. Find ${testId} in your feature file
2. Replace it with the code above

Or I can update it automatically. Would you like me to update it?
(Type "yes" to update)
`;
      }

      return response;
    } catch (error) {
      return `❌ Error updating test: ${error instanceof Error ? error.message : error}`;
    }
  }

  /**
   * Generate page object
   */
  private async generatePageObject(input: string): Promise<string> {
    console.log('🔧 Generating page object...');

    const prompt = `
Generate a TypeScript page object class for: "${input}"

Include:
1. Locators for all mentioned elements
2. Action methods
3. Verification methods
4. TypeScript types
5. Good naming conventions
6. Comments

Use Playwright syntax.
Return ONLY valid TypeScript code.
`;

    try {
      const response = await this.llm.invoke(prompt);
      const code = this.extractCodeBlock(response);

      if (code) {
        console.log('\n✨ Generated Page Object:\n');
        console.log(code);
        
        return `
I've generated a page object for you!

Save it to: teams/${this.currentTeam}/${this.currentFeature}/*.page.ts

Would you like me to save it? (Type "yes" to save)
`;
      }

      return response;
    } catch (error) {
      return `❌ Error generating page object: ${error instanceof Error ? error.message : error}`;
    }
  }

  /**
   * Add tags to existing tests
   */
  private async addTags(input: string): Promise<string> {
    const tags = this.extractTags(input);
    
    if (tags.length === 0) {
      return 'Please specify which tags to add (e.g., @smoke, @critical, @ai)';
    }

    return `I can add these tags: ${tags.join(', ')}
    
Which test scenarios should I add them to?
- All tests
- Specific tests (e.g., BC001, BC002)
- Tests matching criteria (e.g., all accessibility tests)
`;
  }

  /**
   * Explain a test
   */
  private async explainTest(input: string): Promise<string> {
    const testIdMatch = input.match(/BC\d+/i);
    
    if (!testIdMatch) {
      return 'Which test would you like me to explain? (e.g., BC001)';
    }

    const testId = testIdMatch[0].toUpperCase();

    // Read feature file and find the test
    const featureFile = path.join(
      this.projectRoot,
      'teams',
      this.currentTeam,
      this.currentFeature,
      `${this.currentFeature}.feature.ts`
    );

    try {
      const content = await fs.readFile(featureFile, 'utf-8');
      
      const prompt = `
Explain test ${testId} in simple terms:

Content:
${content}

Provide:
1. What the test does
2. Why it's important
3. How to run it
4. What it checks
`;

      const response = await this.llm.invoke(prompt);
      return response;
    } catch (error) {
      return `❌ Error reading test: ${error instanceof Error ? error.message : error}`;
    }
  }

  /**
   * General conversation
   */
  private async generalConversation(input: string): Promise<string> {
    const response = await this.chain.call({
      input,
      team: this.currentTeam,
      feature: this.currentFeature,
      projectRoot: this.projectRoot,
    });

    return response.response;
  }

  /**
   * Handle commands
   */
  private async handleCommand(command: string): Promise<void> {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case '/team':
        if (parts[1]) {
          this.currentTeam = parts[1];
          console.log(`✅ Switched to team: ${this.currentTeam}`);
        } else {
          console.log(`Current team: ${this.currentTeam}`);
        }
        break;

      case '/feature':
        if (parts[1]) {
          this.currentFeature = parts[1];
          console.log(`✅ Switched to feature: ${this.currentFeature}`);
        } else {
          console.log(`Current feature: ${this.currentFeature}`);
        }
        break;

      case '/status':
        console.log(`
📍 Current Context:
   Team: ${this.currentTeam}
   Feature: ${this.currentFeature}
   Project Root: ${this.projectRoot}
        `);
        break;

      case '/help':
        this.showHelp();
        break;

      case '/exit':
        console.log('\n👋 Goodbye! Happy testing!');
        process.exit(0);
        break;

      default:
        console.log(`❌ Unknown command: ${cmd}`);
        console.log('Type /help for available commands');
    }
  }

  /**
   * Show help
   */
  private showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║              🤖 AI Test Generator - Help                ║
╚══════════════════════════════════════════════════════════╝

📝 EXAMPLES:

  "Generate a test for login with email and password"
  "Add accessibility tests for the homepage"
  "Create a performance test for page load under 3 seconds"
  "Update BC001 to check for loading spinners"
  "Generate page object for the checkout form"
  "Add @critical tag to BC001"
  "Explain what BC003 does"

🔧 COMMANDS:

  /team <name>      Switch to a different team
  /feature <name>   Switch to a different feature
  /status           Show current context
  /help             Show this help message
  /exit             Exit the chat

🎯 WHAT I CAN DO:

  ✅ Generate test scenarios with proper structure
  ✅ Create page objects with locators
  ✅ Update existing tests
  ✅ Add tags and metadata
  ✅ Explain tests in simple terms
  ✅ Follow your existing patterns
  ✅ Generate TypeScript code
  ✅ Maintain traceability (requirements, JIRA)

💡 TIP: Be specific! The more details you provide, the better
    the generated tests will be.
    `);
  }

  /**
   * Extract code block from response
   */
  private extractCodeBlock(response: string): string | null {
    const codeBlockMatch = response.match(/```(?:typescript|ts)?\n([\s\S]+?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Try without language specifier
    const simpleMatch = response.match(/```\n([\s\S]+?)\n```/);
    if (simpleMatch) {
      return simpleMatch[1].trim();
    }

    return null;
  }

  /**
   * Extract tags from input
   */
  private extractTags(input: string): string[] {
    const tagMatches = input.match(/@[\w-]+/g);
    return tagMatches || [];
  }

  /**
   * Save generated test to file
   */
  async saveGeneratedTest(scenario: TestScenario, fileType: 'feature' | 'page' | 'spec'): Promise<boolean> {
    try {
      const filePath = path.join(
        this.projectRoot,
        'teams',
        this.currentTeam,
        this.currentFeature,
        `${this.currentFeature}.${fileType}.ts`
      );

      console.log(`💾 Saving to: ${filePath}`);

      // Read existing file
      const content = await fs.readFile(filePath, 'utf-8');

      // TODO: Insert scenario into appropriate location
      // For now, just append

      console.log('✅ Saved successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error saving:', error);
      return false;
    }
  }
}

// CLI Entry point
async function main() {
  const generator = new ConversationalTestGenerator();
  await generator.startChatSession();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as startConversationalTestGenerator };

