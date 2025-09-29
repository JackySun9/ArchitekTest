/**
 * Test Suite Update Management
 * Provides intelligent updating instead of delete/regenerate
 */

import fs from 'fs-extra';
import path from 'path';

export interface UpdateOptions {
  mode: 'merge' | 'replace' | 'append' | 'selective';
  preserveCustomizations?: boolean;
  backupOriginal?: boolean;
}

export class TestSuiteUpdater {
  
  /**
   * Merge new scenarios with existing ones
   */
  async mergeScenarios(
    existingFeaturePath: string, 
    newScenarios: any[],
    options: UpdateOptions = { mode: 'merge' }
  ): Promise<void> {
    // Find the actual feature file
    const files = await fs.readdir(existingFeaturePath);
    const featureFile = files.find(f => f.endsWith('.feature.ts'));
    if (!featureFile) {
      throw new Error(`No .feature.ts file found in ${existingFeaturePath}`);
    }
    const featureFilePath = path.join(existingFeaturePath, featureFile);
    
    if (await fs.pathExists(featureFilePath)) {
      // Read existing scenarios
      const existingContent = await fs.readFile(featureFilePath, 'utf-8');
      const existingScenarios = this.extractScenariosFromFile(existingContent);
      
      // Merge strategies
      let mergedScenarios;
      switch (options.mode) {
        case 'merge':
          mergedScenarios = this.mergeScenarioArrays(existingScenarios, newScenarios);
          break;
        case 'append':
          mergedScenarios = [...existingScenarios, ...newScenarios];
          break;
        case 'selective':
          mergedScenarios = this.selectiveMerge(existingScenarios, newScenarios);
          break;
        default:
          mergedScenarios = newScenarios; // replace
      }
      
      // Write back updated scenarios
      await this.updateFeatureFile(featureFilePath, mergedScenarios);
    }
  }

  /**
   * Smart merge that avoids duplicates and preserves custom scenarios
   */
  private mergeScenarioArrays(existing: any[], newScenarios: any[]): any[] {
    const merged = [...existing];
    
    for (const newScenario of newScenarios) {
      const existingIndex = merged.findIndex(s => s.id === newScenario.id);
      
      if (existingIndex >= 0) {
        // Update existing scenario but preserve custom modifications
        merged[existingIndex] = this.mergeScenario(merged[existingIndex], newScenario);
      } else {
        // Add new scenario
        merged.push(newScenario);
      }
    }
    
    return merged;
  }

  /**
   * Interactive selective merge - ask user what to keep/update
   */
  private selectiveMerge(existing: any[], newScenarios: any[]): any[] {
    // This would integrate with CLI to ask user preferences
    console.log('🤔 Selective merge mode - would prompt user for each conflict');
    return this.mergeScenarioArrays(existing, newScenarios);
  }

  /**
   * Preserve custom modifications while updating AI-generated parts
   */
  private mergeScenario(existing: any, newScenario: any): any {
    // Check if scenario has custom modifications (heuristics)
    const hasCustomSteps = existing.steps.some((step: string) => 
      step.includes('// Custom:') || step.includes('// TODO:')
    );
    
    if (hasCustomSteps) {
      console.log(`⚠️ Preserving custom modifications in scenario ${existing.id}`);
      return existing; // Keep custom version
    }
    
    return {
      ...existing,
      ...newScenario,
      // Preserve certain fields that might have been customized
      priority: existing.priority || newScenario.priority
    };
  }

