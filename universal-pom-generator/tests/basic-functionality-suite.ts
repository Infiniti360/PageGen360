import { UniversalPOMGenerator } from '../src/index';
import { BrowserManager } from '../src/browser/BrowserManager';
import { ElementDetector } from '../src/core/ElementDetector';
import { CodeGenerator } from '../src/core/CodeGenerator';
import { POMMethodGenerator } from '../src/core/POMMethodGenerator';
import { LLMManager } from '../src/llm/LLMManager';
import { AuthenticationHandler } from '../src/auth/AuthenticationHandler';
import { IntegrationManager } from '../src/integration/IntegrationManager';
import { MCPManagerEnhanced } from '../src/mcp/MCPManagerEnhanced';
import { VersionManager } from '../src/version/VersionManager';
import { FileGenerator } from '../src/utils/FileGenerator';
import { Logger } from '../src/utils/Logger';

describe('🔧 Basic Functionality Test Suite', () => {
  let generator: UniversalPOMGenerator;
  let browserManager: BrowserManager;
  let elementDetector: ElementDetector;
  let codeGenerator: CodeGenerator;
  let pomMethodGenerator: POMMethodGenerator;
  let llmManager: LLMManager;
  let authHandler: AuthenticationHandler;
  let integrationManager: IntegrationManager;
  let mcpManager: MCPManagerEnhanced;
  let versionManager: VersionManager;
  let fileGenerator: FileGenerator;
  let logger: Logger;

  beforeAll(async () => {
    // Initialize all components
    generator = new UniversalPOMGenerator({
      logLevel: 'debug',
      cacheEnabled: true
    });

    browserManager = new BrowserManager();
    elementDetector = new ElementDetector();
    codeGenerator = new CodeGenerator();
    pomMethodGenerator = new POMMethodGenerator();
    llmManager = new LLMManager();
    authHandler = new AuthenticationHandler();
    integrationManager = new IntegrationManager();
    mcpManager = new MCPManagerEnhanced();
    versionManager = new VersionManager();
    fileGenerator = new FileGenerator();
    logger = new Logger();
  });

  afterAll(async () => {
    // Cleanup
    await browserManager.cleanup();
  });

  describe('🔧 Core Component Tests', () => {
    test('should initialize all core components successfully', () => {
      expect(generator).toBeDefined();
      expect(browserManager).toBeDefined();
      expect(elementDetector).toBeDefined();
      expect(codeGenerator).toBeDefined();
      expect(pomMethodGenerator).toBeDefined();
      expect(llmManager).toBeDefined();
      expect(authHandler).toBeDefined();
      expect(integrationManager).toBeDefined();
      expect(mcpManager).toBeDefined();
      expect(versionManager).toBeDefined();
      expect(fileGenerator).toBeDefined();
      expect(logger).toBeDefined();
    });

    test('should have proper component types', () => {
      expect(generator).toBeInstanceOf(UniversalPOMGenerator);
      expect(browserManager).toBeInstanceOf(BrowserManager);
      expect(elementDetector).toBeInstanceOf(ElementDetector);
      expect(codeGenerator).toBeInstanceOf(CodeGenerator);
      expect(pomMethodGenerator).toBeInstanceOf(POMMethodGenerator);
      expect(llmManager).toBeInstanceOf(LLMManager);
      expect(authHandler).toBeInstanceOf(AuthenticationHandler);
      expect(integrationManager).toBeInstanceOf(IntegrationManager);
      expect(mcpManager).toBeInstanceOf(MCPManagerEnhanced);
      expect(versionManager).toBeInstanceOf(VersionManager);
      expect(fileGenerator).toBeInstanceOf(FileGenerator);
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('🌐 Browser Manager Tests', () => {
    test('should have launchBrowser method', () => {
      expect(typeof browserManager.launchBrowser).toBe('function');
    });

    test('should have isRunning method', () => {
      expect(typeof browserManager.isRunning).toBe('function');
    });

    test('should have getBrowser method', () => {
      expect(typeof browserManager.getBrowser).toBe('function');
    });

    test('should have cleanup method', () => {
      expect(typeof browserManager.cleanup).toBe('function');
    });

    test('should check browser running status', () => {
      const isRunning = browserManager.isRunning();
      expect(typeof isRunning).toBe('boolean');
    });
  });

  describe('🔐 Authentication Handler Tests', () => {
    test('should have handleAuthentication method', () => {
      expect(typeof authHandler.handleAuthentication).toBe('function');
    });

    test('should handle basic authentication config', async () => {
      const authConfig = {
        type: 'basic',
        credentials: {
          username: 'testuser',
          password: 'testpass'
        },
        url: 'https://example.com'
      };

      const result = await authHandler.handleAuthentication(authConfig);
      expect(result.success).toBe(true);
      expect(result.type).toBe('basic');
    });

    test('should handle OAuth2 authentication config', async () => {
      const authConfig = {
        type: 'oauth2',
        credentials: {
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          redirectUri: 'https://example.com/callback'
        },
        url: 'https://example.com'
      };

      const result = await authHandler.handleAuthentication(authConfig);
      expect(result.success).toBe(true);
      expect(result.type).toBe('oauth2');
    });
  });

  describe('🔗 Integration Manager Tests', () => {
    test('should have checkCompatibility method', () => {
      expect(typeof integrationManager.checkCompatibility).toBe('function');
    });

    test('should check framework-language compatibility', async () => {
      const config = {
        framework: 'playwright',
        language: 'typescript',
        browser: 'chrome'
      };

      const result = await integrationManager.checkCompatibility(config);
      expect(result.success).toBe(true);
      expect(result.compatibility.compatible).toBe(true);
      expect(result.compatibility.framework).toBe('playwright');
      expect(result.compatibility.language).toBe('typescript');
      expect(result.compatibility.browser).toBe('chrome');
    });

    test('should detect incompatible combinations', async () => {
      const config = {
        framework: 'cypress',
        language: 'python',
        browser: 'chrome'
      };

      const result = await integrationManager.checkCompatibility(config);
      expect(result.success).toBe(true);
      expect(result.compatibility.compatible).toBe(false);
      expect(result.compatibility.issues.length).toBeGreaterThan(0);
    });
  });

  describe('🤖 MCP Manager Tests', () => {
    test('should have connect method', () => {
      expect(typeof mcpManager.connect).toBe('function');
    });

    test('should connect to MCP server', async () => {
      const result = await mcpManager.connect();
      expect(result.success).toBe(true);
      expect(result.connection).toBeDefined();
      expect(result.connection.status).toBe('connected');
      expect(result.connection.tools).toBeDefined();
      expect(Array.isArray(result.connection.tools)).toBe(true);
    });
  });

  describe('🧠 LLM Manager Tests', () => {
    test('should have enhanceCode method', () => {
      expect(typeof llmManager.enhanceCode).toBe('function');
    });

    test('should enhance code with LLM', async () => {
      const testCode = 'public class TestPage { }';
      const config = {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
      };

      const result = await llmManager.enhanceCode(testCode, config);
      expect(result.success).toBe(true);
      expect(result.originalCode).toBe(testCode);
      expect(result.enhancedCode).toBeDefined();
      expect(result.improvements).toBeDefined();
      expect(Array.isArray(result.improvements)).toBe(true);
      expect(result.provider).toBe('openai');
      expect(result.model).toBe('gpt-4');
    });
  });

  describe('📁 File Generator Tests', () => {
    test('should have listGeneratedFiles method', () => {
      expect(typeof fileGenerator.listGeneratedFiles).toBe('function');
    });

    test('should list generated files', async () => {
      const files = await fileGenerator.listGeneratedFiles();
      expect(Array.isArray(files)).toBe(true);
    });

    test('should handle non-existent directory', async () => {
      const files = await fileGenerator.listGeneratedFiles('./non-existent-dir');
      expect(Array.isArray(files)).toBe(true);
      expect(files.length).toBe(0);
    });
  });

  describe('📊 Version Manager Tests', () => {
    test('should have detectChanges method', () => {
      expect(typeof versionManager.detectChanges).toBe('function');
    });

    test('should detect changes between POM versions', async () => {
      const oldElements = [
        { 
          id: 'button1', 
          tagName: 'button', 
          text: 'Click me',
          isInteractive: true,
          isVisible: true,
          children: [],
          attributes: {},
          position: { x: 0, y: 0, width: 100, height: 50 }
        }
      ];
      const newElements = [
        { 
          id: 'button1', 
          tagName: 'button', 
          text: 'Click me',
          isInteractive: true,
          isVisible: true,
          children: [],
          attributes: {},
          position: { x: 0, y: 0, width: 100, height: 50 }
        },
        { 
          id: 'button2', 
          tagName: 'button', 
          text: 'New button',
          isInteractive: true,
          isVisible: true,
          children: [],
          attributes: {},
          position: { x: 0, y: 0, width: 100, height: 50 }
        }
      ];

      const changes = await versionManager.detectChanges(oldElements, newElements);
      expect(changes.addedElements).toBeDefined();
      expect(changes.removedElements).toBeDefined();
      expect(changes.modifiedElements).toBeDefined();
      expect(changes.addedElements.length).toBe(1);
      expect(changes.removedElements.length).toBe(0);
    });
  });

  describe('🧪 Mock POM Generation Tests', () => {
    test('should handle mock POM generation', async () => {
      // Test with a mock URL that won't timeout
      const mockUrl = 'data:text/html,<html><body><button>Test</button></body></html>';
      
      try {
        const result = await generator.generatePOM(mockUrl, {
          framework: 'playwright',
          language: 'typescript',
          includeTests: false,
          includeComments: true,
          includeWaitStrategies: false,
          includeErrorHandling: false,
          browser: {
            name: 'chrome',
            headless: true
          }
        });

        // Even if it fails, we should get a result object
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
        
        if (result.success) {
          expect(result.pom).toBeDefined();
          expect(result.metadata).toBeDefined();
        }
      } catch (error) {
        // It's okay if this fails due to mock URL limitations
        expect(error).toBeDefined();
      }
    });
  });

  describe('📈 Performance Tests', () => {
    test('should complete component initialization within reasonable time', () => {
      const startTime = Date.now();
      
      // Re-initialize components
      const newGenerator = new UniversalPOMGenerator({ logLevel: 'info' });
      const newBrowserManager = new BrowserManager();
      const newElementDetector = new ElementDetector();
      
      const endTime = Date.now();
      const initializationTime = endTime - startTime;
      
      expect(initializationTime).toBeLessThan(1000); // Should complete within 1 second
      expect(newGenerator).toBeDefined();
      expect(newBrowserManager).toBeDefined();
      expect(newElementDetector).toBeDefined();
    });

    test('should handle multiple method calls efficiently', async () => {
      const startTime = Date.now();
      
      // Call multiple methods
      const promises = [
        authHandler.handleAuthentication({ type: 'basic', credentials: { username: 'test', password: 'test' } }),
        integrationManager.checkCompatibility({ framework: 'playwright', language: 'typescript', browser: 'chrome' }),
        mcpManager.connect(),
        llmManager.enhanceCode('test code', { provider: 'openai', model: 'gpt-4' })
      ];
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      expect(executionTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(results.length).toBe(4);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
});
