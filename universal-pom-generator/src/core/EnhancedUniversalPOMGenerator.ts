import { v4 as uuidv4 } from 'uuid';
import { 
  POM, 
  POMResult, 
  UpdatedPOMResult, 
  EnhancedGenerationOptions, 
  ResultMetadata,
  GenerationOptionsSchema,
  CompatibilityReport
} from '../types';
import { ElementDetector } from './ElementDetector';
import { EnhancedPOMMethodGenerator } from './EnhancedPOMMethodGenerator';
import { EnhancedCodeGenerator } from './EnhancedCodeGenerator';
import { AuthenticationHandler } from '../auth/AuthenticationHandler';
import { VersionManager } from '../version/VersionManager';
import { BrowserManager } from '../browser/BrowserManager';
import { MCPManager } from '../mcp/MCPManager';
import { LLMManager } from '../llm/LLMManager';
import { Logger } from '../utils/Logger';

/**
 * Enhanced Universal POM Generator with comprehensive method generation and framework-specific optimizations
 */
export class EnhancedUniversalPOMGenerator {
  private elementDetector: ElementDetector;
  private methodGenerator: EnhancedPOMMethodGenerator;
  private codeGenerator: EnhancedCodeGenerator;
  private authHandler: AuthenticationHandler;
  private versionManager: VersionManager;
  private browserManager: BrowserManager;
  private mcpManager: MCPManager;
  private llmManager: LLMManager;
  private logger: Logger;

  constructor(options?: {
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    cacheEnabled?: boolean;
  }) {
    this.logger = new Logger(options?.logLevel || 'info');
    this.elementDetector = new ElementDetector();
    this.methodGenerator = new EnhancedPOMMethodGenerator();
    this.codeGenerator = new EnhancedCodeGenerator();
    this.authHandler = new AuthenticationHandler();
    this.versionManager = new VersionManager();
    this.browserManager = new BrowserManager();
    this.mcpManager = new MCPManager();
    this.llmManager = new LLMManager();
  }