  private extractScenariosFromFile(content: string): any[] {
    // Parse TypeScript file to extract scenarios array
    // Look for the pattern: export const [NAME]_SCENARIOS: TestScenario[] = [
    const match = content.match(/export const \w+_SCENARIOS: TestScenario\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      try {
        // Convert TypeScript object literals to JSON
        const scenarioText = match[1]
          .replace(/'/g, '"')           // Replace single quotes with double quotes
          .replace(/(\w+):/g, '"$1":')  // Quote object keys
          .replace(/,\s*]/g, ']')       // Remove trailing commas
          .replace(/,\s*}/g, '}');      // Remove trailing commas in objects
        
        return JSON.parse(scenarioText);
      } catch (e) {
        console.warn('Could not parse existing scenarios:', e);
      }
    }
    return [];
  }

  private async updateFeatureFile(filePath: string, scenarios: any[]): Promise<void> {
    // Read current file
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Format scenarios as TypeScript object literals
    const scenariosString = JSON.stringify(scenarios, null, 2)
      .replace(/"/g, "'")                    // Use single quotes
      .replace(/"(\w+)":/g, '$1:')          // Remove quotes from object keys
      .replace(/'/g, "'");                   // Ensure consistent quotes
    
    // Replace scenarios array in the file
    const updatedContent = content.replace(
      /(export const \w+_SCENARIOS: TestScenario\[\] = )\[[\s\S]*?\];/,
      `$1${scenariosString};`
    );
    
    await fs.writeFile(filePath, updatedContent);
    console.log(`✅ Updated scenarios in ${filePath}`);
  }

  /**
   * Smart merge update - generates new scenarios and intelligently merges them
   */
  async smartMergeUpdate(featureDir: string, newRequirements: string): Promise<void> {
    console.log('🧠 Smart merge update: generating new scenarios...');
    
    // Generate new scenarios based on requirements
    const newScenarios = await this.generateScenariosForRequirements(newRequirements);
    
    // Merge with existing scenarios
    const featureFile = path.join(featureDir, '*.feature.ts');
    await this.mergeScenarios(featureDir, newScenarios, { mode: 'merge', preserveCustomizations: true });
    
    console.log('✅ Smart merge completed');
  }

  /**
   * Append-only update - adds new scenarios without modifying existing ones
   */
  async appendOnlyUpdate(featureDir: string, newRequirements: string): Promise<void> {
    console.log('📝 Append-only update: adding new scenarios...');
    
    const newScenarios = await this.generateScenariosForRequirements(newRequirements);
    await this.mergeScenarios(featureDir, newScenarios, { mode: 'append', preserveCustomizations: true });
    
    console.log('✅ Append-only update completed');
  }

  /**
   * Selective update - interactive mode to choose what to update
   */
  async selectiveUpdate(featureDir: string, newRequirements: string): Promise<void> {
    console.log('🤔 Selective update: interactive mode...');
    console.log('💡 This would show a CLI menu to choose which scenarios to update');
    
    const newScenarios = await this.generateScenariosForRequirements(newRequirements);
    await this.mergeScenarios(featureDir, newScenarios, { mode: 'selective', preserveCustomizations: true });
    
    console.log('✅ Selective update completed');
  }

  /**
   * Generate new scenarios based on requirements (simplified version)
   */
  private async generateScenariosForRequirements(requirements: string): Promise<any[]> {
    // This is a simplified version - in practice would use the TestGenerationAgent
    console.log(`🎯 Generating scenarios for: ${requirements}`);
    
    // For now, return some example scenarios
    return [
      {
        id: 'NEW001',
        description: `Test ${requirements}`,
        priority: 'high',
        category: 'functional',
        steps: [`Implement test for: ${requirements}`],
        expectedResults: [`Verify ${requirements} works correctly`]
      }
    ];
  }
}

/**
 * CLI Integration for Update Modes
 */
export const UPDATE_MODES = {
  'smart-merge': {
    description: 'Intelligently merge new scenarios with existing ones',
    preservesCustomizations: true,
    recommended: true
  },
  'append-only': {
    description: 'Add new scenarios without modifying existing ones',
    preservesCustomizations: true,
    safe: true
  },
  'selective': {
    description: 'Interactive mode - choose what to update',
    preservesCustomizations: true,
    interactive: true
  },
  'replace-all': {
    description: 'Replace all scenarios (current behavior)',
    preservesCustomizations: false,
    destructive: true
  }
} as const;
