#!/usr/bin/env node
/**
 * Simple CLI Test Generator
 * 
 * Quick test generation without interactive chat
 * 
 * Usage:
 *   npm run ai-generate "test for login page"
 *   npm run ai-generate "accessibility test for homepage"
 *   npm run ai-generate "performance test checking page load under 3 seconds"
 */

import { Ollama } from '@langchain/community/llms/ollama';
import fs from 'fs-extra';
import path from 'path';

const FEATURE_TEMPLATE = `
export const NEW_TEST_SCENARIO = {
  id: '{{ID}}',
  description: '{{DESCRIPTION}}',
  priority: '{{PRIORITY}}' as 'critical' | 'high' | 'medium' | 'low',
  category: '{{CATEGORY}}' as 'functional' | 'accessibility' | 'performance' | 'security' | 'usability',
  tags: {{TAGS}},
  
  steps: {{STEPS}},
  
  expectedResults: {{EXPECTED_RESULTS}},
  
  testData: {{TEST_DATA}},
  
  requirements: {{REQUIREMENTS}},
  jiraTickets: {{JIRA_TICKETS}},
  documentation: '{{DOCUMENTATION}}',
  estimatedTime: {{ESTIMATED_TIME}},
  environments: {{ENVIRONMENTS}},
  browsers: {{BROWSERS}},
};
`;

async function generateQuickTest(description: string) {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║        🤖 AI Test Generator - Quick Mode                ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`📝 Generating test for: "${description}"\n`);
  console.log('🤔 Thinking...\n');

  const llm = new Ollama({
    model: 'deepseek-r1:14b',
    baseUrl: 'http://localhost:11434',
    temperature: 0.7,
  });

  const prompt = `
You are an expert test automation engineer. Generate a complete test scenario for:

"${description}"

Return a JSON object with:
{
  "id": "BC0XX",
  "description": "Clear description",
  "priority": "high/medium/low/critical",
  "category": "functional/accessibility/performance/security/usability",
  "tags": ["@smoke", "@regression", etc],
  "steps": ["Step 1", "Step 2", ...],
  "expectedResults": ["Result 1", "Result 2", ...],
  "testData": {},
  "requirements": ["REQ-001"],
  "jiraTickets": ["JIRA-001"],
  "documentation": "https://wiki.example.com/...",
  "estimatedTime": 60,
  "environments": ["dev", "stage", "prod"],
  "browsers": ["chrome", "firefox", "safari"]
}

Return ONLY valid JSON, no explanations.
`;

  try {
    const response = await llm.invoke(prompt);
    
    // Try to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const testScenario = JSON.parse(jsonMatch[0]);
      
      console.log('✨ Generated Test Scenario:\n');
      console.log('─'.repeat(60));
      console.log(`ID: ${testScenario.id}`);
      console.log(`Description: ${testScenario.description}`);
      console.log(`Priority: ${testScenario.priority}`);
      console.log(`Category: ${testScenario.category}`);
      console.log(`Tags: ${testScenario.tags.join(', ')}`);
      console.log(`Estimated Time: ${testScenario.estimatedTime}s`);
      console.log('─'.repeat(60));
      console.log('\n📋 Steps:');
      testScenario.steps.forEach((step: string, i: number) => {
        console.log(`   ${i + 1}. ${step}`);
      });
      console.log('\n✅ Expected Results:');
      testScenario.expectedResults.forEach((result: string, i: number) => {
        console.log(`   ${i + 1}. ${result}`);
      });
      console.log('\n' + '─'.repeat(60));
      
      // Generate TypeScript code
      let code = FEATURE_TEMPLATE;
      code = code.replace('{{ID}}', testScenario.id);
      code = code.replace('{{DESCRIPTION}}', testScenario.description);
      code = code.replace('{{PRIORITY}}', testScenario.priority);
      code = code.replace('{{CATEGORY}}', testScenario.category);
      code = code.replace('{{TAGS}}', JSON.stringify(testScenario.tags));
      code = code.replace('{{STEPS}}', JSON.stringify(testScenario.steps, null, 2));
      code = code.replace('{{EXPECTED_RESULTS}}', JSON.stringify(testScenario.expectedResults, null, 2));
      code = code.replace('{{TEST_DATA}}', JSON.stringify(testScenario.testData, null, 2));
      code = code.replace('{{REQUIREMENTS}}', JSON.stringify(testScenario.requirements));
      code = code.replace('{{JIRA_TICKETS}}', JSON.stringify(testScenario.jiraTickets));
      code = code.replace('{{DOCUMENTATION}}', testScenario.documentation || '');
      code = code.replace('{{ESTIMATED_TIME}}', testScenario.estimatedTime.toString());
      code = code.replace('{{ENVIRONMENTS}}', JSON.stringify(testScenario.environments));
      code = code.replace('{{BROWSERS}}', JSON.stringify(testScenario.browsers));
      
      console.log('\n💾 TypeScript Code:\n');
      console.log('```typescript');
      console.log(code);
      console.log('```\n');
      
      console.log('📝 To add this test:');
      console.log('   1. Copy the code above');
      console.log('   2. Add to your feature.ts file');
      console.log('   3. Or save to a new file and import it\n');
      
      // Optionally save to file
      const outputPath = path.join(process.cwd(), 'generated-tests', `${testScenario.id.toLowerCase()}.ts`);
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, code);
      
      console.log(`✅ Saved to: ${outputPath}\n`);
      
    } else {
      console.log('❌ Could not parse AI response as JSON');
      console.log('Raw response:');
      console.log(response);
    }
    
  } catch (error) {
    console.error('❌ Error generating test:', error instanceof Error ? error.message : error);
  }
}

// CLI Entry point
const args = process.argv.slice(2);
const description = args.join(' ');

if (!description) {
  console.log('Usage: npm run ai-generate "test description"');
  console.log('\nExamples:');
  console.log('  npm run ai-generate "test for login with email and password"');
  console.log('  npm run ai-generate "accessibility test for homepage"');
  console.log('  npm run ai-generate "performance test for page load under 3s"');
  process.exit(1);
}

generateQuickTest(description).catch(console.error);

