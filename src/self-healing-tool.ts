/**
 * Self-Healing Test Tool for Test Architect AI v3.1
 * Automatically repairs broken test selectors and maintains test reliability
 */

import { Tool } from '@langchain/core/tools';
import { chromium, Page } from 'playwright';
import fs from 'fs-extra';
import path from 'path';
import { Ollama } from '@langchain/community/llms/ollama';

interface BrokenSelector {
  originalSelector: string;
  errorMessage: string;
  testFile: string;
  lineNumber?: number;
  context: string;
}

interface SelectorSuggestion {
  selector: string;
  confidence: number;
  reasoning: string;
  elementInfo: {
    tag: string;
    text: string;
    attributes: Record<string, string>;
  };
}

interface HealingResult {
  success: boolean;
  originalSelector: string;
  newSelector?: string;
  confidence: number;
  reasoning: string;
  backupCreated: boolean;
  error?: string;
}

export class SelfHealingTool extends Tool {
  name = 'self_healer';
  description = 'Automatically detects and repairs broken test selectors by analyzing page structure and finding alternative selectors';

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
      const { url, brokenSelector, testFile, context } = JSON.parse(input);
      
      console.log(`🔧 Self-Healing: Analyzing broken selector`);
      console.log(`❌ Broken: ${brokenSelector}`);
      console.log(`📄 File: ${testFile}`);

