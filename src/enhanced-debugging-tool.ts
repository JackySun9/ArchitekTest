/**
 * Enhanced Debugging Tool for Test Architect AI v3.1
 * Provides comprehensive error analysis, debugging insights, and test failure diagnosis
 */

import { Tool } from '@langchain/core/tools';
import fs from 'fs-extra';
import path from 'path';
import { Ollama } from '@langchain/community/llms/ollama';

interface TestFailure {
  testName: string;
  errorMessage: string;
  stackTrace: string;
  testFile: string;
  timestamp: Date;
  browserLogs?: string[];
  networkLogs?: any[];
  screenshots?: string[];
}

interface DebugReport {
  summary: string;
  rootCause: string;
  suggestedFixes: string[];
  confidence: number;
  category: 'selector' | 'timing' | 'network' | 'assertion' | 'environment' | 'unknown';
  priority: 'high' | 'medium' | 'low';
  relatedIssues: string[];
  debuggingSteps: string[];
}

interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  flakyTests: string[];
  slowTests: string[];
  averageExecutionTime: number;
  mostCommonFailures: string[];
}

export class EnhancedDebuggingTool extends Tool {
  name = 'debug_analyzer';
  description = 'Analyzes test failures, provides debugging insights, and suggests fixes for common test issues';

  private llm: Ollama;

  constructor() {
    super();
    this.llm = new Ollama({
      model: 'deepseek-r1:14b',
      baseUrl: 'http://localhost:11434',
    });
  }

