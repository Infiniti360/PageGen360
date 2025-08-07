import { POM, Element, POMChanges, CompatibilityReport } from '../types';
import { Logger } from '../utils/Logger';

export class VersionManager {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Detect changes between old and new POMs
   */
  async detectChanges(oldElements: Element[], newElements: Element[]): Promise<POMChanges> {
    this.logger.debug('Detecting changes between POM versions');

    const addedElements: Element[] = [];
    const removedElements: Element[] = [];
    const modifiedElements: any[] = [];

    // Find added elements
    for (const newElement of newElements) {
      const oldElement = oldElements.find(e => e.id === newElement.id);
      if (!oldElement) {
        addedElements.push(newElement);
      } else if (this.hasElementChanged(oldElement, newElement)) {
        modifiedElements.push({
          element: newElement,
          changes: this.getElementChanges(oldElement, newElement),
        });
      }
    }

    // Find removed elements
    for (const oldElement of oldElements) {
      const newElement = newElements.find(e => e.id === oldElement.id);
      if (!newElement) {
        removedElements.push(oldElement);
      }
    }

    this.logger.debug(`Detected ${addedElements.length} added, ${removedElements.length} removed, ${modifiedElements.length} modified elements`);

    return {
      addedElements,
      removedElements,
      modifiedElements,
      addedMethods: [],
      removedMethods: [],
      modifiedMethods: [],
    };
  }

  /**
   * Check compatibility between POM versions
   */
  async checkCompatibility(oldPOM: POM, newPOM: POM): Promise<CompatibilityReport> {
    this.logger.debug('Checking POM compatibility');

    const breakingChanges: string[] = [];
    let backwardCompatible = true;
    let forwardCompatible = true;
    let migrationRequired = false;

    // Check for removed elements
    for (const oldElement of oldPOM.elements) {
      const newElement = newPOM.elements.find(e => e.id === oldElement.id);
      if (!newElement) {
        breakingChanges.push(`Element ${oldElement.id} was removed`);
        backwardCompatible = false;
        migrationRequired = true;
      }
    }

    // Check for modified elements
    for (const oldElement of oldPOM.elements) {
      const newElement = newPOM.elements.find(e => e.id === oldElement.id);
      if (newElement && this.hasElementChanged(oldElement, newElement)) {
        const changes = this.getElementChanges(oldElement, newElement);
        if (changes.some(change => change.attribute === 'cssSelector' || change.attribute === 'xpath')) {
          breakingChanges.push(`Element ${oldElement.id} selector changed`);
          backwardCompatible = false;
          migrationRequired = true;
        }
      }
    }

    // Check for removed methods
    for (const oldMethod of oldPOM.methods) {
      const newMethod = newPOM.methods.find(m => m.name === oldMethod.name);
      if (!newMethod) {
        breakingChanges.push(`Method ${oldMethod.name} was removed`);
        backwardCompatible = false;
        migrationRequired = true;
      }
    }

    const estimatedEffort = this.estimateMigrationEffort(breakingChanges);

    return {
      backwardCompatible,
      forwardCompatible,
      breakingChanges,
      migrationRequired,
      estimatedEffort,
    };
  }

  /**
   * Generate migration script
   */
  async generateMigrationScript(oldPOM: POM, newPOM: POM): Promise<string> {
    this.logger.debug('Generating migration script');

    const compatibility = await this.checkCompatibility(oldPOM, newPOM);
    let script = '';

    if (compatibility.migrationRequired) {
      script += `// Migration script for ${oldPOM.className} to ${newPOM.className}\n`;
      script += `// Generated on ${new Date().toISOString()}\n\n`;

      // Add breaking changes comments
      if (compatibility.breakingChanges.length > 0) {
        script += '// Breaking Changes:\n';
        for (const change of compatibility.breakingChanges) {
          script += `// - ${change}\n`;
        }
        script += '\n';
      }

      // Add migration code
      script += this.generateMigrationCode(oldPOM, newPOM);
    }

    return script;
  }

  /**
   * Increment version number
   */
  incrementVersion(version: string): string {
    const parts = version.split('.');
    const major = parseInt(parts[0] || '0');
    const minor = parseInt(parts[1] || '0');
    const patch = parseInt(parts[2] || '0');

    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * Check if element has changed
   */
  private hasElementChanged(oldElement: Element, newElement: Element): boolean {
    return oldElement.text !== newElement.text ||
           oldElement.value !== newElement.value ||
           oldElement.href !== newElement.href ||
           oldElement.src !== newElement.src ||
           oldElement.placeholder !== newElement.placeholder ||
           oldElement.title !== newElement.title ||
           oldElement.cssSelector !== newElement.cssSelector ||
           oldElement.xpath !== newElement.xpath;
  }

  /**
   * Get element changes
   */
  private getElementChanges(oldElement: Element, newElement: Element): any[] {
    const changes = [];

    if (oldElement.text !== newElement.text) {
      changes.push({
        attribute: 'text',
        oldValue: oldElement.text,
        newValue: newElement.text,
      });
    }

    if (oldElement.value !== newElement.value) {
      changes.push({
        attribute: 'value',
        oldValue: oldElement.value,
        newValue: newElement.value,
      });
    }

    if (oldElement.cssSelector !== newElement.cssSelector) {
      changes.push({
        attribute: 'cssSelector',
        oldValue: oldElement.cssSelector,
        newValue: newElement.cssSelector,
      });
    }

    if (oldElement.xpath !== newElement.xpath) {
      changes.push({
        attribute: 'xpath',
        oldValue: oldElement.xpath,
        newValue: newElement.xpath,
      });
    }

    return changes;
  }

  /**
   * Estimate migration effort
   */
  private estimateMigrationEffort(breakingChanges: string[]): 'low' | 'medium' | 'high' {
    if (breakingChanges.length === 0) {
      return 'low';
    } else if (breakingChanges.length <= 3) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Generate migration code
   */
  private generateMigrationCode(oldPOM: POM, newPOM: POM): string {
    let code = '';

    // Generate method updates
    for (const oldMethod of oldPOM.methods) {
      const newMethod = newPOM.methods.find(m => m.name === oldMethod.name);
      if (!newMethod) {
        code += `// Method ${oldMethod.name} was removed - update calling code\n`;
      } else if (oldMethod.body !== newMethod.body) {
        code += `// Method ${oldMethod.name} implementation changed\n`;
        code += `// Old: ${oldMethod.body}\n`;
        code += `// New: ${newMethod.body}\n\n`;
      }
    }

    // Generate element updates
    for (const oldElement of oldPOM.elements) {
      const newElement = newPOM.elements.find(e => e.id === oldElement.id);
      if (!newElement) {
        code += `// Element ${oldElement.id} was removed - update selectors\n`;
      } else if (oldElement.cssSelector !== newElement.cssSelector) {
        code += `// Element ${oldElement.id} selector changed\n`;
        code += `// Old: ${oldElement.cssSelector}\n`;
        code += `// New: ${newElement.cssSelector}\n\n`;
      }
    }

    return code;
  }
} 