  /**
   * Generate enhanced POM from URL with comprehensive method generation
   */
  async generateEnhancedPOM(url: string, options: EnhancedGenerationOptions): Promise<POMResult> {
    const startTime = Date.now();

    try {
      this.logger.info(`Starting enhanced POM generation for URL: ${url}`);

      // Validate options
      const validatedOptions = this.validateEnhancedOptions(options);
      this.logger.debug('Enhanced options validated successfully');

      // Initialize browser
      const browser = await this.browserManager.initializeBrowser(validatedOptions.browser as any);
      this.logger.debug('Browser initialized');

      // Initialize MCP if configured
      if (validatedOptions.mcpIntegration) {
        await this.mcpManager.initializeMCPServer(validatedOptions.mcpIntegration as any);
        this.logger.debug('MCP server initialized');
      }

      // Initialize LLM if configured
      if (validatedOptions.llmIntegration) {
        await this.llmManager.initializeLLM(validatedOptions.llmIntegration as any);
        this.logger.debug('LLM initialized');
      }

      // Handle authentication if required
      if (validatedOptions.loginConfig) {
        this.logger.debug('Login configuration detected, handling authentication');
        await this.handleAuthentication(validatedOptions, browser);
      }

      // Navigate to target page
      await this.browserManager.navigateToPage(url, browser);
      this.logger.debug(`Navigated to target page: ${url}`);

      // Wait for page to load
      await this.waitForPageLoad(browser, validatedOptions);
      this.logger.debug('Page loaded successfully');

      // Detect page elements
      const elements = await this.elementDetector.detectElements(browser, validatedOptions);
      this.logger.debug(`Detected ${elements.length} elements`);

      // Generate comprehensive methods
      const methods = await this.methodGenerator.generateMethods(elements, validatedOptions);
      this.logger.debug(`Generated ${methods.length} comprehensive methods`);

      // Generate enhanced code
      const generatedCode = await this.codeGenerator.generateCode(elements, methods, validatedOptions);
      this.logger.debug('Enhanced code generation completed');

      // Create enhanced POM result
      const pom: POM = {
        id: uuidv4(),
        url,
        version: '2.0.0',
        framework: validatedOptions.framework,
        language: validatedOptions.language,
        elements,
        methods,
        imports: generatedCode.imports,
        className: generatedCode.className,
        generatedCode: generatedCode.code,
        generatedAt: new Date(),
        metadata: {
          pageTitle: await this.getPageTitle(browser),
          pageDescription: await this.getPageDescription(browser),
          loginRequired: !!validatedOptions.loginConfig,
          authenticationMethod: validatedOptions.loginConfig?.type,
          browser: validatedOptions.browser?.browser || 'chrome',
          userAgent: await this.getUserAgent(browser),
          viewport: {
            width: 1920,
            height: 1080
          },
          timestamp: new Date(),
          llmEnhanced: !!validatedOptions.llmIntegration,
          llmProvider: validatedOptions.llmIntegration?.provider,
          llmModel: validatedOptions.llmIntegration?.model,
          mcpEnhanced: !!validatedOptions.mcpIntegration,
          mcpTools: validatedOptions.mcpIntegration?.tools,
          mcpServerUrl: validatedOptions.mcpIntegration?.serverUrl,
          industrialStandards: {
            methodChaining: validatedOptions.includeMethodChaining,
            comprehensiveAssertions: validatedOptions.includeComprehensiveAssertions,
            utilityMethods: validatedOptions.includeUtilityMethods,
            validationMethods: validatedOptions.includeValidationMethods,
            accessibilityChecks: validatedOptions.includeAccessibilityChecks,
            responsiveValidation: validatedOptions.includeResponsiveValidation
          },
          enhanced: true,
          qualityMetrics: {
            totalElements: elements.length,
            totalMethods: methods.length,
            assertionMethods: methods.filter(m => m.isAssertion).length,
            actionMethods: methods.filter(m => m.isAction).length,
            utilityMethods: methods.filter(m => m.methodType === 'utility').length,
            validationMethods: methods.filter(m => m.methodType === 'validation').length,
            chainingSupport: methods.filter(m => m.supportsChaining).length
          },
          statistics: {
            generationTime: Date.now() - startTime,
            framework: validatedOptions.framework,
            language: validatedOptions.language,
            enhancedFeatures: this.getEnhancedFeatures(validatedOptions)
          }
        }
      };

      // Generate test code
      const testCode = generatedCode.testCode;

      // Close browser
      await this.browserManager.closeBrowser(browser);
      this.logger.debug('Browser closed');

      const result: POMResult = {
        success: true,
        pom,
        testCode,
        metadata: {
          generationTime: Date.now() - startTime,
          framework: validatedOptions.framework,
          language: validatedOptions.language,
          enhanced: true,
          features: this.getEnhancedFeatures(validatedOptions)
        }
      };

      this.logger.info(`Enhanced POM generation completed successfully in ${Date.now() - startTime}ms`);
      return result;

    } catch (error) {
      this.logger.error(`Enhanced POM generation failed: ${error}`);
      
      const result: POMResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        pom: null,
        testCode: '',
        metadata: {
          generationTime: Date.now() - startTime,
          framework: options.framework,
          language: options.language,
          enhanced: true,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      return result;
    }
  }

  /**
   * Validate enhanced generation options
   */
  private validateEnhancedOptions(options: EnhancedGenerationOptions): EnhancedGenerationOptions {
    // Set default values for enhanced features
    const enhancedOptions: EnhancedGenerationOptions = {
      ...options,
      includeMethodChaining: options.includeMethodChaining ?? true,
      includeComprehensiveAssertions: options.includeComprehensiveAssertions ?? true,
      includeUtilityMethods: options.includeUtilityMethods ?? true,
      includeValidationMethods: options.includeValidationMethods ?? true,
      includeAccessibilityChecks: options.includeAccessibilityChecks ?? false,
      includeResponsiveValidation: options.includeResponsiveValidation ?? false
    };

    // Validate with base schema
    GenerationOptionsSchema.parse(enhancedOptions);

    return enhancedOptions;
  }

  /**
   * Handle authentication process
   */
  private async handleAuthentication(options: EnhancedGenerationOptions, browser: any): Promise<void> {
    if (options.loginConfig?.loginUrl) {
      await this.browserManager.navigateToPage(options.loginConfig.loginUrl, browser);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await this.authHandler.handleLogin(options.loginConfig.loginUrl, options.loginConfig, browser);
      this.logger.debug('Authentication completed successfully');
    }
  }

  /**
   * Wait for page to load with enhanced options
   */
  private async waitForPageLoad(browser: any, options: EnhancedGenerationOptions): Promise<void> {
    // Enhanced page load waiting
    await this.browserManager.waitForPageLoad(browser);
    
    // Additional wait for dynamic content
    if (options.includeResponsiveValidation) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  /**
   * Get page title
   */
  private async getPageTitle(browser: any): Promise<string> {
    try {
      return await this.browserManager.getPageTitle(browser);
    } catch {
      return 'Unknown Page';
    }
  }

  /**
   * Get page description
   */
  private async getPageDescription(browser: any): Promise<string> {
    try {
      return await this.browserManager.getPageDescription(browser);
    } catch {
      return '';
    }
  }

  /**
   * Get user agent
   */
  private async getUserAgent(browser: any): Promise<string> {
    try {
      return await this.browserManager.getUserAgent(browser);
    } catch {
      return 'Unknown User Agent';
    }
  }

  /**
   * Get enhanced features list
   */
  private getEnhancedFeatures(options: EnhancedGenerationOptions): string[] {
    const features: string[] = ['Enhanced POM Generation'];

    if (options.includeMethodChaining) features.push('Method Chaining');
    if (options.includeComprehensiveAssertions) features.push('Comprehensive Assertions');
    if (options.includeUtilityMethods) features.push('Utility Methods');
    if (options.includeValidationMethods) features.push('Validation Methods');
    if (options.includeAccessibilityChecks) features.push('Accessibility Checks');
    if (options.includeResponsiveValidation) features.push('Responsive Validation');

    return features;
  }

  /**
   * Generate POM for multiple frameworks
   */
  async generateMultiFrameworkPOM(
    url: string, 
    frameworks: string[], 
    options: EnhancedGenerationOptions
  ): Promise<Record<string, POMResult>> {
    const results: Record<string, POMResult> = {};

    for (const framework of frameworks) {
      this.logger.info(`Generating POM for framework: ${framework}`);
      
      const frameworkOptions: EnhancedGenerationOptions = {
        ...options,
        framework: framework as any
      };

      try {
        const result = await this.generateEnhancedPOM(url, frameworkOptions);
        results[framework] = result;
      } catch (error) {
        this.logger.error(`Failed to generate POM for ${framework}: ${error}`);
        results[framework] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          pom: null,
          testCode: '',
          metadata: {
            framework,
            language: options.language,
            enhanced: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      }
    }

    return results;
  }

  /**
   * Generate POM for multiple languages
   */
  async generateMultiLanguagePOM(
    url: string, 
    languages: string[], 
    options: EnhancedGenerationOptions
  ): Promise<Record<string, POMResult>> {
    const results: Record<string, POMResult> = {};

    for (const language of languages) {
      this.logger.info(`Generating POM for language: ${language}`);
      
      const languageOptions: EnhancedGenerationOptions = {
        ...options,
        language: language as any
      };

      try {
        const result = await this.generateEnhancedPOM(url, languageOptions);
        results[language] = result;
      } catch (error) {
        this.logger.error(`Failed to generate POM for ${language}: ${error}`);
        results[language] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          pom: null,
          testCode: '',
          metadata: {
            framework: options.framework,
            language,
            enhanced: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      }
    }

    return results;
  }

  /**
   * Generate comprehensive POM with all enhanced features
   */
  async generateComprehensivePOM(url: string, options: EnhancedGenerationOptions): Promise<POMResult> {
    const comprehensiveOptions: EnhancedGenerationOptions = {
      ...options,
      includeMethodChaining: true,
      includeComprehensiveAssertions: true,
      includeUtilityMethods: true,
      includeValidationMethods: true,
      includeAccessibilityChecks: true,
      includeResponsiveValidation: true
    };

    return await this.generateEnhancedPOM(url, comprehensiveOptions);
  }

  /**
   * Get generation statistics
   */
  getGenerationStatistics(): {
    supportedFrameworks: string[];
    supportedLanguages: string[];
    enhancedFeatures: string[];
  } {
    return {
      supportedFrameworks: ['cypress', 'playwright', 'selenium', 'puppeteer', 'testcafe'],
      supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'csharp'],
      enhancedFeatures: [
        'Method Chaining',
        'Comprehensive Assertions',
        'Utility Methods',
        'Validation Methods',
        'Accessibility Checks',
        'Responsive Validation',
        'Framework-Specific Optimizations',
        'Multi-Language Support',
        'Industrial Standards Compliance'
      ]
    };
  }
}
