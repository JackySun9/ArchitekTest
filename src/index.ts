#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { EnhancedRAGEngine } from './enhanced-rag';
import { TestGenerationAgent } from './test-generation-agent';
import { TestSuiteUpdater, UPDATE_MODES } from './test-updater';
import fs from 'fs-extra';
import path from 'path';

const CLI_BANNER = `
╔══════════════════════════════════════════════════════════════╗
║                    Test Architect AI v3.0                   ║
║          AI-Powered Test Generation with LangChain          ║
║                                                              ║
║  🤖 Intelligent  🔒 Privacy-First  🏗️ Enterprise-Grade     ║
╚══════════════════════════════════════════════════════════════╝
`;

async function main() {
  console.log(CLI_BANNER);
  
  await yargs(hideBin(process.argv))
    .scriptName('test-architect-ai')
    .version('3.0.0')
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
