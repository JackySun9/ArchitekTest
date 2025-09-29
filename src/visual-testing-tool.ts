/**
 * Visual Testing Tool for Test Architect AI v3.1
 * Provides screenshot comparison and visual regression testing capabilities
 */

import { Tool } from '@langchain/core/tools';
import { chromium, Page } from 'playwright';
import fs from 'fs-extra';
import path from 'path';
import { PNG } from 'pngjs';

interface VisualTestConfig {
  threshold: number; // 0-1, how different pixels need to be to be considered different
  includeAA: boolean; // whether to include anti-aliasing in comparison
  alpha: number; // opacity of the diff output
  aaColor: [number, number, number]; // color of anti-aliased pixels in diff output
  diffColor: [number, number, number]; // color of differing pixels in diff output
}

interface VisualTestResult {
  hasDifferences: boolean;
  diffPixelCount: number;
  diffPercentage: number;
  baselineExists: boolean;
  screenshotPath: string;
  baselinePath?: string;
  diffPath?: string;
  error?: string;
}

export class VisualTestingTool extends Tool {
  name = 'visual_tester';
  description = 'Captures screenshots and performs visual regression testing by comparing with baseline images';

  private visualConfig: VisualTestConfig = {
    threshold: 0.2,
    includeAA: true,
    alpha: 0.1,
    aaColor: [255, 255, 0],
    diffColor: [255, 0, 0]
  };

  async _call(input: string): Promise<string> {
    try {
      const { url, testName, selector, fullPage = false, config } = JSON.parse(input);
      
      console.log(`📸 Visual Testing: ${testName}`);
      console.log(`🌐 URL: ${url}`);
      if (selector) console.log(`🎯 Element: ${selector}`);

      const result = await this.performVisualTest(url, testName, {
        selector,
        fullPage,
        config: { ...this.visualConfig, ...config }
      });

      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error('❌ Visual testing error:', error);
      return JSON.stringify({
        hasDifferences: false,
        diffPixelCount: 0,
        diffPercentage: 0,
        baselineExists: false,
        screenshotPath: '',
        error: error instanceof Error ? error.message : 'Unknown visual testing error'
      });
    }
  }

  private async performVisualTest(
    url: string, 
    testName: string, 
    options: {
      selector?: string;
      fullPage?: boolean;
      config: VisualTestConfig;
    }
  ): Promise<VisualTestResult> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Navigate and wait for page to be ready
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000); // Allow animations to settle

      // Set up directories
      const visualTestDir = path.join('visual-tests', this.sanitizeTestName(testName));
      await fs.ensureDir(visualTestDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(visualTestDir, `current-${timestamp}.png`);
      const baselinePath = path.join(visualTestDir, 'baseline.png');
      const diffPath = path.join(visualTestDir, `diff-${timestamp}.png`);

      // Capture screenshot
      if (options.selector) {
        const element = page.locator(options.selector);
        await element.screenshot({ path: screenshotPath });
      } else {
        await page.screenshot({ 
          path: screenshotPath, 
          fullPage: options.fullPage 
        });
      }

      console.log(`✅ Screenshot captured: ${screenshotPath}`);

      // Check if baseline exists
      const baselineExists = await fs.pathExists(baselinePath);
      
      if (!baselineExists) {
        // First run - create baseline
        await fs.copy(screenshotPath, baselinePath);
        console.log(`📋 Baseline created: ${baselinePath}`);
        
        return {
          hasDifferences: false,
          diffPixelCount: 0,
          diffPercentage: 0,
          baselineExists: false,
          screenshotPath
        };
      }

      // Compare with baseline
      const comparison = await this.compareImages(
        baselinePath, 
        screenshotPath, 
        diffPath, 
        options.config
      );

      console.log(`🔍 Visual comparison complete:`);
      console.log(`   Diff pixels: ${comparison.diffPixelCount}`);
      console.log(`   Diff percentage: ${comparison.diffPercentage.toFixed(2)}%`);
      console.log(`   Has differences: ${comparison.hasDifferences ? '❌ YES' : '✅ NO'}`);

      return {
        ...comparison,
        baselineExists: true,
        screenshotPath,
        baselinePath,
        diffPath: comparison.hasDifferences ? diffPath : undefined
      };

    } finally {
      await browser.close();
    }
  }

  private async compareImages(
    baselinePath: string,
    currentPath: string,
    diffPath: string,
    config: VisualTestConfig
  ): Promise<{ hasDifferences: boolean; diffPixelCount: number; diffPercentage: number }> {
    
    const baseline = PNG.sync.read(await fs.readFile(baselinePath));
    const current = PNG.sync.read(await fs.readFile(currentPath));

    const { width, height } = baseline;
    
    // Ensure images are the same size
    if (current.width !== width || current.height !== height) {
      throw new Error(`Image size mismatch: baseline ${width}x${height}, current ${current.width}x${current.height}`);
    }

    const diff = new PNG({ width, height });
    
    // Dynamic import for ESM compatibility
    const pixelmatch = (await import('pixelmatch')).default;
    
    const diffPixelCount = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      {
        threshold: config.threshold,
        includeAA: config.includeAA,
        alpha: config.alpha,
        aaColor: config.aaColor,
        diffColor: config.diffColor
      }
    );

    const totalPixels = width * height;
    const diffPercentage = (diffPixelCount / totalPixels) * 100;
    const hasDifferences = diffPixelCount > 0;

    if (hasDifferences) {
      await fs.writeFile(diffPath, PNG.sync.write(diff));
    }

    return {
      hasDifferences,
      diffPixelCount,
      diffPercentage
    };
  }

  private sanitizeTestName(testName: string): string {
    return testName
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Update baseline image for a test
   */
  async updateBaseline(testName: string, screenshotPath: string): Promise<void> {
    const visualTestDir = path.join('visual-tests', this.sanitizeTestName(testName));
    const baselinePath = path.join(visualTestDir, 'baseline.png');
    
    await fs.ensureDir(visualTestDir);
    await fs.copy(screenshotPath, baselinePath);
    
    console.log(`📋 Baseline updated: ${baselinePath}`);
  }

  /**
   * Clean up old screenshots and diff files
   */
  async cleanupOldFiles(testName: string, keepCount: number = 5): Promise<void> {
    const visualTestDir = path.join('visual-tests', this.sanitizeTestName(testName));
    
    if (!(await fs.pathExists(visualTestDir))) return;

    const files = await fs.readdir(visualTestDir);
    const screenshots = files
      .filter(f => f.startsWith('current-') && f.endsWith('.png'))
      .sort()
      .reverse();

    const diffs = files
      .filter(f => f.startsWith('diff-') && f.endsWith('.png'))
      .sort()
      .reverse();

    // Keep only the most recent files
    const screenshotsToDelete = screenshots.slice(keepCount);
    const diffsToDelete = diffs.slice(keepCount);

    for (const file of [...screenshotsToDelete, ...diffsToDelete]) {
      await fs.remove(path.join(visualTestDir, file));
    }

    console.log(`🧹 Cleaned up ${screenshotsToDelete.length + diffsToDelete.length} old visual test files`);
  }
}