  async _call(input: string): Promise<string> {
    try {
      const { action, data } = JSON.parse(input);
      
      console.log(`🔍 Debug Analysis: ${action}`);

      let result;
      switch (action) {
        case 'analyze_failure':
          result = await this.analyzeTestFailure(data);
          break;
        case 'generate_report':
          result = await this.generateTestReport(data.testResultsDir);
          break;
        case 'analyze_flaky_tests':
          result = await this.analyzeFlakyTests(data.testHistory);
          break;
        case 'performance_analysis':
          result = await this.analyzePerformance(data.testMetrics);
          break;
        default:
          throw new Error(`Unknown debug action: ${action}`);
      }

      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error('❌ Debug analysis error:', error);
      return JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown debugging error',
        suggestions: ['Check input format', 'Verify test results exist', 'Review error logs']
      });
    }
  }

  async analyzeTestFailure(failure: TestFailure): Promise<DebugReport> {
    console.log(`🔍 Analyzing failure: ${failure.testName}`);
    
    // Extract key information from error message and stack trace
    const errorPatterns = this.identifyErrorPatterns(failure.errorMessage, failure.stackTrace);
    
    // Use AI to analyze the failure
    const aiAnalysis = await this.getAIAnalysis(failure);
    
    // Generate debugging steps
    const debuggingSteps = this.generateDebuggingSteps(errorPatterns, failure);
    
    // Determine priority based on error type and frequency
    const priority = this.determinePriority(errorPatterns, failure);

    const report: DebugReport = {
      summary: `Test failure in ${failure.testName}: ${this.extractErrorSummary(failure.errorMessage)}`,
      rootCause: aiAnalysis.rootCause || this.determineRootCause(errorPatterns),
      suggestedFixes: aiAnalysis.suggestedFixes || this.generateSuggestedFixes(errorPatterns),
      confidence: aiAnalysis.confidence || this.calculateConfidence(errorPatterns),
      category: this.categorizeError(errorPatterns),
      priority,
      relatedIssues: await this.findRelatedIssues(failure),
      debuggingSteps
    };

    // Save detailed debug report
    await this.saveDebugReport(failure, report);

    return report;
  }

  private identifyErrorPatterns(errorMessage: string, stackTrace: string): string[] {
    const patterns: string[] = [];
    const text = (errorMessage + ' ' + stackTrace).toLowerCase();

    // Common Playwright/test patterns
    const errorPatterns = {
      'selector_not_found': /locator.*not.*found|element.*not.*found|selector.*not.*found/,
      'timeout': /timeout.*exceeded|timed.*out|timeout.*\d+ms/,
      'network_error': /net::err|network.*error|connection.*refused|dns.*error/,
      'assertion_failed': /expect.*received|assertion.*failed|expected.*actual/,
      'element_not_visible': /element.*not.*visible|element.*hidden|not.*visible/,
      'element_not_clickable': /element.*not.*clickable|click.*intercepted/,
      'navigation_error': /navigation.*failed|page.*not.*loaded/,
      'screenshot_failed': /screenshot.*failed|image.*capture.*error/,
      'browser_crashed': /browser.*crashed|browser.*disconnected/,
      'memory_error': /out.*of.*memory|heap.*out.*of.*memory/,
      'permission_denied': /permission.*denied|access.*denied/,
      'file_not_found': /file.*not.*found|enoent|no.*such.*file/
    };

    for (const [pattern, regex] of Object.entries(errorPatterns)) {
      if (regex.test(text)) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private async getAIAnalysis(failure: TestFailure): Promise<{
    rootCause: string;
    suggestedFixes: string[];
    confidence: number;
  }> {
    const prompt = `
You are a senior test automation engineer analyzing a test failure. Provide a detailed analysis.

TEST FAILURE DETAILS:
Test Name: ${failure.testName}
Error Message: ${failure.errorMessage}
Stack Trace: ${failure.stackTrace}
Test File: ${failure.testFile}

BROWSER LOGS:
${failure.browserLogs?.join('\n') || 'No browser logs available'}

ANALYSIS REQUIRED:
1. Root cause of the failure
2. Specific suggested fixes (3-5 actionable items)
3. Confidence level (0-100)

Consider common issues:
- Selector changes in the application
- Timing issues and race conditions
- Network connectivity problems
- Environment configuration issues
- Browser compatibility issues

Respond with JSON:
{
  "rootCause": "Detailed explanation of what caused the failure",
  "suggestedFixes": [
    "Specific fix 1",
    "Specific fix 2",
    "Specific fix 3"
  ],
  "confidence": 85
}
`;

    try {
      const response = await this.llm.call(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('⚠️ AI analysis failed, using fallback analysis');
    }

    return {
      rootCause: 'Unable to determine root cause automatically',
      suggestedFixes: ['Review error message and stack trace', 'Check application changes', 'Verify test environment'],
      confidence: 30
    };
  }

  private determineRootCause(patterns: string[]): string {
    if (patterns.includes('selector_not_found')) {
      return 'Element selector is no longer valid - the application UI may have changed';
    }
    if (patterns.includes('timeout')) {
      return 'Test timed out waiting for an element or action - possible performance issue or wrong wait condition';
    }
    if (patterns.includes('network_error')) {
      return 'Network connectivity issue preventing page load or API calls';
    }
    if (patterns.includes('assertion_failed')) {
      return 'Test assertion failed - actual result does not match expected result';
    }
    if (patterns.includes('element_not_visible')) {
      return 'Element exists but is not visible - may be hidden by CSS or overlapping elements';
    }
    
    return 'Unable to determine root cause from error patterns';
  }

  private generateSuggestedFixes(patterns: string[]): string[] {
    const fixes: string[] = [];

    if (patterns.includes('selector_not_found')) {
      fixes.push(
        'Use the self-healing tool to find a replacement selector',
        'Verify the element still exists on the page',
        'Check if the element ID or class names have changed',
        'Consider using more stable selectors like data-testid'
      );
    }

    if (patterns.includes('timeout')) {
      fixes.push(
        'Increase the timeout value for this specific action',
        'Add explicit wait conditions before the action',
        'Check if the page load time has increased',
        'Verify network conditions and server performance'
      );
    }

    if (patterns.includes('network_error')) {
      fixes.push(
        'Check network connectivity and DNS resolution',
        'Verify the application URL is correct and accessible',
        'Check for proxy or firewall issues',
        'Retry the test to rule out temporary network issues'
      );
    }

    if (patterns.includes('assertion_failed')) {
      fixes.push(
        'Review the expected vs actual values',
        'Check if the application behavior has changed',
        'Verify test data is still valid',
        'Update assertion to match new expected behavior'
      );
    }

    if (fixes.length === 0) {
      fixes.push(
        'Review the complete error message and stack trace',
        'Check recent application changes',
        'Verify test environment configuration',
        'Run the test in isolation to rule out dependencies'
      );
    }

    return fixes;
  }

  private calculateConfidence(patterns: string[]): number {
    // Higher confidence for well-known error patterns
    if (patterns.includes('selector_not_found')) return 90;
    if (patterns.includes('timeout')) return 85;
    if (patterns.includes('network_error')) return 80;
    if (patterns.includes('assertion_failed')) return 75;
    
    return patterns.length > 0 ? 60 : 30;
  }

  private categorizeError(patterns: string[]): DebugReport['category'] {
    if (patterns.includes('selector_not_found') || patterns.includes('element_not_visible')) {
      return 'selector';
    }
    if (patterns.includes('timeout')) {
      return 'timing';
    }
    if (patterns.includes('network_error')) {
      return 'network';
    }
    if (patterns.includes('assertion_failed')) {
      return 'assertion';
    }
    if (patterns.includes('browser_crashed') || patterns.includes('permission_denied')) {
      return 'environment';
    }
    
    return 'unknown';
  }

  private determinePriority(patterns: string[], failure: TestFailure): DebugReport['priority'] {
    // High priority for critical failures
    if (patterns.includes('browser_crashed') || patterns.includes('memory_error')) {
      return 'high';
    }
    
    // Medium priority for common issues
    if (patterns.includes('selector_not_found') || patterns.includes('timeout')) {
      return 'medium';
    }
    
    // Low priority for minor issues
    return 'low';
  }

  private generateDebuggingSteps(patterns: string[], failure: TestFailure): string[] {
    const steps: string[] = [
      'Reproduce the failure locally',
      'Check the application in the browser manually',
      'Review recent code changes in the application',
      'Verify test environment configuration'
    ];

    if (patterns.includes('selector_not_found')) {
      steps.push(
        'Inspect the page elements using browser dev tools',
        'Run the self-healing tool to find alternative selectors',
        'Check if the element is present but with different attributes'
      );
    }

    if (patterns.includes('timeout')) {
      steps.push(
        'Monitor network requests during test execution',
        'Check application performance and response times',
        'Add debug logging to identify where the timeout occurs'
      );
    }

    steps.push(
      'Run the test with increased logging and screenshots',
      'Check browser console for JavaScript errors',
      'Verify the fix by running the test multiple times'
    );

    return steps;
  }

  private async findRelatedIssues(failure: TestFailure): Promise<string[]> {
    // Look for similar failures in recent test runs
    const relatedIssues: string[] = [];
    
    try {
      const testResultsDir = path.join('test-results');
      if (await fs.pathExists(testResultsDir)) {
        const resultDirs = await fs.readdir(testResultsDir);
        
        for (const dir of resultDirs.slice(-5)) { // Check last 5 runs
          const errorFile = path.join(testResultsDir, dir, 'error-context.md');
          if (await fs.pathExists(errorFile)) {
            const content = await fs.readFile(errorFile, 'utf-8');
            if (content.includes(failure.errorMessage.slice(0, 50))) {
              relatedIssues.push(`Similar failure in ${dir}`);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Could not analyze related issues:', error);
    }

    return relatedIssues;
  }

  private extractErrorSummary(errorMessage: string): string {
    // Extract the first meaningful line from error message
    const lines = errorMessage.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('at ') && !trimmed.startsWith('Error:')) {
        return trimmed.slice(0, 100);
      }
    }
    return errorMessage.slice(0, 100);
  }

  private async saveDebugReport(failure: TestFailure, report: DebugReport): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportDir = path.join('debug-reports', timestamp);
    await fs.ensureDir(reportDir);

    const reportContent = `# Debug Report: ${failure.testName}

## Summary
${report.summary}

## Root Cause Analysis
${report.rootCause}

## Suggested Fixes
${report.suggestedFixes.map((fix, i) => `${i + 1}. ${fix}`).join('\n')}

## Error Details
- **Category**: ${report.category}
- **Priority**: ${report.priority}
- **Confidence**: ${report.confidence}%
- **Timestamp**: ${failure.timestamp}

## Test Information
- **Test File**: ${failure.testFile}
- **Error Message**: 
\`\`\`
${failure.errorMessage}
\`\`\`

## Stack Trace
\`\`\`
${failure.stackTrace}
\`\`\`

## Debugging Steps
${report.debuggingSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Related Issues
${report.relatedIssues.length > 0 ? report.relatedIssues.map(issue => `- ${issue}`).join('\n') : 'None found'}

---
Generated by Test Architect AI v3.1 Enhanced Debugging Tool
`;

    await fs.writeFile(path.join(reportDir, 'debug-report.md'), reportContent);
    console.log(`📋 Debug report saved: ${reportDir}/debug-report.md`);
  }

  async generateTestReport(testResultsDir: string): Promise<TestMetrics> {
    console.log(`📊 Generating comprehensive test report from ${testResultsDir}`);
    
    // This would analyze Playwright test results
    // For now, return mock data structure
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      flakyTests: [],
      slowTests: [],
      averageExecutionTime: 0,
      mostCommonFailures: []
    };
  }

  async analyzeFlakyTests(testHistory: any[]): Promise<string[]> {
    // Analyze test history to identify flaky tests
    return [];
  }

  async analyzePerformance(testMetrics: TestMetrics): Promise<any> {
    // Analyze test performance metrics
    return {};
  }
}