      const result = await this.healBrokenSelector({
        originalSelector: brokenSelector,
        errorMessage: 'Selector not found',
        testFile,
        context
      }, url);

      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error('❌ Self-healing error:', error);
      return JSON.stringify({
        success: false,
        originalSelector: '',
        confidence: 0,
        reasoning: 'Self-healing process failed',
        backupCreated: false,
        error: error instanceof Error ? error.message : 'Unknown self-healing error'
      });
    }
  }

  async healBrokenSelector(broken: BrokenSelector, url: string): Promise<HealingResult> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      // Navigate to the page
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Analyze the page to find potential replacement selectors
      const suggestions = await this.findReplacementSelectors(page, broken);

      if (suggestions.length === 0) {
        return {
          success: false,
          originalSelector: broken.originalSelector,
          confidence: 0,
          reasoning: 'No suitable replacement selectors found on the page',
          backupCreated: false
        };
      }

      // Select the best suggestion
      const bestSuggestion = suggestions[0];

      // Verify the new selector works
      const isWorking = await this.verifySelectorWorks(page, bestSuggestion.selector);

      if (!isWorking) {
        return {
          success: false,
          originalSelector: broken.originalSelector,
          confidence: 0,
          reasoning: 'Best suggestion selector does not work on the page',
          backupCreated: false
        };
      }

      // Create backup of original test file
      const backupCreated = await this.createBackup(broken.testFile);

      // Apply the fix to the test file
      const fixApplied = await this.applyFix(
        broken.testFile,
        broken.originalSelector,
        bestSuggestion.selector
      );

      if (!fixApplied) {
        return {
          success: false,
          originalSelector: broken.originalSelector,
          confidence: bestSuggestion.confidence,
          reasoning: 'Failed to apply fix to test file',
          backupCreated
        };
      }

      console.log(`✅ Self-healing successful!`);
      console.log(`   Old: ${broken.originalSelector}`);
      console.log(`   New: ${bestSuggestion.selector}`);
      console.log(`   Confidence: ${bestSuggestion.confidence}%`);

      return {
        success: true,
        originalSelector: broken.originalSelector,
        newSelector: bestSuggestion.selector,
        confidence: bestSuggestion.confidence,
        reasoning: bestSuggestion.reasoning,
        backupCreated
      };

    } finally {
      await browser.close();
    }
  }

  private async findReplacementSelectors(page: Page, broken: BrokenSelector): Promise<SelectorSuggestion[]> {
    // Extract information about what the selector was trying to target
    const selectorInfo = this.analyzeBrokenSelector(broken.originalSelector);
    
    // Get all interactive elements from the page
    const elements = await page.evaluate(() => {
      const interactiveSelectors = [
        'a', 'button', 'input', 'select', 'textarea', 
        '[data-testid]', '[role="button"]', '[role="link"]',
        '[role="textbox"]', '[role="combobox"]', '[role="tab"]',
        '[onclick]', '[onsubmit]', '.btn', '.button'
      ];
      
      return Array.from(document.querySelectorAll(interactiveSelectors.join(', ')))
        .map((el, index) => ({
          tag: el.tagName.toLowerCase(),
          text: (el as HTMLElement).innerText?.slice(0, 100) || '',
          id: el.id || '',
          className: el.className || '',
          testId: el.getAttribute('data-testid') || '',
          role: el.getAttribute('role') || '',
          type: el.getAttribute('type') || '',
          placeholder: el.getAttribute('placeholder') || '',
          href: el.getAttribute('href') || '',
          index
        }));
    });

    // Use AI to find the best matches
    const suggestions = await this.generateSelectorSuggestions(selectorInfo, elements, broken.context);
    
    // Score and rank suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 suggestions
  }

  private analyzeBrokenSelector(selector: string): {
    type: 'id' | 'class' | 'testid' | 'text' | 'complex';
    value: string;
    intent: string;
  } {
    if (selector.startsWith('#')) {
      return { type: 'id', value: selector.slice(1), intent: 'unique element identification' };
    } else if (selector.startsWith('.')) {
      return { type: 'class', value: selector.slice(1), intent: 'styled element selection' };
    } else if (selector.includes('[data-testid')) {
      const match = selector.match(/data-testid[="']*([^"'\]]+)/);
      return { type: 'testid', value: match?.[1] || '', intent: 'test-specific element targeting' };
    } else if (selector.includes(':has-text(')) {
      const match = selector.match(/:has-text\(["']([^"']+)["']\)/);
      return { type: 'text', value: match?.[1] || '', intent: 'text-based element selection' };
    } else {
      return { type: 'complex', value: selector, intent: 'complex element selection' };
    }
  }

  private async generateSelectorSuggestions(
    selectorInfo: any, 
    elements: any[], 
    context: string
  ): Promise<SelectorSuggestion[]> {
    const prompt = `
You are a test automation expert analyzing a broken selector and finding the best replacement.

BROKEN SELECTOR INFO:
- Type: ${selectorInfo.type}
- Value: ${selectorInfo.value}
- Intent: ${selectorInfo.intent}

CONTEXT FROM TEST:
${context}

AVAILABLE ELEMENTS ON PAGE:
${JSON.stringify(elements.slice(0, 20), null, 2)}

Find the best replacement selectors. Consider:
1. Stability - prefer data-testid, id, then class, then text
2. Uniqueness - selector should target only one element
3. Semantic meaning - match the original intent
4. Maintenance - avoid fragile selectors

Return JSON array of up to 3 suggestions:
[{
  "selector": "new-selector-string",
  "confidence": 85,
  "reasoning": "Why this selector is a good match"
}]
`;

    try {
      const response = await this.llm.call(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const aiSuggestions = JSON.parse(jsonMatch[0]);
        return aiSuggestions.map((s: any) => ({
          ...s,
          elementInfo: this.findElementInfo(s.selector, elements)
        }));
      }
    } catch (error) {
      console.warn('⚠️ AI suggestion generation failed, using fallback logic');
    }

    // Fallback: simple heuristic matching
    return this.generateFallbackSuggestions(selectorInfo, elements);
  }

  private generateFallbackSuggestions(selectorInfo: any, elements: any[]): SelectorSuggestion[] {
    const suggestions: SelectorSuggestion[] = [];

    for (const element of elements) {
      let confidence = 0;
      let reasoning = '';

      // Match by test ID (highest priority)
      if (element.testId && selectorInfo.value.includes(element.testId)) {
        confidence = 90;
        reasoning = 'Matched by data-testid attribute';
        suggestions.push({
          selector: `[data-testid="${element.testId}"]`,
          confidence,
          reasoning,
          elementInfo: {
            tag: element.tag,
            text: element.text,
            attributes: { 'data-testid': element.testId }
          }
        });
      }

      // Match by ID
      if (element.id && selectorInfo.value.includes(element.id)) {
        confidence = 80;
        reasoning = 'Matched by ID attribute';
        suggestions.push({
          selector: `#${element.id}`,
          confidence,
          reasoning,
          elementInfo: {
            tag: element.tag,
            text: element.text,
            attributes: { id: element.id }
          }
        });
      }

      // Match by text content
      if (element.text && selectorInfo.type === 'text' && element.text.includes(selectorInfo.value)) {
        confidence = 70;
        reasoning = 'Matched by text content';
        suggestions.push({
          selector: `${element.tag}:has-text("${element.text}")`,
          confidence,
          reasoning,
          elementInfo: {
            tag: element.tag,
            text: element.text,
            attributes: {}
          }
        });
      }
    }

    return suggestions.slice(0, 3);
  }

  private findElementInfo(selector: string, elements: any[]): any {
    // Simple element info extraction for the selector
    return {
      tag: 'unknown',
      text: '',
      attributes: {}
    };
  }

  private async verifySelectorWorks(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      await element.first().waitFor({ timeout: 5000 });
      const count = await element.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  private async createBackup(testFile: string): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${testFile}.backup-${timestamp}`;
      await fs.copy(testFile, backupPath);
      console.log(`💾 Backup created: ${backupPath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
      return false;
    }
  }

  private async applyFix(testFile: string, oldSelector: string, newSelector: string): Promise<boolean> {
    try {
      const content = await fs.readFile(testFile, 'utf-8');
      const updatedContent = content.replace(
        new RegExp(this.escapeRegex(oldSelector), 'g'),
        newSelector
      );
      
      await fs.writeFile(testFile, updatedContent);
      console.log(`✅ Applied fix to ${testFile}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to apply fix:', error);
      return false;
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Scan test files for broken selectors
   */
  async scanForBrokenSelectors(testDir: string): Promise<BrokenSelector[]> {
    const brokenSelectors: BrokenSelector[] = [];
    const testFiles = await this.findTestFiles(testDir);

    for (const testFile of testFiles) {
      const content = await fs.readFile(testFile, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Look for common selector patterns that might be broken
        const selectorPatterns = [
          /page\.locator\(['"`]([^'"`]+)['"`]\)/g,
          /\.locator\(['"`]([^'"`]+)['"`]\)/g,
          /querySelector\(['"`]([^'"`]+)['"`]\)/g
        ];

        selectorPatterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            // This is a simplified detection - in practice, you'd run the tests
            // and catch actual failures
            brokenSelectors.push({
              originalSelector: match[1],
              errorMessage: 'Potential selector issue detected',
              testFile,
              lineNumber: index + 1,
              context: lines.slice(Math.max(0, index - 2), index + 3).join('\n')
            });
          }
        });
      });
    }

    return brokenSelectors;
  }

  private async findTestFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        files.push(...await this.findTestFiles(fullPath));
      } else if (item.endsWith('.spec.ts') || item.endsWith('.test.ts')) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
