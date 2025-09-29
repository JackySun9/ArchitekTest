#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { EnhancedRAGEngine } from './enhanced-rag';
import { TestGenerationAgent } from './test-generation-agent';
import { TestSuiteUpdater, UPDATE_MODES } from './test-updater';
import { VisualTestingTool } from './visual-testing-tool';
import { SelfHealingTool } from './self-healing-tool';
import { EnhancedDebuggingTool } from './enhanced-debugging-tool';
import fs from 'fs-extra';
import path from 'path';

const CLI_BANNER = `
╔══════════════════════════════════════════════════════════════╗
║                    Test Architect AI v3.1                   ║
║       AI-Powered Test Generation with Advanced Tools        ║
║                                                              ║
║  🧠 ReAct Agent  📸 Visual Testing  🔧 Self-Healing        ║
║  🔍 Debug Analysis  🔒 Privacy-First  🏗️ Enterprise-Grade  ║
╚══════════════════════════════════════════════════════════════╝
`;

async function main() {
  console.log(CLI_BANNER);
  
  await yargs(hideBin(process.argv))
    .scriptName('test-architect-ai')
    .version('3.1.0')
    .command(
      'embed [directory]',
      '🧠 Embed codebase for intelligent pattern reuse',
      (yargs: any) => {
        return yargs
          .positional('directory', {
            type: 'string',
            default: 'shared',
            description: 'Directory to scan for TypeScript files'
          })
          .option('verbose', {
            alias: 'v',
            type: 'boolean',
            default: false,
            description: 'Enable verbose logging'
          })
          .example('$0 embed', 'Embed files from shared/ directory')
          .example('$0 embed src/components', 'Embed files from specific directory')
          .example('$0 embed --verbose', 'Embed with detailed logging');
      },
      async (argv: any) => {
        console.log(`🚀 Starting enhanced RAG embedding for: ${argv.directory}`);
        const ragEngine = new EnhancedRAGEngine();
        await ragEngine.embedCodebase(argv.directory);
        console.log('✅ Embedding complete! Use "query" command to test it.');
      }
    )
    .command(
      'generate',
      '🏗️ Generate comprehensive test suites with AI',
      (yargs: any) => {
        return yargs
          .option('feature', {
            type: 'string',
            demandOption: true,
            description: 'Feature name (e.g., "user-login", "shopping-cart")'
          })
          .option('requirements', {
            type: 'string',
            demandOption: true,
            description: 'Detailed test requirements and user stories'
          })
          .option('team', {
            type: 'string',
            demandOption: true,
            description: 'Team name for organizing generated tests'
          })
          .option('url', {
            type: 'string',
            description: 'Optional: URL to analyze for dynamic page inspection'
          })
          .option('priority', {
            type: 'string',
            choices: ['high', 'medium', 'low'],
            default: 'high',
            description: 'Test priority level'
          })
          .example('$0 generate --feature user-login --requirements "Test email/password auth with error handling" --team auth-team', 'Generate login tests')
          .example('$0 generate --feature checkout --requirements "E-commerce checkout flow with payment validation" --team payments --url https://shop.example.com/checkout', 'Generate checkout tests with URL analysis');
      },
      async (argv: any) => {
        console.log(`🤖 Generating test suite for feature: ${argv.feature}`);
        console.log(`👥 Team: ${argv.team}`);
        console.log(`📋 Requirements: ${argv.requirements}`);
        if (argv.url) console.log(`🌐 Target URL: ${argv.url}`);
        
        const agent = new TestGenerationAgent();
        await agent.initialize();
        
        const result = await agent.generateTestSuite({
          url: argv.url,
          featureName: argv.feature,
          requirements: argv.requirements,
          team: argv.team
        });
        
        console.log('\n🎉 Test suite generation complete!');
        console.log('📁 Generated files:');
        console.log(`   • teams/${argv.team}/${argv.feature}/${argv.feature}.page.ts`);
        console.log(`   • teams/${argv.team}/${argv.feature}/${argv.feature}.feature.ts`);
        console.log(`   • teams/${argv.team}/${argv.feature}/${argv.feature}.spec.ts`);
        console.log('\n▶️  Run tests with: npx playwright test teams/' + argv.team + '/' + argv.feature + '/');
      }
    )
    .command(
      'query',
      '🔍 Query your codebase intelligently using RAG',
      (yargs: any) => {
        return yargs
          .option('question', {
            alias: 'q',
            type: 'string',
            demandOption: true,
            description: 'Question to ask about your existing codebase'
          })
          .option('sources', {
            alias: 's',
            type: 'boolean',
            default: true,
            description: 'Show source files in the response'
          })
          .example('$0 query -q "What page object patterns are available?"', 'Ask about existing patterns')
          .example('$0 query -q "How do I handle form validation?" --no-sources', 'Query without showing sources')
          .example('$0 query -q "Show me authentication utilities"', 'Find auth-related code');
      },
      async (argv: any) => {
        console.log(`🤔 Asking: "${argv.question}"`);
        console.log('🔍 Searching your codebase...\n');
        
        try {
          const ragEngine = new EnhancedRAGEngine();
          await ragEngine.loadPersistedStore();
          const result = await ragEngine.queryCodebase(argv.question);
          
          console.log('💡 Answer:');
          console.log(result.answer);
          
          if (argv.sources && result.sources.length > 0) {
            console.log('\n📚 Sources:');
            const uniqueSources = [...new Set(result.sources.map(s => s.metadata.source))];
            uniqueSources.forEach(source => console.log(`   • ${source}`));
          }
        } catch (error) {
          console.error('❌ Error querying codebase:', error);
          console.log('\n💡 Tip: Run "embed" command first to create the knowledge base');
        }
      }
    )
    .command(
      'update',
      '🔄 Update existing test suite with new scenarios',
      (yargs: any) => {
        return yargs
          .option('feature', {
            alias: 'f',
            type: 'string',
            description: 'Feature name to update',
            demandOption: true,
          })
          .option('team', {
            alias: 't', 
            type: 'string',
            description: 'Team name',
            demandOption: true,
          })
          .option('requirements', {
            alias: 'r',
            type: 'string', 
            description: 'Additional requirements to test',
            demandOption: true,
          })
          .option('mode', {
            alias: 'm',
            type: 'string',
            description: 'Update strategy',
            choices: ['smart-merge', 'append-only', 'selective', 'replace-all'],
            default: 'smart-merge',
          })
          .option('backup', {
            alias: 'b',
            type: 'boolean',
            description: 'Create backup before updating',
            default: true,
          })
          .example('$0 update -f user-login -t auth-team -r "Add password strength validation" -m append-only', '')
          .example('$0 update -f search -t catalog -r "Add voice search" -m smart-merge', '');
      },
      async (argv: any) => {
        console.log(`🔄 Updating test suite: ${argv.feature}`);
        console.log(`📝 Mode: ${argv.mode}`);
        console.log(`📋 New requirements: ${argv.requirements}`);
        
        try {
          const updater = new TestSuiteUpdater();
          
          // Check if feature exists
          const featureDir = path.join('teams', argv.team, argv.feature);
          const featureFile = path.join(featureDir, `${argv.feature}.feature.ts`);
          
          if (!await fs.pathExists(featureFile)) {
            console.log(`❌ Feature not found: ${featureFile}`);
            console.log(`💡 Use generate command to create it first`);
            return;
          }
          
          if (argv.backup) {
            console.log('💾 Creating backup...');
            const backupDir = path.join('backups', argv.team);
            await fs.ensureDir(backupDir);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(backupDir, `${argv.feature}-backup-${timestamp}`);
            await fs.copy(featureDir, backupPath);
            console.log(`✅ Backup created: ${backupPath}`);
          }
          
          switch (argv.mode) {
            case 'smart-merge':
              await updater.smartMergeUpdate(featureDir, argv.requirements);
              break;
            case 'append-only':
              await updater.appendOnlyUpdate(featureDir, argv.requirements);
              break;
            case 'selective':
              await updater.selectiveUpdate(featureDir, argv.requirements);
              break;
            case 'replace-all':
              console.log('🔄 Replace-all mode: regenerating entire test suite...');
              await fs.remove(featureDir);
              const { TestGenerationAgent } = await import('./test-generation-agent');
              const agent = new TestGenerationAgent();
              await agent.initialize();
              await agent.generateTestSuite({
                featureName: argv.feature,
                requirements: argv.requirements,
                team: argv.team
              });
              break;
            default:
              console.log(`❌ Unknown update mode: ${argv.mode}`);
          }
          
          console.log('✅ Update completed successfully!');
          console.log(`▶️  Run tests with: npx playwright test teams/${argv.team}/${argv.feature}/`);
          
        } catch (error) {
          console.error('❌ Error during update:', error);
          console.log('\n💡 Available update modes:');
          Object.entries(UPDATE_MODES).forEach(([mode, info]) => {
            const status = (info as any).recommended ? '🏆' : (info as any).safe ? '✅' : (info as any).destructive ? '⚠️' : '🔧';
            console.log(`  ${status} ${mode}: ${info.description}`);
          });
        }
      }
    )
    .command(
      'visual-test',
      '📸 Perform visual regression testing with screenshot comparison',
      (yargs: any) => {
        return yargs
          .option('url', {
            type: 'string',
            demandOption: true,
            description: 'URL to test visually'
          })
          .option('test-name', {
            type: 'string',
            demandOption: true,
            description: 'Name for the visual test'
          })
          .option('selector', {
            type: 'string',
            description: 'CSS selector to screenshot (optional - full page if not provided)'
          })
          .option('threshold', {
            type: 'number',
            default: 0.2,
            description: 'Pixel difference threshold (0-1)'
          })
          .option('update-baseline', {
            type: 'boolean',
            default: false,
            description: 'Update the baseline image'
          })
          .example('$0 visual-test --url https://example.com --test-name homepage', 'Test full page')
          .example('$0 visual-test --url https://example.com --test-name login-form --selector "#login-form"', 'Test specific element');
      },
      async (argv: any) => {
        console.log(`📸 Visual Testing: ${argv.testName}`);
        
        const visualTool = new VisualTestingTool();
        const result = await visualTool._call(JSON.stringify({
          url: argv.url,
          testName: argv.testName,
          selector: argv.selector,
          fullPage: !argv.selector,
          config: { threshold: argv.threshold }
        }));
        
        const testResult = JSON.parse(result);
        
        if (testResult.error) {
          console.error('❌ Visual test failed:', testResult.error);
        } else if (testResult.hasDifferences) {
          console.log('⚠️ Visual differences detected!');
          console.log(`   Diff pixels: ${testResult.diffPixelCount}`);
          console.log(`   Diff percentage: ${testResult.diffPercentage.toFixed(2)}%`);
          if (testResult.diffPath) {
            console.log(`   Diff image: ${testResult.diffPath}`);
          }
        } else {
          console.log('✅ Visual test passed - no differences detected');
        }
        
        if (argv.updateBaseline && testResult.screenshotPath) {
          await visualTool.updateBaseline(argv.testName, testResult.screenshotPath);
        }
      }
    )
    .command(
      'heal',
      '🔧 Automatically fix broken test selectors using self-healing capabilities',
      (yargs: any) => {
        return yargs
          .option('url', {
            type: 'string',
            demandOption: true,
            description: 'URL where the test is failing'
          })
          .option('selector', {
            type: 'string',
            demandOption: true,
            description: 'The broken selector to fix'
          })
          .option('test-file', {
            type: 'string',
            demandOption: true,
            description: 'Path to the test file containing the broken selector'
          })
          .option('context', {
            type: 'string',
            description: 'Additional context about what the selector should target'
          })
          .example('$0 heal --url https://example.com --selector "#old-button" --test-file teams/auth/login.spec.ts', 'Fix broken selector');
      },
      async (argv: any) => {
        console.log(`🔧 Self-Healing: Analyzing broken selector`);
        console.log(`❌ Broken: ${argv.selector}`);
        
        const healingTool = new SelfHealingTool();
        const result = await healingTool._call(JSON.stringify({
          url: argv.url,
          brokenSelector: argv.selector,
          testFile: argv.testFile,
          context: argv.context || `Selector from ${argv.testFile}`
        }));
        
        const healingResult = JSON.parse(result);
        
        if (healingResult.success) {
          console.log('✅ Self-healing successful!');
          console.log(`   Old: ${healingResult.originalSelector}`);
          console.log(`   New: ${healingResult.newSelector}`);
          console.log(`   Confidence: ${healingResult.confidence}%`);
          console.log(`   Reasoning: ${healingResult.reasoning}`);
          if (healingResult.backupCreated) {
            console.log(`   Backup: Created backup of original test file`);
          }
        } else {
          console.log('❌ Self-healing failed');
          console.log(`   Reason: ${healingResult.reasoning}`);
          if (healingResult.error) {
            console.log(`   Error: ${healingResult.error}`);
          }
        }
      }
    )
    .command(
      'debug',
      '🔍 Analyze test failures and provide debugging insights',
      (yargs: any) => {
        return yargs
          .option('action', {
            type: 'string',
            choices: ['analyze_failure', 'generate_report', 'analyze_flaky_tests'],
            default: 'analyze_failure',
            description: 'Type of debug analysis to perform'
          })
          .option('test-name', {
            type: 'string',
            description: 'Name of the failed test'
          })
          .option('error-message', {
            type: 'string',
            description: 'Error message from the test failure'
          })
          .option('test-file', {
            type: 'string',
            description: 'Path to the test file'
          })
          .option('results-dir', {
            type: 'string',
            default: 'test-results',
            description: 'Directory containing test results'
          })
          .example('$0 debug --test-name "login test" --error-message "Selector not found" --test-file teams/auth/login.spec.ts', 'Analyze specific failure');
      },
      async (argv: any) => {
        console.log(`🔍 Debug Analysis: ${argv.action}`);
        
        const debugTool = new EnhancedDebuggingTool();
        
        let debugData;
        if (argv.action === 'analyze_failure') {
          debugData = {
            testName: argv.testName || 'Unknown test',
            errorMessage: argv.errorMessage || 'No error message provided',
            stackTrace: '',
            testFile: argv.testFile || 'Unknown file',
            timestamp: new Date()
          };
        } else if (argv.action === 'generate_report') {
          debugData = { testResultsDir: argv.resultsDir };
        }
        
        const result = await debugTool._call(JSON.stringify({
          action: argv.action,
          data: debugData
        }));
        
        const analysis = JSON.parse(result);
        
        if (analysis.error) {
          console.error('❌ Debug analysis failed:', analysis.error);
          console.log('\n💡 Suggestions:');
          analysis.suggestions?.forEach((suggestion: string, i: number) => {
            console.log(`   ${i + 1}. ${suggestion}`);
          });
        } else if (argv.action === 'analyze_failure') {
          console.log('\n📋 Debug Analysis Results:');
          console.log(`   Summary: ${analysis.summary}`);
          console.log(`   Root Cause: ${analysis.rootCause}`);
          console.log(`   Category: ${analysis.category} (${analysis.priority} priority)`);
          console.log(`   Confidence: ${analysis.confidence}%`);
          
          console.log('\n🔧 Suggested Fixes:');
          analysis.suggestedFixes?.forEach((fix: string, i: number) => {
            console.log(`   ${i + 1}. ${fix}`);
          });
          
          console.log('\n🔍 Debugging Steps:');
          analysis.debuggingSteps?.forEach((step: string, i: number) => {
            console.log(`   ${i + 1}. ${step}`);
          });
        }
      }
    )
    .demandCommand(1, 'You need to specify a command. Use --help for available commands.')
    .help('help', '📖 Show help information')
    .alias('help', 'h')
    .version('version', '📋 Show version information')
    .alias('version', 'V')
    .wrap(100)
    .epilog('🚀 For more information, visit: https://github.com/your-repo/test-architect-ai')
    .argv;
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
