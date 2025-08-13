import { v4 as uuidv4 } from 'uuid';
import { 
  POM, 
  POMResult, 
  UpdatedPOMResult, 
  GenerationOptions, 
  ResultMetadata,
  GenerationOptionsSchema,
  CompatibilityReport
} from '../types';
import { ElementDetector } from './ElementDetector';
import { POMMethodGenerator } from './POMMethodGenerator';
import { CodeGenerator } from './CodeGenerator';
import { AuthenticationHandler } from '../auth/AuthenticationHandler';
import { VersionManager } from '../version/VersionManager';
import { BrowserManager } from '../browser/BrowserManager';
import { MCPManager } from '../mcp/MCPManager';
import { LLMManager } from '../llm/LLMManager';
// import { IntegrationManager } from '../integration/IntegrationManager';
import { Logger } from '../utils/Logger';

export class UniversalPOMGenerator {
  private elementDetector: ElementDetector;
  private methodGenerator: POMMethodGenerator;
  private codeGenerator: CodeGenerator;
  private authHandler: AuthenticationHandler;
  private versionManager: VersionManager;
  private browserManager: BrowserManager;
  private mcpManager: MCPManager;
  private llmManager: LLMManager;
  // private integrationManager: IntegrationManager;
  private logger: Logger;

  constructor(options?: {
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
    cacheEnabled?: boolean;
  }) {
    this.logger = new Logger(options?.logLevel || 'info');
    this.elementDetector = new ElementDetector();
    this.methodGenerator = new POMMethodGenerator();
    this.codeGenerator = new CodeGenerator();
    this.authHandler = new AuthenticationHandler();
    this.versionManager = new VersionManager();
    this.browserManager = new BrowserManager();
    this.mcpManager = new MCPManager();
    this.llmManager = new LLMManager();
    // this.integrationManager = new IntegrationManager();
  }

