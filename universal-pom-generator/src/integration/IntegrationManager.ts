import { Logger } from '../utils/Logger';

export class IntegrationManager {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Create tool adapter
   */
  async createToolAdapter(tool: string): Promise<any> {
    this.logger.debug(`Creating adapter for tool: ${tool}`);

    try {
      switch (tool) {
        case 'selenium':
          return this.createSeleniumAdapter();
        case 'playwright':
          return this.createPlaywrightAdapter();
        case 'cypress':
          return this.createCypressAdapter();
        case 'puppeteer':
          return this.createPuppeteerAdapter();
        default:
          throw new Error(`Unsupported tool: ${tool}`);
      }
    } catch (error) {
      this.logger.error(`Tool adapter creation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Create Selenium adapter
   */
  private createSeleniumAdapter(): any {
    return {
      name: 'selenium',
      imports: [
        'import { Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";',
        'import { Options } from "selenium-webdriver/chrome";',
      ],
      setup: `
        const driver = new Builder()
          .forBrowser('chrome')
          .setChromeOptions(new Options().addArguments('--headless'))
          .build();
      `,
      teardown: 'await driver.quit();',
      elementFinder: 'driver.findElement(By.css(selector))',
      waitStrategy: 'new WebDriverWait(driver, Duration.ofSeconds(timeout))',
    };
  }

  /**
   * Create Playwright adapter
   */
  private createPlaywrightAdapter(): any {
    return {
      name: 'playwright',
      imports: [
        'import { chromium, Page, Locator } from "playwright";',
      ],
      setup: `
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
      `,
      teardown: 'await browser.close();',
      elementFinder: 'page.locator(selector)',
      waitStrategy: 'page.waitForSelector(selector, { timeout: timeout })',
    };
  }

  /**
   * Create Cypress adapter
   */
  private createCypressAdapter(): any {
    return {
      name: 'cypress',
      imports: [
        '/// <reference types="cypress" />',
      ],
      setup: '',
      teardown: '',
      elementFinder: 'cy.get(selector)',
      waitStrategy: 'cy.get(selector).should("be.visible")',
    };
  }

  /**
   * Create Puppeteer adapter
   */
  private createPuppeteerAdapter(): any {
    return {
      name: 'puppeteer',
      imports: [
        'import puppeteer, { Page, ElementHandle } from "puppeteer";',
      ],
      setup: `
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
      `,
      teardown: 'await browser.close();',
      elementFinder: 'page.$(selector)',
      waitStrategy: 'page.waitForSelector(selector, { timeout: timeout })',
    };
  }

  /**
   * Generate tool-specific code
   */
  async generateToolSpecificCode(tool: string, pom: any): Promise<string> {
    this.logger.debug(`Generating tool-specific code for: ${tool}`);

    try {
      const adapter = await this.createToolAdapter(tool);
      
      let code = '';
      
      // Add imports
      code += adapter.imports.join('\n') + '\n\n';
      
      // Add class definition
      code += `export class ${pom.className} {\n`;
      code += `  constructor(private ${adapter.name === 'cypress' ? '' : adapter.name === 'selenium' ? 'driver: WebDriver' : 'page: Page'}) {}\n\n`;
      
      // Add methods
      for (const method of pom.methods) {
        code += `  ${method.name}() {\n`;
        code += `    ${method.body}\n`;
        code += `  }\n\n`;
      }
      
      code += '}\n';
      
      return code;
    } catch (error) {
      this.logger.error(`Tool-specific code generation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Check compatibility between framework, language, and browser
   */
  async checkCompatibility(config: { framework: string; language: string; browser: string }): Promise<any> {
    this.logger.debug(`Checking compatibility for: ${config.framework}, ${config.language}, ${config.browser}`);

    try {
      const compatibility = {
        framework: config.framework,
        language: config.language,
        browser: config.browser,
        compatible: true,
        issues: [] as string[],
        recommendations: [] as string[]
      };

      // Check framework-language compatibility
      const frameworkLanguageCompatibility: Record<string, string[]> = {
        playwright: ['typescript', 'javascript', 'python', 'java', 'csharp'],
        selenium: ['typescript', 'javascript', 'python', 'java', 'csharp'],
        cypress: ['typescript', 'javascript'],
        puppeteer: ['typescript', 'javascript', 'python'],
        testcafe: ['typescript', 'javascript']
      };

      if (!frameworkLanguageCompatibility[config.framework]?.includes(config.language)) {
        compatibility.compatible = false;
        compatibility.issues.push(`${config.framework} doesn't support ${config.language}`);
        compatibility.recommendations.push(`Use one of: ${frameworkLanguageCompatibility[config.framework]?.join(', ')}`);
      }

      // Check browser compatibility
      const browserCompatibility: Record<string, string[]> = {
        chrome: ['playwright', 'selenium', 'puppeteer', 'cypress', 'testcafe'],
        firefox: ['playwright', 'selenium', 'cypress'],
        safari: ['playwright', 'selenium'],
        edge: ['playwright', 'selenium']
      };

      if (!browserCompatibility[config.browser]?.includes(config.framework)) {
        compatibility.compatible = false;
        compatibility.issues.push(`${config.browser} doesn't support ${config.framework}`);
        compatibility.recommendations.push(`Use one of: ${browserCompatibility[config.browser]?.join(', ')}`);
      }

      return {
        success: true,
        compatibility
      };
    } catch (error) {
      this.logger.error(`Compatibility check failed: ${error}`);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
} 