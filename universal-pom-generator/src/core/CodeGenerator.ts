import { Element, POMMethod, GenerationOptions } from '../types';
import { Logger } from '../utils/Logger';

export class CodeGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Generate code for POM
   */
  async generateCode(elements: Element[], methods: POMMethod[], options: GenerationOptions): Promise<{
    imports: string[];
    className: string;
    code: string;
  }> {
    this.logger.debug('Starting code generation');

    const imports = this.generateImports(options);
    const className = this.generateClassName(options);
    const code = this.generateClassCode(elements, methods, options);

    this.logger.debug('Code generation completed');

    return {
      imports,
      className,
      code,
    };
  }

  /**
   * Generate imports for the framework and language
   */
  private generateImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.language) {
      case 'typescript':
        imports.push(...this.generateTypeScriptImports(options));
        break;
      case 'javascript':
        imports.push(...this.generateJavaScriptImports(options));
        break;
      case 'python':
        imports.push(...this.generatePythonImports(options));
        break;
      case 'java':
        imports.push(...this.generateJavaImports(options));
        break;
      case 'csharp':
        imports.push(...this.generateCSharpImports(options));
        break;
    }

    return imports;
  }

  /**
   * Generate TypeScript imports
   */
  private generateTypeScriptImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.framework) {
      case 'selenium':
        imports.push(
          'import { Builder, By, until, WebDriver, WebElement } from "selenium-webdriver";',
          'import { Options } from "selenium-webdriver/chrome";'
        );
        break;
      case 'playwright':
        imports.push(
          'import { Page, Locator } from "playwright";'
        );
        break;
      case 'cypress':
        imports.push(
          '/// <reference types="cypress" />'
        );
        break;
      case 'puppeteer':
        imports.push(
          'import puppeteer, { Page, ElementHandle } from "puppeteer";'
        );
        break;
    }

    return imports;
  }

  /**
   * Generate JavaScript imports
   */
  private generateJavaScriptImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.framework) {
      case 'selenium':
        imports.push(
          'const { Builder, By, until } = require("selenium-webdriver");',
          'const { Options } = require("selenium-webdriver/chrome");'
        );
        break;
      case 'playwright':
        imports.push(
          'const { chromium } = require("playwright");'
        );
        break;
      case 'cypress':
        imports.push(
          '/// <reference types="cypress" />'
        );
        break;
      case 'puppeteer':
        imports.push(
          'const puppeteer = require("puppeteer");'
        );
        break;
    }

    return imports;
  }

  /**
   * Generate Python imports
   */
  private generatePythonImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.framework) {
      case 'selenium':
        imports.push(
          'from selenium import webdriver',
          'from selenium.webdriver.common.by import By',
          'from selenium.webdriver.support.ui import WebDriverWait',
          'from selenium.webdriver.support import expected_conditions as EC',
          'from selenium.webdriver.chrome.options import Options'
        );
        break;
      case 'playwright':
        imports.push(
          'from playwright.sync_api import sync_playwright'
        );
        break;
    }

    return imports;
  }

  /**
   * Generate Java imports
   */
  private generateJavaImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.framework) {
      case 'selenium':
        imports.push(
          'import org.openqa.selenium.By;',
          'import org.openqa.selenium.WebDriver;',
          'import org.openqa.selenium.WebElement;',
          'import org.openqa.selenium.support.ui.WebDriverWait;',
          'import org.openqa.selenium.support.ui.ExpectedConditions;',
          'import java.time.Duration;',
          'import java.io.File;'
        );
        break;
    }

    return imports;
  }

  /**
   * Generate C# imports
   */
  private generateCSharpImports(options: GenerationOptions): string[] {
    const imports: string[] = [];

    switch (options.framework) {
      case 'selenium':
        imports.push(
          'using OpenQA.Selenium;',
          'using OpenQA.Selenium.Chrome;',
          'using OpenQA.Selenium.Support.UI;',
          'using System;',
          'using System.IO;'
        );
        break;
    }

    return imports;
  }

  /**
   * Generate class name
   */
  private generateClassName(options: GenerationOptions): string {
    return `${options.framework.charAt(0).toUpperCase() + options.framework.slice(1)}Page`;
  }

  /**
   * Generate class code
   */
  private generateClassCode(_elements: Element[], methods: POMMethod[], options: GenerationOptions): string {
    const className = this.generateClassName(options);
    let code = '';

    switch (options.language) {
      case 'typescript':
        code = this.generateTypeScriptClass(className, methods, options);
        break;
      case 'javascript':
        code = this.generateJavaScriptClass(className, methods, options);
        break;
      case 'python':
        code = this.generatePythonClass(className, methods, options);
        break;
      case 'java':
        code = this.generateJavaClass(className, methods, options);
        break;
      case 'csharp':
        code = this.generateCSharpClass(className, methods, options);
        break;
    }

    return code;
  }

  /**
   * Generate TypeScript class
   */
  private generateTypeScriptClass(className: string, methods: POMMethod[], options: GenerationOptions): string {
    let code = `export class ${className} {\n`;
    
    // Add constructor
    code += this.generateTypeScriptConstructor(options);
    
    // Add methods
    for (const method of methods) {
      code += this.generateTypeScriptMethod(method, options);
    }
    
    code += '}\n';
    return code;
  }

  /**
   * Generate TypeScript constructor
   */
  private generateTypeScriptConstructor(options: GenerationOptions): string {
    let constructor = '  constructor(';
    
    switch (options.framework) {
      case 'selenium':
        constructor += 'private driver: WebDriver';
        break;
      case 'playwright':
        constructor += 'private page: Page';
        break;
      case 'cypress':
        constructor += '';
        break;
      case 'puppeteer':
        constructor += 'private page: Page';
        break;
    }
    
    constructor += ') {}\n\n';
    return constructor;
  }

  /**
   * Generate TypeScript method
   */
  private generateTypeScriptMethod(method: POMMethod, options: GenerationOptions): string {
    let methodCode = `  ${method.name}(`;
    
    // Add parameters
    for (let i = 0; i < method.parameters.length; i++) {
      const param = method.parameters[i];
      if (param) {
        methodCode += `${param.name}: ${param.type}`;
        if (param.defaultValue) {
          methodCode += ` = ${param.defaultValue}`;
        }
        if (i < method.parameters.length - 1) {
          methodCode += ', ';
        }
      }
    }
    
    // Handle Cypress differently (no async/await)
    if (options.framework === 'cypress') {
      methodCode += `) {\n`;
      methodCode += `    ${method.body}\n`;
      methodCode += '  }\n\n';
    } else {
      methodCode += `): ${method.returnType} {\n`;
      methodCode += `    ${method.body}\n`;
      methodCode += '  }\n\n';
    }
    
    return methodCode;
  }

  /**
   * Generate JavaScript class
   */
  private generateJavaScriptClass(className: string, methods: POMMethod[], options: GenerationOptions): string {
    let code = `class ${className} {\n`;
    
    // Add constructor
    code += this.generateJavaScriptConstructor(options);
    
    // Add methods
    for (const method of methods) {
      code += this.generateJavaScriptMethod(method, options);
    }
    
    code += '}\n\n';
    code += `module.exports = ${className};\n`;
    return code;
  }

  /**
   * Generate JavaScript constructor
   */
  private generateJavaScriptConstructor(options: GenerationOptions): string {
    let constructor = '  constructor(';
    
    switch (options.framework) {
      case 'selenium':
        constructor += 'driver';
        break;
      case 'playwright':
        constructor += 'page';
        break;
      case 'cypress':
        constructor += '';
        break;
      case 'puppeteer':
        constructor += 'page';
        break;
    }
    
    constructor += ') {\n';
    
    switch (options.framework) {
      case 'selenium':
        constructor += '    this.driver = driver;\n';
        break;
      case 'playwright':
        constructor += '    this.page = page;\n';
        break;
      case 'puppeteer':
        constructor += '    this.page = page;\n';
        break;
    }
    
    constructor += '  }\n\n';
    return constructor;
  }

  /**
   * Generate JavaScript method
   */
  private generateJavaScriptMethod(method: POMMethod, _options: GenerationOptions): string {
    let methodCode = `  ${method.name}(`;
    
    // Add parameters
    for (let i = 0; i < method.parameters.length; i++) {
      const param = method.parameters[i];
      if (param) {
        methodCode += param.name;
        if (param.defaultValue) {
          methodCode += ` = ${param.defaultValue}`;
        }
        if (i < method.parameters.length - 1) {
          methodCode += ', ';
        }
      }
    }
    
    methodCode += ') {\n';
    methodCode += `    ${method.body}\n`;
    methodCode += '  }\n\n';
    
    return methodCode;
  }

  /**
   * Generate Python class
   */
  private generatePythonClass(className: string, methods: POMMethod[], options: GenerationOptions): string {
    let code = `class ${className}:\n`;
    
    // Add constructor
    code += this.generatePythonConstructor(options);
    
    // Add methods
    for (const method of methods) {
      code += this.generatePythonMethod(method, options);
    }
    
    return code;
  }

  /**
   * Generate Python constructor
   */
  private generatePythonConstructor(options: GenerationOptions): string {
    let constructor = '    def __init__(self, ';
    
    switch (options.framework) {
      case 'selenium':
        constructor += 'driver';
        break;
      case 'playwright':
        constructor += 'page';
        break;
    }
    
    constructor += '):\n';
    
    switch (options.framework) {
      case 'selenium':
        constructor += '        self.driver = driver\n';
        break;
      case 'playwright':
        constructor += '        self.page = page\n';
        break;
    }
    
    constructor += '\n';
    return constructor;
  }

  /**
   * Generate Python method
   */
  private generatePythonMethod(method: POMMethod, _options: GenerationOptions): string {
    let methodCode = `    def ${method.name}(self`;
    
    // Add parameters
    for (const param of method.parameters) {
      methodCode += `, ${param.name}`;
      if (param.defaultValue) {
        methodCode += `=${param.defaultValue}`;
      }
    }
    
    methodCode += '):\n';
    methodCode += `        ${method.body}\n\n`;
    
    return methodCode;
  }

  /**
   * Generate Java class
   */
  private generateJavaClass(className: string, methods: POMMethod[], options: GenerationOptions): string {
    let code = `public class ${className} {\n`;
    
    // Add fields
    code += this.generateJavaFields(options);
    
    // Add constructor
    code += this.generateJavaConstructor(className, options);
    
    // Add methods
    for (const method of methods) {
      code += this.generateJavaMethod(method, options);
    }
    
    code += '}\n';
    return code;
  }

  /**
   * Generate Java fields
   */
  private generateJavaFields(options: GenerationOptions): string {
    let fields = '';
    
    switch (options.framework) {
      case 'selenium':
        fields += '    private WebDriver driver;\n\n';
        break;
    }
    
    return fields;
  }

  /**
   * Generate Java constructor
   */
  private generateJavaConstructor(className: string, options: GenerationOptions): string {
    let constructor = `    public ${className}(`;
    
    switch (options.framework) {
      case 'selenium':
        constructor += 'WebDriver driver';
        break;
    }
    
    constructor += ') {\n';
    
    switch (options.framework) {
      case 'selenium':
        constructor += '        this.driver = driver;\n';
        break;
    }
    
    constructor += '    }\n\n';
    return constructor;
  }

  /**
   * Generate Java method
   */
  private generateJavaMethod(method: POMMethod, _options: GenerationOptions): string {
    let methodCode = `    public ${method.returnType} ${method.name}(`;
    
    // Add parameters
    for (let i = 0; i < method.parameters.length; i++) {
      const param = method.parameters[i];
      if (param) {
        methodCode += `${param.type} ${param.name}`;
        if (i < method.parameters.length - 1) {
          methodCode += ', ';
        }
      }
    }
    
    methodCode += ') {\n';
    methodCode += `        ${method.body}\n`;
    methodCode += '    }\n\n';
    
    return methodCode;
  }

  /**
   * Generate C# class
   */
  private generateCSharpClass(className: string, methods: POMMethod[], options: GenerationOptions): string {
    let code = `public class ${className}\n{\n`;
    
    // Add fields
    code += this.generateCSharpFields(options);
    
    // Add constructor
    code += this.generateCSharpConstructor(className, options);
    
    // Add methods
    for (const method of methods) {
      code += this.generateCSharpMethod(method, options);
    }
    
    code += '}\n';
    return code;
  }

  /**
   * Generate C# fields
   */
  private generateCSharpFields(options: GenerationOptions): string {
    let fields = '';
    
    switch (options.framework) {
      case 'selenium':
        fields += '    private IWebDriver driver;\n\n';
        break;
    }
    
    return fields;
  }

  /**
   * Generate C# constructor
   */
  private generateCSharpConstructor(className: string, options: GenerationOptions): string {
    let constructor = `    public ${className}(`;
    
    switch (options.framework) {
      case 'selenium':
        constructor += 'IWebDriver driver';
        break;
    }
    
    constructor += ')\n    {\n';
    
    switch (options.framework) {
      case 'selenium':
        constructor += '        this.driver = driver;\n';
        break;
    }
    
    constructor += '    }\n\n';
    return constructor;
  }

  /**
   * Generate C# method
   */
  private generateCSharpMethod(method: POMMethod, _options: GenerationOptions): string {
    let methodCode = `    public ${method.returnType} ${method.name}(`;
    
    // Add parameters
    for (let i = 0; i < method.parameters.length; i++) {
      const param = method.parameters[i];
      if (param) {
        methodCode += `${param.type} ${param.name}`;
        if (i < method.parameters.length - 1) {
          methodCode += ', ';
        }
      }
    }
    
    methodCode += ')\n    {\n';
    methodCode += `        ${method.body}\n`;
    methodCode += '    }\n\n';
    
    return methodCode;
  }
} 