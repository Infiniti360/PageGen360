import { UniversalPOMGenerator } from '../src/index';
import { BrowserManager } from '../src/browser/BrowserManager';

// Cross-platform test configuration
const CROSS_PLATFORM_CONFIG = {
  VIEWPORTS: {
    DESKTOP: { width: 1920, height: 1080 },
    TABLET: { width: 768, height: 1024 },
    MOBILE: { width: 375, height: 667 }
  },
  
  BROWSERS: ['chrome', 'firefox', 'safari', 'edge'],
  
  WEBSITES: [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com'
  ]
};

// Cross-platform test class
class CrossPlatformTester {
  private generator: UniversalPOMGenerator;
  private browserManager: BrowserManager;
  private testResults: Map<string, any[]>;

  constructor() {
    this.generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true,
      maxRetries: 3,
      timeout: 30000
    });
    
    this.browserManager = new BrowserManager();
    this.testResults = new Map();
  }

  /**
   * Test responsive design across viewports
   */
  async testResponsiveDesign(): Promise<void> {
    console.log('📱 Testing Responsive Design...');
    
    for (const [deviceType, viewport] of Object.entries(CROSS_PLATFORM_CONFIG.VIEWPORTS)) {
      console.log(`   Testing ${deviceType} viewport: ${viewport.width}x${viewport.height}`);
      
      for (const website of CROSS_PLATFORM_CONFIG.WEBSITES) {
        try {
          const result = await this.testWebsiteResponsiveness(website, viewport, deviceType);
          this.storeTestResult('responsive_design', result);
        } catch (error) {
          console.error(`   ❌ Error testing ${website} on ${deviceType}:`, error.message);
        }
      }
    }
  }

  /**
   * Test cross-browser compatibility
   */
  async testCrossBrowserCompatibility(): Promise<void> {
    console.log('🌐 Testing Cross-Browser Compatibility...');
    
    for (const browser of CROSS_PLATFORM_CONFIG.BROWSERS) {
      console.log(`   Testing ${browser.toUpperCase()} browser`);
      
      for (const website of CROSS_PLATFORM_CONFIG.WEBSITES) {
        try {
          const result = await this.testWebsiteInBrowser(website, browser);
          this.storeTestResult('cross_browser', result);
        } catch (error) {
          console.error(`   ❌ Error testing ${website} in ${browser}:`, error.message);
        }
      }
    }
  }

  /**
   * Test website responsiveness
   */
  private async testWebsiteResponsiveness(website: string, viewport: any, deviceType: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const browser = await this.browserManager.launchBrowser({
        name: 'chrome',
        headless: true,
        viewport,
        timeout: 15000
      });
      
      const page = await browser.newPage();
      await page.setViewportSize(viewport);
      await page.goto(website, { waitUntil: 'networkidle' });
      
      const responsiveElements = await this.detectResponsiveElements(page);
      const viewportBehavior = await this.testViewportBehavior(page, viewport);
      
      await browser.close();
      
      return {
        website,
        deviceType,
        viewport,
        responsiveElements,
        viewportBehavior,
        testTime: Date.now() - startTime,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        website,
        deviceType,
        viewport,
        error: error.message,
        status: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test website in specific browser
   */
  private async testWebsiteInBrowser(website: string, browserName: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const browser = await this.browserManager.launchBrowser({
        name: browserName,
        headless: true,
        timeout: 15000
      });
      
      const page = await browser.newPage();
      await page.goto(website, { waitUntil: 'networkidle' });
      
      const browserFeatures = await this.testBrowserFeatures(page, browserName);
      const pomResult = await this.generator.generatePOM(website, {
        framework: 'playwright',
        language: 'typescript',
        browser: { name: browserName, headless: true },
        timeout: 15000
      });
      
      await browser.close();
      
      return {
        website,
        browser: browserName,
        browserFeatures,
        pomSuccess: pomResult.success,
        testTime: Date.now() - startTime,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        website,
        browser: browserName,
        error: error.message,
        status: 'ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Helper methods
   */
  private async detectResponsiveElements(page: any): Promise<any> {
    return await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const responsiveElements = [];
      
      for (const element of elements) {
        const styles = window.getComputedStyle(element);
        if (styles.mediaQuery || styles.flexbox || styles.grid) {
          responsiveElements.push({
            tagName: element.tagName,
            className: element.className,
            id: element.id
          });
        }
      }
      
      return responsiveElements.slice(0, 10);
    });
  }

  private async testViewportBehavior(page: any, viewport: any): Promise<any> {
    return await page.evaluate((viewport: any) => {
      return {
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        documentWidth: document.documentElement.clientWidth,
        documentHeight: document.documentElement.clientHeight,
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]')
      };
    }, viewport);
  }

  private async testBrowserFeatures(page: any, browserName: string): Promise<any> {
    return await page.evaluate((browserName: string) => {
      return {
        browserName,
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        webGL: !!window.WebGLRenderingContext,
        geolocation: !!navigator.geolocation
      };
    }, browserName);
  }

  private storeTestResult(testType: string, result: any): void {
    if (!this.testResults.has(testType)) {
      this.testResults.set(testType, []);
    }
    this.testResults.get(testType)!.push(result);
  }

  getTestResults(): any {
    const results: any = {};
    this.testResults.forEach((value, key) => {
      results[key] = value;
    });
    return results;
  }

  generateTestReport(): string {
    const results = this.getTestResults();
    let report = '🌐 Cross-Platform Test Report\n';
    report += '==============================\n\n';
    
    Object.entries(results).forEach(([testType, testResults]: [string, any]) => {
      report += `📋 ${testType.toUpperCase().replace('_', ' ')}\n`;
      report += `${'='.repeat(testType.length + 2)}\n`;
      
      const successfulTests = testResults.filter((r: any) => r.status === 'SUCCESS');
      const failedTests = testResults.filter((r: any) => r.status === 'ERROR');
      
      report += `   ✅ Successful: ${successfulTests.length}\n`;
      report += `   ❌ Failed: ${failedTests.length}\n`;
      report += `   📊 Success Rate: ${((successfulTests.length / testResults.length) * 100).toFixed(1)}%\n\n`;
    });
    
    return report;
  }
}

