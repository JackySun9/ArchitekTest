#!/usr/bin/env ts-node

/**
 * Model Quality Testing Script
 * Tests different Ollama models to compare test generation quality
 */

import { Ollama } from '@langchain/community/llms/ollama';
import { PromptTemplate } from '@langchain/core/prompts';

const TEST_MODELS = [
  'llama3.1:8b',
  'llama3.1:70b', 
  'codellama:34b',
  'gemma2:27b',
  'gemma3:27b'
];

const SAMPLE_UI_ANALYSIS = {
  url: 'https://www.google.com',
  title: 'Google',
  elements: [
    { tag: 'input', id: 'APjFqb', placeholder: 'Search', type: 'text' },
    { tag: 'button', text: 'Google Search', type: 'submit' },
    { tag: 'a', text: 'Images', href: '/images' },
    { tag: 'a', text: 'Gmail', href: '/gmail' }
  ]
};

const SAMPLE_REQUIREMENTS = 'Test search functionality with autocomplete, filters, and results display';

async function testModel(modelName: string): Promise<any> {
  console.log(`\n🧪 Testing model: ${modelName}`);
  
  try {
    const llm = new Ollama({
      model: modelName,
      baseUrl: 'http://localhost:11434',
    });

    const prompt = PromptTemplate.fromTemplate(`
You are a senior QA engineer. Generate 2 realistic test scenarios based on these UI elements:

UI Elements: {uiAnalysis}
Requirements: {requirements}

Return valid JSON only:
{{
  "scenarios": [
    {{
      "id": "TEST001",
      "description": "specific test description",
      "steps": ["concrete step 1", "concrete step 2"],
      "expectedResults": ["specific result 1", "specific result 2"]
    }}
  ]
}}
    `);

    const formattedPrompt = await prompt.format({
      uiAnalysis: JSON.stringify(SAMPLE_UI_ANALYSIS, null, 2),
      requirements: SAMPLE_REQUIREMENTS
    });

    const startTime = Date.now();
    const response = await llm.call(formattedPrompt);
    const duration = Date.now() - startTime;

    // Try to parse JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const scenarios = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return {
      model: modelName,
      duration,
      success: !!scenarios,
      scenarioCount: scenarios?.scenarios?.length || 0,
      quality: evaluateQuality(scenarios),
      rawResponse: response.slice(0, 200) + '...'
    };

  } catch (error) {
    return {
      model: modelName,
      duration: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      quality: 0
    };
  }
}

function evaluateQuality(scenarios: any): number {
  if (!scenarios?.scenarios?.length) return 0;
  
  let score = 0;
  const scenario = scenarios.scenarios[0];
  
  // Check description specificity
  if (scenario.description && scenario.description.length > 20) score += 2;
  
  // Check step quality
  if (scenario.steps && scenario.steps.length > 1) score += 2;
  if (scenario.steps?.some((step: string) => step.includes('search'))) score += 1;
  
  // Check expected results
  if (scenario.expectedResults && scenario.expectedResults.length > 1) score += 2;
  
  // Check for concrete actions vs generic ones
  const hasConcreteActions = scenario.steps?.some((step: string) => 
    step.includes('click') || step.includes('enter') || step.includes('fill')
  );
  if (hasConcreteActions) score += 3;
  
  return Math.min(score, 10);
}

async function main() {
  console.log('🚀 Test Architect AI - Model Quality Comparison');
  console.log('Testing different Ollama models for test generation quality...\n');

  const results = [];
  
  for (const model of TEST_MODELS) {
    const result = await testModel(model);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${model}: ${result.duration}ms, Quality: ${result.quality}/10`);
    } else {
      console.log(`❌ ${model}: ${result.error}`);
    }
  }

  // Sort by quality
  results.sort((a, b) => (b.quality || 0) - (a.quality || 0));

  console.log('\n📊 RESULTS SUMMARY:');
  console.log('Rank | Model          | Speed    | Quality | Status');
  console.log('-----|----------------|----------|---------|--------');
  
  results.forEach((result, index) => {
    const rank = (index + 1).toString().padEnd(4);
    const model = result.model.padEnd(14);
    const speed = result.success ? `${result.duration}ms`.padEnd(8) : 'Failed'.padEnd(8);
    const quality = result.success ? `${result.quality}/10`.padEnd(7) : 'N/A'.padEnd(7);
    const status = result.success ? '✅ Good' : '❌ Error';
    
    console.log(`${rank} | ${model} | ${speed} | ${quality} | ${status}`);
  });

  console.log('\n💡 RECOMMENDATIONS:');
  const best = results.find(r => r.success && r.quality >= 7);
  const fastest = results.filter(r => r.success).sort((a, b) => a.duration - b.duration)[0];
  
  if (best) {
    console.log(`🏆 Best Quality: ${best.model} (${best.quality}/10)`);
  }
  if (fastest) {
    console.log(`🚀 Fastest: ${fastest.model} (${fastest.duration}ms)`);
  }
  
  console.log('\nTo use a different model:');
  console.log('export OLLAMA_MODEL=llama3.1:8b');
  console.log('npm run start -- generate ...');
}

main().catch(console.error);
