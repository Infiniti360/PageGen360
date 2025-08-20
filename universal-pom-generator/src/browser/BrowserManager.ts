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

      // Configure timeouts conservatively
      try {
        await this.browser.manage().setTimeouts({ pageLoad: 60000, script: 15000, implicit: 0 });
      } catch {}
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
      await this.waitForPageLoad(browser);
      await this.waitForNetworkIdle(browser);
      await this.waitForDOMStable(browser);
      this.logger.debug('Page navigation completed');
    } catch (error) {
      this.logger.error(`Page navigation failed: ${error}`);
      throw error;
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
   * Get page description meta content
   */
  async getPageDescription(browser: any): Promise<string> {
    try {
      return await browser.executeScript(`
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.getAttribute('content') || '' : '';
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
      await browser.executeScript(`
        return new Promise((resolve) => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve, { once: true });
          }
        });
      `);
    } catch (error) {
      this.logger.warn(`Page load wait failed: ${error}`);
    }
  }

  /**
   * Wait until the page is idle from network activity for a short window
   */
  private async waitForNetworkIdle(browser: any): Promise<void> {
    try {
      await browser.executeScript(`
        return new Promise((resolve) => {
          let idleTimer;
          const idleMs = 1500;
          const maxMs = 10000;
          let elapsed = 0;

          function reset() {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(done, idleMs);
          }

          function done() {
            resolve();
          }

          const obs = (window.performance && window.PerformanceObserver) ? new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'resource' || entry.entryType === 'navigation') {
                reset();
              }
            }
          }) : null;

          try { obs && obs.observe({ entryTypes: ['resource', 'navigation'] }); } catch {}

          reset();
          const interval = setInterval(() => {
            elapsed += 250;
            if (elapsed >= maxMs) {
              clearInterval(interval);
              obs && obs.disconnect();
              resolve();
            }
          }, 250);
        });
      `);
    } catch (error) {
      this.logger.warn(`Network idle wait failed: ${error}`);
    }
  }

  /**
   * Wait until DOM stops mutating for a few consecutive checks
   */
  private async waitForDOMStable(browser: any): Promise<void> {
    try {
      await browser.executeScript(`
        return new Promise((resolve) => {
          let last = document.body ? document.body.innerHTML.length : 0;
          let stableCount = 0;
          const needed = 3;
          const maxMs = 10000;
          const start = Date.now();

          const obs = new MutationObserver(() => {
            const len = document.body ? document.body.innerHTML.length : 0;
            if (len === last) {
              stableCount++;
              if (stableCount >= needed) {
                obs.disconnect();
                resolve();
              }
            } else {
              stableCount = 0;
              last = len;
            }
            if (Date.now() - start > maxMs) {
              obs.disconnect();
              resolve();
            }
          });
          obs.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true });
          // Kick once in case already stable
          setTimeout(() => { obs.disconnect(); resolve(); }, maxMs);
        });
      `);
    } catch (error) {
      this.logger.warn(`DOM stability wait failed: ${error}`);
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
      options.addArguments('--headless=new');
    }
    
    if (config.userAgent) {
      options.addArguments(`--user-agent=${config.userAgent}`);
    }
    
    if (config.viewport) {
      options.addArguments(`--window-size=${config.viewport.width},${config.viewport.height}`);
    }
    
    // Stability flags
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-gpu');
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

  /**
   * Wait until window.location.href equals the expected URL
   */
  async waitForUrlIs(browser: any, expectedUrl: string, timeoutMs: number = 20000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const current = await browser.getCurrentUrl();
        if (current === expectedUrl) return true;
      } catch {}
      await new Promise(r => setTimeout(r, 250));
    }
    return false;
  }

  /**
   * Wait until window.location.pathname equals the expected path
   */
  async waitForPathIs(browser: any, expectedPath: string, timeoutMs: number = 20000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const current = await browser.getCurrentUrl();
        try {
          const u = new URL(current);
          if (u.pathname === expectedPath) return true;
        } catch {}
      } catch {}
      await new Promise(r => setTimeout(r, 250));
    }
    return false;
  }
} 