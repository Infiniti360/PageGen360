import { Element, POMMethod, POMParameter, EnhancedGenerationOptions } from '../types';
import { FrameworkConfiguration } from './FrameworkConfig';
import { MethodTemplates } from './templates/MethodTemplates';
import { Logger } from '../utils/Logger';

/**
 * Enhanced POM Method Generator with comprehensive method generation and chaining support
 */
export class EnhancedPOMMethodGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('debug').child('EnhancedPOMMethodGenerator');
  }

  /**
   * Generate comprehensive POM methods for all elements
   */
  async generateMethods(elements: Element[], options: EnhancedGenerationOptions): Promise<POMMethod[]> {
    this.logger.debug('Starting enhanced POM method generation');

    const methods: POMMethod[] = [];

    for (const element of elements) {
      const elementMethods = await this.generateMethodsForElement(element, options);
      methods.push(...elementMethods);
    }

    // Add common utility methods
    const utilityMethods = this.generateUtilityMethods(options);
    methods.push(...utilityMethods);

    // Add validation methods
    const validationMethods = this.generateValidationMethods(options);
    methods.push(...validationMethods);

    // Add accessibility and responsive validation methods
    if (options.includeAccessibilityChecks) {
      const accessibilityMethods = this.generateAccessibilityMethods(options);
      methods.push(...accessibilityMethods);
    }

    if (options.includeResponsiveValidation) {
      const responsiveMethods = this.generateResponsiveValidationMethods(options);
      methods.push(...responsiveMethods);
    }

    this.logger.debug(`Generated ${methods.length} enhanced methods`);
    return methods;
  }

  /**
   * Generate comprehensive methods for a specific element
   */
  private async generateMethodsForElement(element: Element, options: EnhancedGenerationOptions): Promise<POMMethod[]> {
    const methods: POMMethod[] = [];

    // Generate getter method
    const getterMethod = this.generateGetterMethod(element, options);
    methods.push(getterMethod);

    // Generate assertion methods
    const assertionMethods = this.generateAssertionMethods(element, options);
    methods.push(...assertionMethods);

    // Generate action methods for interactive elements
    if (this.isInteractiveElement(element)) {
      const actionMethods = this.generateActionMethods(element, options);
      methods.push(...actionMethods);
    }

    // Generate setter method for input elements
    if (this.isInputElement(element)) {
      const setterMethod = this.generateSetterMethod(element, options);
      methods.push(setterMethod);
    }

    // Generate wait methods
    const waitMethod = this.generateWaitMethod(element, options);
    methods.push(waitMethod);

    return methods;
  }

  /**
   * Generate getter method for element
   */
  private generateGetterMethod(element: Element, options: EnhancedGenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'get');
    const returnType = this.getReturnType(element, options.framework);
    const selector = this.getBestSelector(element, options.framework);

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
      isAssertion: false,
      supportsChaining: false,
      frameworkSpecific: false,
      methodType: 'getter'
    };
  }

  /**
   * Generate comprehensive assertion methods for element
   */
  private generateAssertionMethods(element: Element, options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];
    const selector = this.getBestSelector(element, options.framework);
    const elementName = this.capitalize(element.id);

    // Visibility assertion
    methods.push({
      name: `assert${elementName}Visible`,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateAssertionBody(element, options, 'assertion'),
      description: `Assert that ${element.tagName} is visible`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: true,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'assertion'
    });

    // Text assertion for text-containing elements
    if (element.text || element.placeholder) {
      methods.push({
        name: `assert${elementName}Text`,
        returnType: this.getChainingReturnType(options.framework),
        parameters: [{
          name: 'expectedText',
          type: 'string',
          required: true
        }],
        body: this.generateAssertionBody(element, options, 'textAssertion'),
        description: `Assert that ${element.tagName} contains expected text`,
        elementId: element.id,
        isGetter: false,
        isSetter: false,
        isAction: false,
        isAssertion: true,
        supportsChaining: true,
        frameworkSpecific: false,
        methodType: 'textAssertion'
      });
    }

    // Existence assertion
    methods.push({
      name: `assert${elementName}Exists`,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateAssertionBody(element, options, 'assertion'),
      description: `Assert that ${element.tagName} exists on the page`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: true,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'assertion'
    });

    // Not visible assertion
    methods.push({
      name: `assert${elementName}NotVisible`,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateAssertionBody(element, options, 'assertion'),
      description: `Assert that ${element.tagName} is not visible`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: true,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'assertion'
    });

    return methods;
  }

  /**
   * Generate comprehensive action methods for element
   */
  private generateActionMethods(element: Element, options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];
    const elementName = this.capitalize(element.id);

    // Click action
    methods.push({
      name: `click${elementName}`,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateActionBody(element, options, 'action'),
      description: `Click on ${element.tagName}`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: true,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'action'
    });

    // Hover action for hoverable elements
    if (this.isHoverableElement(element)) {
      methods.push({
        name: `hover${elementName}`,
        returnType: this.getChainingReturnType(options.framework),
        parameters: [],
        body: this.generateActionBody(element, options, 'action'),
        description: `Hover over ${element.tagName}`,
        elementId: element.id,
        isGetter: false,
        isSetter: false,
        isAction: true,
        isAssertion: false,
        supportsChaining: true,
        frameworkSpecific: false,
        methodType: 'action'
      });
    }

    // Scroll to element
    methods.push({
      name: `scrollTo${elementName}`,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateActionBody(element, options, 'action'),
      description: `Scroll to ${element.tagName}`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: true,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'action'
    });

    return methods;
  }

  /**
   * Generate setter method for input element
   */
  private generateSetterMethod(element: Element, options: EnhancedGenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'set');
    const elementName = this.capitalize(element.id);

    const parameter: POMParameter = {
      name: 'value',
      type: 'string',
      required: true,
    };

    const body = this.generateSetterBody(element, options);

    return {
      name: methodName,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [parameter],
      body,
      description: `Set value for ${element.tagName}`,
      elementId: element.id,
      isGetter: false,
      isSetter: true,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'inputAction'
    };
  }

  /**
   * Generate wait method for element
   */
  private generateWaitMethod(element: Element, options: EnhancedGenerationOptions): POMMethod {
    const methodName = this.generateMethodName(element, 'wait');
    const elementName = this.capitalize(element.id);

    const parameter: POMParameter = {
      name: 'timeout',
      type: 'number',
      required: false,
      defaultValue: '10000'
    };

    const body = this.generateWaitBody(element, options);

    return {
      name: methodName,
      returnType: this.getChainingReturnType(options.framework),
      parameters: [parameter],
      body,
      description: `Wait for ${element.tagName} to be visible`,
      elementId: element.id,
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'utility'
    };
  }

  /**
   * Generate utility methods
   */
  private generateUtilityMethods(options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];

    // Page load wait
    methods.push({
      name: 'waitForPageLoad',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateUtilityBody(options, 'utility'),
      description: 'Wait for page to fully load',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'utility'
    });

    // Screenshot
    methods.push({
      name: 'takeScreenshot',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [{
        name: 'filename',
        type: 'string',
        required: false
      }],
      body: this.generateUtilityBody(options, 'utility'),
      description: 'Take a screenshot of the page',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'utility'
    });

    // Get page title
    methods.push({
      name: 'getPageTitle',
      returnType: this.getReturnTypeForFramework(options.framework, 'string'),
      parameters: [],
      body: this.generateUtilityBody(options, 'utility'),
      description: 'Get the page title',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: false,
      frameworkSpecific: false,
      methodType: 'utility'
    });

    // Get page URL
    methods.push({
      name: 'getPageUrl',
      returnType: this.getReturnTypeForFramework(options.framework, 'string'),
      parameters: [],
      body: this.generateUtilityBody(options, 'utility'),
      description: 'Get the current page URL',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: false,
      frameworkSpecific: false,
      methodType: 'utility'
    });

    return methods;
  }

  /**
   * Generate validation methods
   */
  private generateValidationMethods(options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];

    // Page structure validation
    methods.push({
      name: 'validatePageStructure',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateValidationBody(options, 'validation'),
      description: 'Validate that all expected page elements are present',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'validation'
    });

    // Quick validation
    methods.push({
      name: 'validatePage',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateValidationBody(options, 'validation'),
      description: 'Perform comprehensive page validation',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'validation'
    });

    return methods;
  }

  /**
   * Generate accessibility methods
   */
  private generateAccessibilityMethods(options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];

    methods.push({
      name: 'validateAccessibility',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateAccessibilityBody(options),
      description: 'Validate page accessibility compliance',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'validation'
    });

    return methods;
  }

  /**
   * Generate responsive validation methods
   */
  private generateResponsiveValidationMethods(options: EnhancedGenerationOptions): POMMethod[] {
    const methods: POMMethod[] = [];

    methods.push({
      name: 'validateResponsiveDesign',
      returnType: this.getChainingReturnType(options.framework),
      parameters: [],
      body: this.generateResponsiveValidationBody(options),
      description: 'Validate responsive design across different viewport sizes',
      isGetter: false,
      isSetter: false,
      isAction: false,
      isAssertion: false,
      supportsChaining: true,
      frameworkSpecific: false,
      methodType: 'validation'
    });

    return methods;
  }

  // Helper methods
  private generateMethodName(element: Element, prefix: string): string {
    return `${prefix}${this.capitalize(element.id)}`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getReturnType(element: Element, framework: string): string {
    const frameworkConfig = FrameworkConfiguration.getConfig(framework);
    switch (frameworkConfig.locatorPattern) {
      case 'cypress':
        return 'Cypress.Chainable<JQuery<HTMLElement>>';
      case 'locator':
        return 'Locator';
      case 'element':
        return 'WebElement';
      default:
        return 'any';
    }
  }

  private getReturnTypeForFramework(framework: string, baseType: string): string {
    if (FrameworkConfiguration.supportsAsync(framework)) {
      return `Promise<${baseType}>`;
    }
    return baseType;
  }

  private getChainingReturnType(framework: string): string {
    return FrameworkConfiguration.getChainingReturnType(framework);
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

  private isInteractiveElement(element: Element): boolean {
    return ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase()) ||
           element.isInteractive;
  }

  private isInputElement(element: Element): boolean {
    return ['input', 'textarea', 'select'].includes(element.tagName.toLowerCase());
  }

  private isHoverableElement(element: Element): boolean {
    return ['button', 'a', 'div', 'span'].includes(element.tagName.toLowerCase());
  }

  // Body generation methods (simplified for now)
  private generateGetterBody(element: Element, options: EnhancedGenerationOptions): string {
    return `// Getter implementation for ${element.tagName}`;
  }

  private generateAssertionBody(element: Element, options: EnhancedGenerationOptions, type: string): string {
    return `// Assertion implementation for ${element.tagName}`;
  }

  private generateActionBody(element: Element, options: EnhancedGenerationOptions, type: string): string {
    return `// Action implementation for ${element.tagName}`;
  }

  private generateSetterBody(element: Element, options: EnhancedGenerationOptions): string {
    return `// Setter implementation for ${element.tagName}`;
  }

  private generateWaitBody(element: Element, options: EnhancedGenerationOptions): string {
    return `// Wait implementation for ${element.tagName}`;
  }

  private generateUtilityBody(options: EnhancedGenerationOptions, type: string): string {
    return `// Utility implementation`;
  }

  private generateValidationBody(options: EnhancedGenerationOptions, type: string): string {
    return `// Validation implementation`;
  }

  private generateAccessibilityBody(options: EnhancedGenerationOptions): string {
    return `// Accessibility validation implementation`;
  }

  private generateResponsiveValidationBody(options: EnhancedGenerationOptions): string {
    return `// Responsive validation implementation`;
  }
}
