import { FrameworkConfig } from '../types';

/**
 * Framework-specific configurations for different automation tools
 */
export class FrameworkConfiguration {
  private static readonly frameworkConfigs: Record<string, FrameworkConfig> = {
    cypress: {
      baseClass: 'CypressBasePage',
      imports: [
        'import BasePage from \'./BasePage\';',
        'import { cy } from \'cypress\';'
      ],
      locatorPattern: 'cypress',
      chainingReturnType: 'this',
      asyncSupport: false,
      assertionLibrary: 'cypress'
    },
    playwright: {
      baseClass: 'PlaywrightBasePage',
      imports: [
        'import { Page, Locator, expect } from \'@playwright/test\';',
        'import { test, expect } from \'@playwright/test\';'
      ],
      locatorPattern: 'locator',
      chainingReturnType: 'Promise<this>',
      asyncSupport: true,
      assertionLibrary: '@playwright/test'
    },
    selenium: {
      baseClass: 'SeleniumBasePage',
      imports: [
        'import { WebDriver, WebElement, By } from \'selenium-webdriver\';',
        'import { expect } from \'chai\';'
      ],
      locatorPattern: 'element',
      chainingReturnType: 'this',
      asyncSupport: false,
      assertionLibrary: 'chai'
    },
    puppeteer: {
      baseClass: 'PuppeteerBasePage',
      imports: [
        'import { Page, ElementHandle } from \'puppeteer\';',
        'import { expect } from \'chai\';'
      ],
      locatorPattern: 'element',
      chainingReturnType: 'Promise<this>',
      asyncSupport: true,
      assertionLibrary: 'chai'
    },
    testcafe: {
      baseClass: 'TestCafeBasePage',
      imports: [
        'import { Selector } from \'testcafe\';',
        'import { t } from \'testcafe\';'
      ],
      locatorPattern: 'selector',
      chainingReturnType: 'this',
      asyncSupport: false,
      assertionLibrary: 'testcafe'
    }
  };

  /**
   * Get framework configuration
   */
  static getConfig(framework: string): FrameworkConfig {
    const config = this.frameworkConfigs[framework];
    if (!config) {
      throw new Error(`Unsupported framework: ${framework}`);
    }
    return config;
  }

  /**
   * Get all supported frameworks
   */
  static getSupportedFrameworks(): string[] {
    return Object.keys(this.frameworkConfigs);
  }

  /**
   * Check if framework supports async operations
   */
  static supportsAsync(framework: string): boolean {
    return this.getConfig(framework).asyncSupport;
  }

  /**
   * Get chaining return type for framework
   */
  static getChainingReturnType(framework: string): string {
    return this.getConfig(framework).chainingReturnType;
  }
}