  /**
   * Generate POM from URL with optional login and AI enhancement
   */
  async generatePOM(url: string, options: GenerationOptions): Promise<POMResult> {
    const startTime = Date.now();

    try {
      this.logger.info(`Starting POM generation for URL: ${url}`);

      // Validate options
      const validatedOptions = GenerationOptionsSchema.parse(options);
      this.logger.debug('Options validated successfully');

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
        
        // If login URL is provided, go directly to login page
        const loginConfig = validatedOptions.loginConfig as any;
        this.logger.debug(`Login config: ${JSON.stringify(loginConfig)}`);
        this.logger.debug(`Login URL provided: ${!!loginConfig.loginUrl}`);
        
        if (loginConfig.loginUrl) {
          this.logger.debug(`Using direct login URL approach: ${loginConfig.loginUrl}`);
          await this.browserManager.navigateToPage(loginConfig.loginUrl, browser);
          
          // Wait for login page to load completely
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Handle login on the login page
          await this.authHandler.handleLogin(loginConfig.loginUrl, loginConfig, browser);
          this.logger.debug('Authentication completed successfully');
          
          // After successful login, navigate to the target page
          this.logger.debug(`Navigating to target page: ${url}`);
          await this.browserManager.navigateToPage(url, browser);
          this.logger.debug('Navigation to target page completed');
        } else {
          this.logger.debug('No login URL provided, using fallback approach');
          // Fallback: try to navigate to target URL and handle any redirects
          await this.browserManager.navigateToPage(url, browser);
          this.logger.debug('Initial navigation to target page completed');
          
          // Check if we were redirected to auth page
          const currentUrl = await browser.getCurrentUrl();
          if (currentUrl.includes('auth')) {
            this.logger.debug('Detected redirect to auth page, handling login');
            await this.authHandler.handleLogin(url, validatedOptions.loginConfig as any, browser);
            this.logger.debug('Authentication handled successfully');
            
            // After login, navigate to the target URL again
            await this.browserManager.navigateToPage(url, browser);
            this.logger.debug('Navigation to target page after login completed');
          }
        }
      } else {
        // Navigate to page (no authentication required)
        await this.browserManager.navigateToPage(url, browser);
        this.logger.debug('Page navigation completed');
      }

      // Detect elements
      const elements = await this.elementDetector.detectElements(browser);
      this.logger.debug(`Detected ${elements.length} elements`);

      // Get page data
      const pageData = {
        title: await this.browserManager.getPageTitle(browser),
        url: url,
        description: await this.browserManager.getPageDescription(browser),
      };

      // Use AI-powered POM generation if MCP is configured with AI
      let pom: POM;
      let methods: any[] = [];
      
      if ((validatedOptions.mcpIntegration as any)?.aiConfig) {
        this.logger.debug('Using AI-powered POM generation via MCP');
        pom = await this.mcpManager.generatePOMWithAI(elements, validatedOptions as any, pageData);
        methods = pom.methods;
      } else {
        // Fallback to internal logic
        this.logger.debug('Using internal POM generation logic');
        
        // Generate methods using internal logic
        methods = await this.methodGenerator.generateMethods(elements, validatedOptions as any);
        this.logger.debug(`Generated ${methods.length} methods`);

        // Generate code using internal logic
        const code = await this.codeGenerator.generateCode(elements, methods, validatedOptions as any);
        this.logger.debug('Code generation completed');

        // Create POM object
        pom = {
          id: uuidv4(),
          url,
          version: '1.0.0',
          framework: validatedOptions.framework,
          language: validatedOptions.language,
          elements,
          methods,
          imports: code.imports,
          className: this.generateClassName(url),
          generatedCode: code.code, // Include the generated code
          generatedAt: new Date(),
          metadata: {
            pageTitle: pageData.title,
            loginRequired: !!validatedOptions.loginConfig,
            authenticationMethod: validatedOptions.loginConfig?.type || undefined,
            browser: validatedOptions.browser?.name || 'chrome',
            userAgent: await this.browserManager.getUserAgent(browser),
            viewport: validatedOptions.browser?.viewport || { width: 1920, height: 1080 },
            timestamp: new Date(),
          } as any,
        };
      }

      // Apply AI enhancements if LLM is configured
      if (validatedOptions.llmIntegration) {
        const enhancedPOM = await this.llmManager.enhancePOM(pom, validatedOptions.llmIntegration as any);
        Object.assign(pom, enhancedPOM);
        this.logger.debug('LLM enhancement applied');
      }

      // Apply MCP enhancements if MCP is configured
      if (validatedOptions.mcpIntegration) {
        const mcpEnhancedPOM = await this.mcpManager.enhancePOM(pom, validatedOptions.mcpIntegration as any);
        Object.assign(pom, mcpEnhancedPOM);
        this.logger.debug('MCP enhancement applied');
      }

      const generationTime = Date.now() - startTime;
      const metadata: ResultMetadata = {
        generationTime,
        elementCount: elements.length,
        methodCount: methods.length,
        framework: validatedOptions.framework,
        language: validatedOptions.language,
        browser: validatedOptions.browser?.name || 'chrome',
        timestamp: new Date(),
      };

      this.logger.info(`POM generation completed successfully in ${generationTime}ms`);

      return {
        success: true,
        pom,
        warnings: [],
        errors: [],
        metadata,
      };

    } catch (error) {
      this.logger.error(`POM generation failed: ${error}`);
      return {
        success: false,
        pom: {} as POM,
        warnings: [],
        errors: [error instanceof Error ? error.message : String(error)],
        metadata: {
          generationTime: Date.now() - startTime,
          elementCount: 0,
          methodCount: 0,
          framework: options.framework,
          language: options.language,
          browser: options.browser?.name || 'chrome',
          timestamp: new Date(),
        },
      };
    } finally {
      await this.browserManager.cleanup();
    }
  }

  /**
   * Update existing POM when page changes
   */
  async updatePOM(url: string, existingPOM: POM, options: GenerationOptions): Promise<UpdatedPOMResult> {
    const startTime = Date.now();

    try {
      this.logger.info(`Starting POM update for URL: ${url}`);

      // Validate options
      const validatedOptions = GenerationOptionsSchema.parse(options);

      // Initialize browser
      const browser = await this.browserManager.initializeBrowser(validatedOptions.browser as any);

      // Handle authentication if required
      if (validatedOptions.loginConfig) {
        await this.authHandler.handleLogin(url, validatedOptions.loginConfig as any, browser);
      }

      // Navigate to page
      await this.browserManager.navigateToPage(url, browser);

      // Detect current elements
      const currentElements = await this.elementDetector.detectElements(browser);

      // Detect changes
      const changes = await this.versionManager.detectChanges(existingPOM.elements, currentElements);

      // Generate new methods for changed elements
      const newMethods = await this.methodGenerator.generateMethodsForChanges(changes, validatedOptions as any);

      // Create updated POM
      const updatedPOM: POM = {
        ...existingPOM,
        elements: currentElements,
        methods: [...existingPOM.methods, ...newMethods],
        version: this.versionManager.incrementVersion(existingPOM.version),
        generatedAt: new Date(),
      };

      // Check compatibility
      const compatibility = await this.versionManager.checkCompatibility(existingPOM, updatedPOM);

      // Generate migration script if needed
      let migrationScript: string | undefined;
      if (compatibility.migrationRequired) {
        migrationScript = await this.versionManager.generateMigrationScript(existingPOM, updatedPOM);
      }

      const generationTime = Date.now() - startTime;
      const metadata: ResultMetadata = {
        generationTime,
        elementCount: currentElements.length,
        methodCount: updatedPOM.methods.length,
        framework: validatedOptions.framework,
        language: validatedOptions.language,
        browser: validatedOptions.browser?.name || 'chrome',
        timestamp: new Date(),
      };

      this.logger.info(`POM update completed successfully in ${generationTime}ms`);

      return {
        success: true,
        oldPOM: existingPOM,
        newPOM: updatedPOM,
        changes,
        migrationScript,
        compatibility,
        metadata,
      };

    } catch (error) {
      this.logger.error(`POM update failed: ${error}`);
      return {
        success: false,
        oldPOM: existingPOM,
        newPOM: existingPOM,
        changes: {
          addedElements: [],
          removedElements: [],
          modifiedElements: [],
          addedMethods: [],
          removedMethods: [],
          modifiedMethods: [],
        },
        migrationScript: undefined,
        compatibility: {
          backwardCompatible: false,
          forwardCompatible: false,
          breakingChanges: [error instanceof Error ? error.message : String(error)],
          migrationRequired: true,
          estimatedEffort: 'high',
        },
        metadata: {
          generationTime: Date.now() - startTime,
          elementCount: 0,
          methodCount: 0,
          framework: options.framework,
          language: options.language,
          browser: options.browser?.name || 'chrome',
          timestamp: new Date(),
        },
      };
    } finally {
      await this.browserManager.cleanup();
    }
  }

  /**
   * Generate POM with MCP context
   */
  async generatePOMWithMCP(url: string, context: any): Promise<POMResult> {
    this.logger.info(`Starting MCP-enhanced POM generation for URL: ${url}`);
    
    // Create options with MCP integration
    const options: GenerationOptions = {
      framework: 'selenium',
      language: 'typescript',
      mcpIntegration: {
        serverUrl: context.serverUrl,
        tools: ['pom_generation', 'element_detection'],
        contextManagement: true,
      },
    };

    return this.generatePOM(url, options);
  }

  /**
   * Update POM with MCP context
   */
  async updatePOMWithMCP(url: string, existingPOM: POM, context: any): Promise<UpdatedPOMResult> {
    this.logger.info(`Starting MCP-enhanced POM update for URL: ${url}`);
    
    // Create options with MCP integration
    const options: GenerationOptions = {
      framework: 'selenium',
      language: 'typescript',
      mcpIntegration: {
        serverUrl: context.serverUrl,
        tools: ['pom_updates', 'element_detection'],
        contextManagement: true,
      },
    };

    return this.updatePOM(url, existingPOM, options);
  }

  /**
   * Handle login for a URL
   */
  async handleLogin(url: string, loginConfig: any): Promise<any> {
    this.logger.info(`Handling login for URL: ${url}`);
    
    const browser = await this.browserManager.initializeBrowser({ name: 'chrome' });
    const result = await this.authHandler.handleLogin(url, loginConfig, browser);
    
    await this.browserManager.cleanup();
    return result;
  }

  /**
   * Check compatibility between POM versions
   */
  async checkCompatibility(oldPOM: POM, newPOM: POM): Promise<CompatibilityReport> {
    this.logger.info('Checking POM compatibility');
    return this.versionManager.checkCompatibility(oldPOM, newPOM);
  }

  /**
   * Generate migration script for POM changes
   */
  async generateMigrationScript(oldPOM: POM, newPOM: POM): Promise<string> {
    this.logger.info('Generating migration script');
    return this.versionManager.generateMigrationScript(oldPOM, newPOM);
  }

  /**
   * Initialize MCP server
   */
  async initializeMCPServer(config: any): Promise<any> {
    this.logger.info('Initializing MCP server');
    return this.mcpManager.initializeMCPServer(config);
  }

  /**
   * Execute MCP tool
   */
  async executeMCPTool(toolName: string, parameters: any): Promise<any> {
    this.logger.info(`Executing MCP tool: ${toolName}`);
    return this.mcpManager.executeTool(toolName, parameters);
  }

  /**
   * Generate class name from URL
   */
  private generateClassName(url: string): string {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '');
    const pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '');
    
    let className = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    if (pathname) {
      className += pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
    
    return `${className}Page`;
  }
} 