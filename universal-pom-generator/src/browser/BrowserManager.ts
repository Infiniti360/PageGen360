import { BrowserConfig } from '../types';
import { Logger } from '../utils/Logger';

export class BrowserManager {
  private logger: Logger;
  private browser: any;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Initialize browser with configuration
   */
  async initializeBrowser(config?: BrowserConfig): Promise<any> {
    this.logger.debug('Initializing browser');

    const browserConfig = config || { name: 'chrome', headless: true };

    try {
      switch (browserConfig.name) {
        case 'chrome':
          this.browser = await this.initializeChrome(browserConfig);
          break;
        case 'firefox':
          this.browser = await this.initializeFirefox(browserConfig);
          break;
        case 'safari':
          this.browser = await this.initializeSafari(browserConfig);
          break;
        case 'edge':
          this.browser = await this.initializeEdge(browserConfig);
          break;
        default:
          throw new Error(`Unsupported browser: ${browserConfig.name}`);
      }

      this.logger.debug(`Browser ${browserConfig.name} initialized successfully`);
      return this.browser;
    } catch (error) {
      this.logger.error(`Browser initialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Navigate to page
   */
  async navigateToPage(url: string, browser: any): Promise<void> {
    this.logger.debug(`Navigating to: ${url}`);

    try {
      await browser.get(url);
      
      // Wait for initial page load
      await this.waitForPageLoad(browser);
      
      // Additional wait for dynamic content
      await this.waitForDynamicContent(browser);
      
      // Wait for DOM to be stable
      await this.waitForDOMStable(browser);
      
      this.logger.debug('Page navigation completed');
    } catch (error) {
      this.logger.error(`Page navigation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Wait for DOM to be stable
   */
  private async waitForDOMStable(browser: any): Promise<void> {
    try {
      await browser.executeScript(`
        return new Promise((resolve) => {
          let lastDOM = document.body.innerHTML;
          let stableCount = 0;
          const maxStableCount = 3;
          
          const observer = new MutationObserver(() => {
            const currentDOM = document.body.innerHTML;
            if (currentDOM === lastDOM) {
              stableCount++;
              if (stableCount >= maxStableCount) {
                observer.disconnect();
                resolve();
              }
            } else {
              stableCount = 0;
              lastDOM = currentDOM;
            }
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
          });
          
          // Fallback timeout
          setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 10000);
        });
      `);
    } catch (error) {
      this.logger.warn(`DOM stability wait failed: ${error}`);
    }
  }

  /**
   * Wait for dynamic content to load
   */
  private async waitForDynamicContent(browser: any): Promise<void> {
    try {
      await browser.executeScript(`
        return new Promise((resolve) => {
          // Wait for any AJAX requests to complete
          let ajaxCount = 0;
          const originalXHROpen = XMLHttpRequest.prototype.open;
          const originalFetch = window.fetch;
          
          XMLHttpRequest.prototype.open = function() {
            ajaxCount++;
            this.addEventListener('load', () => {
              ajaxCount--;
              if (ajaxCount === 0) {
                setTimeout(resolve, 1000);
              }
            });
            return originalXHROpen.apply(this, arguments);
          };
          
          window.fetch = function() {
            ajaxCount++;
            return originalFetch.apply(this, arguments).finally(() => {
              ajaxCount--;
              if (ajaxCount === 0) {
                setTimeout(resolve, 1000);
              }
            });
          };
          
          // If no AJAX requests, resolve after a delay
          setTimeout(resolve, 2000);
        });
      `);
    } catch (error) {
      this.logger.warn(`Dynamic content wait failed: ${error}`);
    }
  }

  /**
   * Get page title
   */
  async getPageTitle(browser: any): Promise<string> {
    try {
      return await browser.getTitle();
    } catch (error) {
      this.logger.warn(`Failed to get page title: ${error}`);
      return '';
    }
  }

  /**
   * Get user agent
   */
  async getUserAgent(browser: any): Promise<string> {
    try {
      return await browser.executeScript('return navigator.userAgent;');
    } catch (error) {
      this.logger.warn(`Failed to get user agent: ${error}`);
      return '';
    }
  }

  /**
   * Get page description
   */
  async getPageDescription(browser: any): Promise<string> {
    try {
      return await browser.executeScript(`
        const metaDescription = document.querySelector('meta[name="description"]');
        return metaDescription ? metaDescription.getAttribute('content') : '';
      `);
    } catch (error) {
      this.logger.warn(`Failed to get page description: ${error}`);
      return '';
    }
  }

  /**
   * Wait for page load
   */
  private async waitForPageLoad(browser: any): Promise<void> {
    try {
      // Wait for DOM to be ready
      await browser.executeScript(`
        return new Promise((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve);
          }
        });
      `);
      
      // Additional wait for network idle and dynamic content
      await browser.executeScript(`
        return new Promise((resolve) => {
          // Wait for network to be idle
          let networkIdleTimer;
          const resetTimer = () => {
            clearTimeout(networkIdleTimer);
            networkIdleTimer = setTimeout(resolve, 3000);
          };
          
          // Listen for network requests
          if (window.performance && window.performance.getEntriesByType) {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.entryType === 'resource') {
                  resetTimer();
                }
              }
            });
            
            try {
              observer.observe({ entryTypes: ['resource'] });
            } catch (e) {
              // Fallback if PerformanceObserver is not supported
            }
          }
          
          resetTimer();
        });
      `);
      
      // Wait for any dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      this.logger.warn(`Page load wait failed: ${error}`);
    }
  }

  /**
   * Initialize Chrome browser
   */
  private async initializeChrome(config: BrowserConfig): Promise<any> {
    const { Builder } = require('selenium-webdriver');
    const { Options } = require('selenium-webdriver/chrome');

    const options = new Options();
    
    if (config.headless) {
      options.addArguments('--headless');
    }
    
    if (config.userAgent) {
      options.addArguments(`--user-agent=${config.userAgent}`);
    }
    
    if (config.viewport) {
      options.addArguments(`--window-size=${config.viewport.width},${config.viewport.height}`);
    }
    
    if (config.args) {
      options.addArguments(...config.args);
    }

    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  /**
   * Initialize Firefox browser
   */
  private async initializeFirefox(config: BrowserConfig): Promise<any> {
    const { Builder } = require('selenium-webdriver');
    const { Options } = require('selenium-webdriver/firefox');

    const options = new Options();
    
    if (config.headless) {
      options.headless();
    }
    
    if (config.userAgent) {
      options.addArguments(`--user-agent=${config.userAgent}`);
    }

    return new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  }

  /**
   * Initialize Safari browser
   */
  private async initializeSafari(_config: BrowserConfig): Promise<any> {
    const { Builder } = require('selenium-webdriver');

    return new Builder()
      .forBrowser('safari')
      .build();
  }

  /**
   * Initialize Edge browser
   */
  private async initializeEdge(config: BrowserConfig): Promise<any> {
    const { Builder } = require('selenium-webdriver');
    const { Options } = require('selenium-webdriver/edge');

    const options = new Options();
    
    if (config.headless) {
      options.addArguments('--headless');
    }
    
    if (config.userAgent) {
      options.addArguments(`--user-agent=${config.userAgent}`);
    }

    return new Builder()
      .forBrowser('edge')
      .setEdgeOptions(options)
      .build();
  }

  /**
   * Launch browser with configuration
   */
  async launchBrowser(config: BrowserConfig): Promise<any> {
    this.logger.debug(`Launching browser: ${config.name}`);
    
    try {
      const browser = await this.initializeBrowser(config);
      this.browser = browser;
      this.logger.debug(`Browser ${config.name} launched successfully`);
      return browser;
    } catch (error) {
      this.logger.error(`Failed to launch browser ${config.name}: ${error}`);
      throw error;
    }
  }

  /**
   * Check if browser is running
   */
  isRunning(): boolean {
    return this.browser !== null && this.browser !== undefined;
  }

  /**
   * Get current browser instance
   */
  getBrowser(): any {
    return this.browser;
  }

  /**
   * Cleanup browser resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      try {
        // Close all windows first
        const handles = await this.browser.getAllWindowHandles();
        for (const handle of handles) {
          try {
            await this.browser.switchTo().window(handle);
            await this.browser.close();
          } catch (closeError) {
            this.logger.warn(`Failed to close window ${handle}: ${closeError}`);
          }
        }
        
        // Quit the browser
        await this.browser.quit();
        this.browser = null;
        this.logger.debug('Browser cleanup completed');
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
          this.logger.debug('Garbage collection triggered');
        }
      } catch (error) {
        this.logger.warn(`Browser cleanup failed: ${error}`);
      }
    }
  }
} 