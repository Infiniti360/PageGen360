import { Element, POMMethod, POMParameter, GenerationOptions } from '../types';
import { Logger } from '../utils/Logger';

export class POMMethodGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('debug').child('POMMethodGenerator');
  }

  /**
   * Generate POM methods for all elements
   */
  async generateMethods(elements: Element[], options: GenerationOptions): Promise<POMMethod[]> {
    this.logger.debug('Starting POM method generation');

    const methods: POMMethod[] = [];

    for (const element of elements) {
      const elementMethods = await this.generateMethodsForElement(element, options);
      methods.push(...elementMethods);
    }

    // Add common utility methods
    const utilityMethods = this.generateUtilityMethods(options);
    methods.push(...utilityMethods);

    this.logger.debug(`Generated ${methods.length} methods`);
    return methods;
  }

  /**
   * Generate methods for a specific element
   */
  private async generateMethodsForElement(element: Element, options: GenerationOptions): Promise<POMMethod[]> {
    const methods: POMMethod[] = [];

    // Generate getter method
    const getterMethod = this.generateGetterMethod(element, options);
    methods.push(getterMethod);

    // Generate setter method for input elements
    if (this.isInputElement(element)) {
      const setterMethod = this.generateSetterMethod(element, options);
      methods.push(setterMethod);
    }

    // Generate action methods for interactive elements
    if (this.isInteractiveElement(element)) {
      const actionMethod = this.generateActionMethod(element, options);
      methods.push(actionMethod);
    }

    // Generate wait methods
    const waitMethod = this.generateWaitMethod(element, options);
    methods.push(waitMethod);

    return methods;
  }

  /**
   * Generate getter method for element
   */
  private generateGetterMethod(element: Element, options: GenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'get');
    const returnType = this.getReturnType(element);
    // const selector = this.getBestSelector(element, options.framework);

    const body = this.generateGetterBody(element, options);

    return {
      name: methodName,
      returnType,
      parameters: [],
      body,
      description: `Get the ${element.tagName} element`,
      elementId: element.id,
      isGetter: true,
      isSetter: false,
      isAction: false,
    };
  }

  /**
   * Generate setter method for input element
   */
  private generateSetterMethod(element: Element, options: GenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'set');
    // const selector = this.getBestSelector(element, options.framework);

    const parameter: POMParameter = {
      name: 'value',
      type: 'string',
      required: true,
    };

    const body = this.generateSetterBody(element, options);

    return {
      name: methodName,
      returnType: 'void',
      parameters: [parameter],
      body,
      description: `Set value for ${element.tagName} element`,
      elementId: element.id,
      isGetter: false,
      isSetter: true,
      isAction: false,
    };
  }

  /**
   * Generate action method for interactive element
   */
  private generateActionMethod(element: Element, options: GenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'click');
    // const selector = this.getBestSelector(element, options.framework);

    const body = this.generateActionBody(element, options);

    return {
      name: methodName,
      returnType: 'void',
      parameters: [],
      body,
      description: `Click the ${element.tagName} element`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: true,
    };
  }

  /**
   * Generate wait method for element
   */
  private generateWaitMethod(element: Element, options: GenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'wait');
    // const selector = this.getBestSelector(element, options.framework);

    const parameter: POMParameter = {
      name: 'timeout',
      type: 'number',
      defaultValue: '5000',
      required: false,
    };

    const body = this.generateWaitBody(element, options);

    return {
      name: methodName,
      returnType: 'void',
      parameters: [parameter],
      body,
      description: `Wait for ${element.tagName} element to be visible`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: false,
    };
  }

  /**
   * Generate utility methods
   */
  private generateUtilityMethods(options: GenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];

    // Wait for page load
    methods.push({
      name: 'waitForPageLoad',
      returnType: 'void',
      parameters: [],
      body: this.generateWaitForPageLoadBody(options),
      description: 'Wait for page to load completely',
      isGetter: false,
      isSetter: false,
      isAction: false,
    });

    // Get page title
    methods.push({
      name: 'getPageTitle',
      returnType: 'string',
      parameters: [],
      body: this.generateGetPageTitleBody(options),
      description: 'Get the page title',
      isGetter: true,
      isSetter: false,
      isAction: false,
    });

    // Take screenshot
    methods.push({
      name: 'takeScreenshot',
      returnType: 'string',
      parameters: [{
        name: 'filename',
        type: 'string',
        required: false,
      }],
      body: this.generateTakeScreenshotBody(options),
      description: 'Take a screenshot of the page',
      isGetter: false,
      isSetter: false,
      isAction: false,
    });

    return methods;
  }

  /**
   * Generate method name for element
   */
  private generateMethodName(element: Element, action: string): string {
    let name = action;

    if (element.id) {
      name += element.id.charAt(0).toUpperCase() + element.id.slice(1);
    } else if (element.className) {
      const className = element.className && typeof element.className === 'string' 
        ? element.className.split(' ')[0] 
        : '';
      if (className) {
        name += className.charAt(0).toUpperCase() + className.slice(1);
      }
    } else if (element.text) {
      const text = element.text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '');
      name += text.charAt(0).toUpperCase() + text.slice(1);
    } else if (element.placeholder) {
      const placeholder = element.placeholder.replace(/[^a-zA-Z0-9]/g, '');
      name += placeholder.charAt(0).toUpperCase() + placeholder.slice(1);
    } else {
      name += element.tagName.charAt(0).toUpperCase() + element.tagName.slice(1);
    }

    return name;
  }

  /**
   * Get return type for element
   */
  private getReturnType(element: Element): string {
    switch (element.tagName) {
      case 'input':
        switch (element.type) {
          case 'checkbox':
            return 'boolean';
          case 'number':
            return 'number';
          default:
            return 'string';
        }
      case 'select':
        return 'string';
      case 'textarea':
        return 'string';
      default:
        return 'WebElement';
    }
  }

  /**
   * Get best selector for framework
   */
  private getBestSelector(element: Element, _framework: string): string {
    // Prefer ID, then data attributes, then CSS selector, then XPath
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.attributes['data-testid']) {
      return `[data-testid="${element.attributes['data-testid']}"]`;
    }

    if (element.attributes['data-cy']) {
      return `[data-cy="${element.attributes['data-cy']}"]`;
    }

    if (element.cssSelector) {
      return element.cssSelector;
    }

    return element.xpath || '';
  }

  /**
   * Check if element is input
   */
  private isInputElement(element: Element): boolean {
    return element.tagName === 'input' || 
           element.tagName === 'textarea' || 
           element.tagName === 'select';
  }

  /**
   * Check if element is interactive
   */
  private isInteractiveElement(element: Element): boolean {
    return element.isInteractive;
  }

  /**
   * Generate getter method body
   */
  private generateGetterBody(element: Element, options: GenerationOptions): string {
    const selector = this.getBestSelector(element, options.framework);
    
    switch (options.framework) {
      case 'selenium':
        return `return driver.findElement(By.css("${selector}"));`;
      case 'playwright':
        return `return page.locator("${selector}");`;
      case 'cypress':
        return `return cy.get("${selector}");`;
      case 'puppeteer':
        return `return page.$("${selector}");`;
      default:
        return `return driver.findElement(By.css("${selector}"));`;
    }
  }

  /**
   * Generate setter method body
   */
  private generateSetterBody(element: Element, options: GenerationOptions): string {
    const selector = this.getBestSelector(element, options.framework);
    
    switch (options.framework) {
      case 'selenium':
        return `driver.findElement(By.css("${selector}")).clear();
        driver.findElement(By.css("${selector}")).sendKeys(value);`;
      case 'playwright':
        return `page.locator("${selector}").fill(value);`;
      case 'cypress':
        return `cy.get("${selector}").clear().type(value);`;
      case 'puppeteer':
        return `await page.$("${selector}").then(el => el.type(value));`;
      default:
        return `driver.findElement(By.css("${selector}")).clear();
        driver.findElement(By.css("${selector}")).sendKeys(value);`;
    }
  }

  /**
   * Generate action method body
   */
  private generateActionBody(element: Element, options: GenerationOptions): string {
    const selector = this.getBestSelector(element, options.framework);
    
    switch (options.framework) {
      case 'selenium':
        return `driver.findElement(By.css("${selector}")).click();`;
      case 'playwright':
        return `page.locator("${selector}").click();`;
      case 'cypress':
        return `cy.get("${selector}").click();`;
      case 'puppeteer':
        return `await page.$("${selector}").then(el => el.click());`;
      default:
        return `driver.findElement(By.css("${selector}")).click();`;
    }
  }

  /**
   * Generate wait method body
   */
  private generateWaitBody(element: Element, options: GenerationOptions): string {
    const selector = this.getBestSelector(element, options.framework);
    
    switch (options.framework) {
      case 'selenium':
        return `new WebDriverWait(driver, Duration.ofMillis(timeout))
          .until(ExpectedConditions.visibilityOfElementLocated(By.css("${selector}")));`;
      case 'playwright':
        return `page.locator("${selector}").waitFor({ timeout: timeout });`;
      case 'cypress':
        return `cy.get("${selector}").should('be.visible');`;
      case 'puppeteer':
        return `await page.waitForSelector("${selector}", { timeout: timeout });`;
      default:
        return `new WebDriverWait(driver, Duration.ofMillis(timeout))
          .until(ExpectedConditions.visibilityOfElementLocated(By.css("${selector}")));`;
    }
  }

  /**
   * Generate wait for page load body
   */
  private generateWaitForPageLoadBody(options: GenerationOptions): string {
    switch (options.framework) {
      case 'selenium':
        return `new WebDriverWait(driver, Duration.ofSeconds(10))
          .until(webDriver -> ((JavascriptExecutor) webDriver)
            .executeScript("return document.readyState").equals("complete"));`;
      case 'playwright':
        return `page.waitForLoadState('networkidle');`;
      case 'cypress':
        return `cy.wait(1000);`;
      case 'puppeteer':
        return `await page.waitForLoadState('networkidle');`;
      default:
        return `new WebDriverWait(driver, Duration.ofSeconds(10))
          .until(webDriver -> ((JavascriptExecutor) webDriver)
            .executeScript("return document.readyState").equals("complete"));`;
    }
  }

  /**
   * Generate get page title body
   */
  private generateGetPageTitleBody(options: GenerationOptions): string {
    switch (options.framework) {
      case 'selenium':
        return `return driver.getTitle();`;
      case 'playwright':
        return `return page.title();`;
      case 'cypress':
        return `return cy.title();`;
      case 'puppeteer':
        return `return page.title();`;
      default:
        return `return driver.getTitle();`;
    }
  }

  /**
   * Generate take screenshot body
   */
  private generateTakeScreenshotBody(options: GenerationOptions): string {
    switch (options.framework) {
      case 'selenium':
        return `File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        return screenshot.getAbsolutePath();`;
      case 'playwright':
        return `const screenshotPath = filename || 'screenshot.png';
        await page.screenshot({ path: screenshotPath });
        return screenshotPath;`;
      case 'cypress':
        return `cy.screenshot(filename || 'screenshot');`;
      case 'puppeteer':
        return `const screenshotPath = filename || 'screenshot.png';
        await page.screenshot({ path: screenshotPath });
        return screenshotPath;`;
      default:
        return `File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        return screenshot.getAbsolutePath();`;
    }
  }

  /**
   * Generate methods for changes
   */
  async generateMethodsForChanges(changes: any, options: GenerationOptions): Promise<POMMethod[]> {
    const methods: POMMethod[] = [];

    // Generate methods for added elements
    for (const element of changes.addedElements || []) {
      const elementMethods = await this.generateMethodsForElement(element, options);
      methods.push(...elementMethods);
    }

    // Generate methods for modified elements
    for (const element of changes.modifiedElements || []) {
      const elementMethods = await this.generateMethodsForElement(element, options);
      methods.push(...elementMethods);
    }

    return methods;
  }
} 