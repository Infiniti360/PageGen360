import { Element, POMMethod, EnhancedGenerationOptions } from '../types';
import { FrameworkConfiguration } from './FrameworkConfig';
import { MethodTemplates } from './templates/MethodTemplates';
import { Logger } from '../utils/Logger';

/**
 * Enhanced Code Generator for Page Object Models with framework-specific implementations
 */
export class EnhancedCodeGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Generate comprehensive POM code with industrial standards and framework-specific patterns
   */
  async generateCode(
    elements: Element[], 
    methods: POMMethod[], 
    options: EnhancedGenerationOptions
  ): Promise<{
    imports: string[];
    className: string;
    code: string;
    interfaces: string[];
    testCode: string;
    metadata: any;
  }> {
    this.logger.debug('Starting enhanced code generation with framework-specific patterns');

    const imports = this.generateEnhancedImports(options);
    const className = this.generateEnhancedClassName(options);
    const interfaces = this.generateInterfaces(elements, options);
    const code = this.generateEnhancedClassCode(elements, methods, options);
    const testCode = this.generateTestCode(className, options);
    const metadata = this.generateMetadata(elements, methods, options);

    this.logger.debug('Enhanced code generation completed');

    return {
      imports,
      className,
      code,
      interfaces,
      testCode,
      metadata,
    };
  }

  /**
   * Generate enhanced imports with framework-specific organization
   */
  private generateEnhancedImports(options: EnhancedGenerationOptions): string[] {
    const imports: string[] = [];
    const frameworkConfig = FrameworkConfiguration.getConfig(options.framework);

    // Framework-specific imports
    imports.push(...frameworkConfig.imports);

    // Base class import
    imports.push(`import { ${frameworkConfig.baseClass} } from './base/${frameworkConfig.baseClass}';`);

    // Utility imports
    imports.push(...this.generateUtilityImports(options));

    return imports;
  }

  /**
   * Generate utility imports
   */
  private generateUtilityImports(options: EnhancedGenerationOptions): string[] {
    const imports: string[] = [];

    if (options.includeAccessibilityChecks) {
      imports.push('import { AccessibilityValidator } from \'../utils/AccessibilityValidator\';');
    }

    if (options.includeResponsiveValidation) {
      imports.push('import { ResponsiveValidator } from \'../utils/ResponsiveValidator\';');
    }

    return imports;
  }

  /**
   * Generate enhanced class name
   */
  private generateEnhancedClassName(options: EnhancedGenerationOptions): string {
    const url = options.url || 'Page';
    const domain = this.extractDomain(url);
    const pageName = this.extractPageName(url);
    
    return `${this.capitalize(domain)}${this.capitalize(pageName)}Page`;
  }

  /**
   * Generate interfaces for the POM
   */
  private generateInterfaces(elements: Element[], options: EnhancedGenerationOptions): string[] {
    const interfaces: string[] = [];

    // Page info interface
    interfaces.push(`
export interface PageInfo {
  title: string;
  url: string;
  elements: ElementInfo[];
  timestamp: Date;
}

export interface ElementInfo {
  id: string;
  tagName: string;
  text?: string;
  isVisible: boolean;
  isInteractive: boolean;
}`);

    return interfaces;
  }

  /**
   * Generate enhanced class code with framework-specific patterns
   */
  private generateEnhancedClassCode(
    elements: Element[], 
    methods: POMMethod[], 
    options: EnhancedGenerationOptions
  ): string {
    const frameworkConfig = FrameworkConfiguration.getConfig(options.framework);
    const baseClass = frameworkConfig.baseClass;
    const constructor = this.generateConstructor(options);
    const locators = this.generateLocators(elements, options);
    const elementMethods = this.generateElementMethods(methods, options);
    const utilityMethods = this.generateUtilityMethods(methods, options);
    const validationMethods = this.generateValidationMethods(methods, options);

    return `
/**
 * ${this.generateEnhancedClassName(options)} - Enhanced Page Object Model
 * 
 * This class provides a clean, semantic interface for interacting with
 * the ${this.extractPageName(options.url || '')} page elements and functionality.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since ${new Date().getFullYear()}-01-01
 */
export class ${this.generateEnhancedClassName(options)} extends ${baseClass} {
  ${constructor}
  
  ${locators}
  
  ${elementMethods}
  
  ${utilityMethods}
  
  ${validationMethods}
}`;
  }

  /**
   * Generate constructor based on framework
   */
  private generateConstructor(options: EnhancedGenerationOptions): string {
    const frameworkConfig = FrameworkConfiguration.getConfig(options.framework);
    
    switch (options.framework) {
      case 'cypress':
        return `
  constructor() {
    super();
    this.initializeSelectors();
  }`;
        
      case 'playwright':
        return `
  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }`;
        
      case 'selenium':
        return `
  constructor(driver: WebDriver) {
    super(driver);
    this.initializeElements();
  }`;
        
      case 'puppeteer':
        return `
  constructor(page: Page) {
    super(page);
    this.initializeElements();
  }`;
        
      default:
        return `
  constructor() {
    super();
  }`;
    }
  }

  /**
   * Generate locators/selectors based on framework
   */
  private generateLocators(elements: Element[], options: EnhancedGenerationOptions): string {
    const frameworkConfig = FrameworkConfiguration.getConfig(options.framework);
    
    switch (frameworkConfig.locatorPattern) {
      case 'cypress':
        return this.generateCypressSelectors(elements);
      case 'locator':
        return this.generatePlaywrightLocators(elements);
      case 'element':
        return this.generateSeleniumElements(elements);
      default:
        return this.generateGenericSelectors(elements);
    }
  }

  /**
   * Generate Cypress selectors
   */
  private generateCypressSelectors(elements: Element[]): string {
    let selectors = `
  // Page elements with semantic naming
  private readonly selectors = {`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'cypress');
      selectors += `
    ${element.id}: '${selector}',`;
    }

    selectors += `
  };

  private initializeSelectors(): void {
    // Selectors are already defined above
  }`;

    return selectors;
  }

  /**
   * Generate Playwright locators
   */
  private generatePlaywrightLocators(elements: Element[]): string {
    let locators = `
  // Page elements with semantic naming
  private readonly locators: Record<string, Locator> = {};`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'playwright');
      locators += `
    private readonly ${element.id}Locator: Locator;`;
    }

    locators += `

  private initializeLocators(): void {`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'playwright');
      locators += `
    this.${element.id}Locator = this.page.locator('${selector}');`;
    }

    locators += `
  }`;

    return locators;
  }

  /**
   * Generate Selenium elements
   */
  private generateSeleniumElements(elements: Element[]): string {
    let elementsCode = `
  // Page elements with semantic naming
  private readonly elements: Record<string, WebElement> = {};`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'selenium');
      elementsCode += `
    private readonly ${element.id}Element: WebElement;`;
    }

    elementsCode += `

  private initializeElements(): void {`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'selenium');
      elementsCode += `
    this.${element.id}Element = this.driver.findElement(By.css('${selector}'));`;
    }

    elementsCode += `
  }`;

    return elementsCode;
  }

  /**
   * Generate generic selectors
   */
  private generateGenericSelectors(elements: Element[]): string {
    let selectors = `
  // Page elements with semantic naming
  private readonly selectors = {`;

    for (const element of elements) {
      const selector = this.getBestSelector(element, 'generic');
      selectors += `
    ${element.id}: '${selector}',`;
    }

    selectors += `
  };`;

    return selectors;
  }

  /**
   * Generate element methods
   */
  private generateElementMethods(methods: POMMethod[], options: EnhancedGenerationOptions): string {
    let methodsCode = '';

    for (const method of methods) {
      if (method.methodType === 'getter' || method.methodType === 'assertion' || 
          method.methodType === 'action' || method.methodType === 'inputAction') {
        methodsCode += this.generateMethodCode(method, options);
      }
    }

    return methodsCode;
  }

  /**
   * Generate utility methods
   */
  private generateUtilityMethods(methods: POMMethod[], options: EnhancedGenerationOptions): string {
    let methodsCode = '';

    for (const method of methods) {
      if (method.methodType === 'utility') {
        methodsCode += this.generateMethodCode(method, options);
      }
    }

    return methodsCode;
  }

  /**
   * Generate validation methods
   */
  private generateValidationMethods(methods: POMMethod[], options: EnhancedGenerationOptions): string {
    let methodsCode = '';

    for (const method of methods) {
      if (method.methodType === 'validation') {
        methodsCode += this.generateMethodCode(method, options);
      }
    }

    return methodsCode;
  }

  /**
   * Generate individual method code
   */
  private generateMethodCode(method: POMMethod, options: EnhancedGenerationOptions): string {
    const frameworkConfig = FrameworkConfiguration.getConfig(options.framework);
    const isAsync = frameworkConfig.asyncSupport;
    const asyncKeyword = isAsync ? 'async ' : '';
    const returnType = method.supportsChaining ? frameworkConfig.chainingReturnType : method.returnType;
    
    let methodCode = `
  /**
   * ${method.description}
   */`;

    if (method.parameters.length > 0) {
      const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
      methodCode += `
  ${asyncKeyword}${method.name}(${params}): ${returnType} {`;
    } else {
      methodCode += `
  ${asyncKeyword}${method.name}(): ${returnType} {`;
    }

    methodCode += `
    ${this.generateMethodBody(method, options)}
    ${method.supportsChaining ? 'return this;' : ''}
  }`;

    return methodCode;
  }

  /**
   * Generate method body based on framework and method type
   */
  private generateMethodBody(method: POMMethod, options: EnhancedGenerationOptions): string {
    const framework = options.framework;
    const methodType = method.methodType;
    
    // Use method templates to generate appropriate body
    const template = MethodTemplates.getTemplate(methodType, framework);
    
    if (template) {
      // Replace placeholders in template
      return template
        .replace('${elementName}', this.capitalize(method.elementId || 'Element'))
        .replace('${selector}', this.getBestSelectorForMethod(method, options))
        .replace('${className}', this.generateEnhancedClassName(options));
    }
    
    // Fallback to basic implementation
    return `// ${method.description}`;
  }

  /**
   * Generate test code
   */
  private generateTestCode(className: string, options: EnhancedGenerationOptions): string {
    const framework = options.framework;
    
    switch (framework) {
      case 'cypress':
        return this.generateCypressTestCode(className);
      case 'playwright':
        return this.generatePlaywrightTestCode(className);
      case 'selenium':
        return this.generateSeleniumTestCode(className);
      default:
        return this.generateGenericTestCode(className);
    }
  }

  /**
   * Generate Cypress test code
   */
  private generateCypressTestCode(className: string): string {
    return `
describe('${className}', () => {
  let page: ${className};

  beforeEach(() => {
    page = new ${className}();
  });

  it('should load the page successfully', () => {
    page.visitHomePage()
      .waitForPageLoad()
      .validatePageStructure()
      .assertPageTitle('Expected Title');
  });

  it('should validate all page elements', () => {
    page.validatePage()
      .validateAccessibility()
      .validateResponsiveDesign();
  });
});`;
  }

  /**
   * Generate Playwright test code
   */
  private generatePlaywrightTestCode(className: string): string {
    return `
import { test, expect } from '@playwright/test';

test.describe('${className}', () => {
  let page: ${className};

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new ${className}(playwrightPage);
  });

  test('should load the page successfully', async () => {
    await page.navigateToPage('https://example.com');
    await page.waitForPageLoad();
    await page.validatePageStructure();
    const title = await page.getPageTitle();
    expect(title).toBe('Expected Title');
  });

  test('should validate all page elements', async () => {
    await page.validatePage();
    await page.validateAccessibility();
    await page.validateResponsiveDesign();
  });
});`;
  }

  /**
   * Generate Selenium test code
   */
  private generateSeleniumTestCode(className: string): string {
    return `
import { WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';

describe('${className}', () => {
  let driver: WebDriver;
  let page: ${className};

  before(async () => {
    // Initialize WebDriver
    driver = await new Builder().forBrowser('chrome').build();
    page = new ${className}(driver);
  });

  after(async () => {
    await driver.quit();
  });

  it('should load the page successfully', async () => {
    await page.navigateToPage('https://example.com');
    await page.waitForPageLoad();
    await page.validatePageStructure();
    const title = await page.getPageTitle();
    expect(title).to.equal('Expected Title');
  });

  it('should validate all page elements', async () => {
    await page.validatePage();
    await page.validateAccessibility();
    await page.validateResponsiveDesign();
  });
});`;
  }

  /**
   * Generate generic test code
   */
  private generateGenericTestCode(className: string): string {
    return `
describe('${className}', () => {
  let page: ${className};

  beforeEach(() => {
    page = new ${className}();
  });

  it('should load the page successfully', () => {
    // Test implementation
  });
});`;
  }

  /**
   * Generate metadata
   */
  private generateMetadata(elements: Element[], methods: POMMethod[], options: EnhancedGenerationOptions): any {
    return {
      framework: options.framework,
      language: options.language,
      enhanced: true,
      methodChaining: options.includeMethodChaining,
      comprehensiveAssertions: options.includeComprehensiveAssertions,
      utilityMethods: options.includeUtilityMethods,
      validationMethods: options.includeValidationMethods,
      accessibilityChecks: options.includeAccessibilityChecks,
      responsiveValidation: options.includeResponsiveValidation,
      totalElements: elements.length,
      totalMethods: methods.length,
      generatedAt: new Date().toISOString()
    };
  }

  // Helper methods
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/\./g, '');
    } catch {
      return 'Page';
    }
  }

  private extractPageName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      return pathParts[pathParts.length - 1] || 'Home';
    } catch {
      return 'Home';
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getBestSelector(element: Element, framework: string): string {
    // Priority: data-testid > id > class > tag
    if (element.attributes['data-testid']) {
      return `[data-testid="${element.attributes['data-testid']}"]`;
    }
    if (element.elementId) {
      return `#${element.elementId}`;
    }
    if (element.className) {
      return `.${element.className.split(' ')[0]}`;
    }
    return element.tagName;
  }

  private getBestSelectorForMethod(method: POMMethod, options: EnhancedGenerationOptions): string {
    // This would need to be implemented based on the method's elementId
    return 'selector';
  }
}