// Test suite
describe('🌐 Cross-Platform Test Suite', () => {
  let crossPlatformTester: CrossPlatformTester;

  beforeAll(async () => {
    crossPlatformTester = new CrossPlatformTester();
  });

  describe('🚀 Cross-Platform Initialization', () => {
    test('should initialize cross-platform tester', () => {
      expect(crossPlatformTester).toBeDefined();
      expect(typeof crossPlatformTester.testResponsiveDesign).toBe('function');
      expect(typeof crossPlatformTester.testCrossBrowserCompatibility).toBe('function');
    });

    test('should have proper configuration', () => {
      expect(CROSS_PLATFORM_CONFIG.VIEWPORTS).toBeDefined();
      expect(CROSS_PLATFORM_CONFIG.BROWSERS).toBeDefined();
      expect(CROSS_PLATFORM_CONFIG.WEBSITES).toBeDefined();
    });
  });

  describe('📱 Responsive Design Tests', () => {
    test('should test responsive design across viewports', async () => {
      const viewport = CROSS_PLATFORM_CONFIG.VIEWPORTS.MOBILE;
      const website = CROSS_PLATFORM_CONFIG.WEBSITES[0];
      
      const result = await crossPlatformTester['testWebsiteResponsiveness'](website, viewport, 'mobile');
      
      expect(result).toBeDefined();
      expect(result.website).toBe(website);
      expect(result.deviceType).toBe('mobile');
      expect(result.viewport).toEqual(viewport);
    }, 20000);
  });

  describe('🌐 Cross-Browser Tests', () => {
    test('should test website in different browsers', async () => {
      const website = CROSS_PLATFORM_CONFIG.WEBSITES[0];
      const browser = 'chrome';
      
      const result = await crossPlatformTester['testWebsiteInBrowser'](website, browser);
      
      expect(result).toBeDefined();
      expect(result.website).toBe(website);
      expect(result.browser).toBe(browser);
    }, 20000);
  });

  describe('📊 Test Results and Reporting', () => {
    test('should store test results correctly', () => {
      const testResult = {
        testType: 'test',
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      };
      
      crossPlatformTester['storeTestResult']('test_type', testResult);
      
      const results = crossPlatformTester.getTestResults();
      expect(results.test_type).toBeDefined();
      expect(results.test_type.length).toBeGreaterThan(0);
    });

    test('should generate test report', () => {
      const report = crossPlatformTester.generateTestReport();
      
      expect(report).toContain('Cross-Platform Test Report');
      expect(report).toContain('Successful:');
      expect(report).toContain('Failed:');
      expect(report).toContain('Success Rate:');
    });
  });
});
