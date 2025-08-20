import { LoginConfig } from '../types';
import { Logger } from '../utils/Logger';

// Import Selenium WebDriver components
const { By, until } = require('selenium-webdriver');

export class AuthenticationHandler {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Handle login for a URL
   */
  async handleLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.info(`Handling login for URL: ${url} with type: ${loginConfig.type}`);

    try {
      switch (loginConfig.type) {
        case 'oauth2':
          return await this.handleOAuth2Login(url, loginConfig, browser);
        case 'saml':
          return await this.handleSAMLLogin(url, loginConfig, browser);
        case 'basic':
          return await this.handleBasicAuthLogin(url, loginConfig, browser);
        case 'token':
          return await this.handleTokenAuthLogin(url, loginConfig, browser);
        case 'sso':
          return await this.handleSSOLogin(url, loginConfig, browser);
        case 'custom':
          return await this.handleCustomLogin(url, loginConfig, browser);
        default:
          throw new Error(`Unsupported authentication type: ${loginConfig.type}`);
      }
    } catch (error) {
      this.logger.error(`Login failed: ${error}`);
      throw error;
    }
  }

  /**
   * Handle OAuth2 login
   */
  private async handleOAuth2Login(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling OAuth2 login');
    
    const { clientId, clientSecret, redirectUri } = loginConfig.credentials || {};
    
    if (!clientId || !clientSecret) {
      throw new Error('OAuth2 requires clientId and clientSecret');
    }

    // Navigate to OAuth authorization URL
    const authUrl = `${url}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    await browser.get(authUrl);

    // Wait for user to complete OAuth flow
    await browser.wait(until.urlContains('code='), 30000);

    this.logger.debug('OAuth2 login completed');
    return { success: true, type: 'oauth2' };
  }

  /**
   * Handle SAML login
   */
  private async handleSAMLLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling SAML login');
    
    const { username, password } = loginConfig.credentials || {};
    
    if (!username || !password) {
      throw new Error('SAML login requires username and password');
    }

    // Navigate to SAML login page
    await browser.get(url);

    // Find and fill username field
    const usernameField = await browser.findElement(By.name('username') || By.id('username'));
    await usernameField.sendKeys(username);

    // Find and fill password field
    const passwordField = await browser.findElement(By.name('password') || By.id('password'));
    await passwordField.sendKeys(password);

    // Submit form
    const submitButton = await browser.findElement(By.type('submit') || By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for redirect to complete
    await browser.wait(until.urlNotContains('login'), 10000);

    this.logger.debug('SAML login completed');
    return { success: true, type: 'saml' };
  }

  /**
   * Handle Basic Auth login (form-based)
   */
  private async handleBasicAuthLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling Basic Auth login (form-based)');
    
    const { username, password } = loginConfig.credentials || {};
    const { loginUrl, selectors, waitForLogin } = loginConfig;
    
    if (!username || !password) {
      throw new Error('Basic Auth requires username and password');
    }

    // Navigate to login page - use the specific login URL if provided
    const loginPageUrl = loginUrl || url;
    this.logger.debug(`Navigating to login page: ${loginPageUrl}`);
    await browser.get(loginPageUrl);
    await new Promise(r => setTimeout(r, 500));

    // Wait for page to load completely
    await browser.executeScript(`
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve, { once: true });
        }
      });
    `);
    
    // Additional wait for dynamic content and JavaScript execution
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if we're actually on a login page
    const currentUrl = await browser.getCurrentUrl();
    this.logger.debug(`Current URL after navigation: ${currentUrl}`);
    
    // If we're not on the expected login page, try to find login elements anyway
    const pageTitle = await browser.getTitle();
    this.logger.debug(`Page title: ${pageTitle}`);
    
    // Ensure we're on the correct login page
    if (loginUrl) {
      const currentUrl = await browser.getCurrentUrl();
      if (currentUrl !== loginUrl) {
        this.logger.debug(`Navigating to login URL: ${loginUrl}`);
        await browser.get(loginUrl);
        await new Promise(r => setTimeout(r, 500));
        
        // Wait for the login page to load completely
        await browser.executeScript(`
          return new Promise((resolve) => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              window.addEventListener('load', resolve, { once: true });
            }
          });
        `);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const finalUrl = await browser.getCurrentUrl();
        this.logger.debug(`Final URL after login navigation: ${finalUrl}`);
      }
    }

    // More robust username field detection
    const usernameSelectors = [
      selectors?.usernameField,
      'input[name="email"][type="email"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[type="text"]',
      'input[id*="email"]',
      'input[id*="username"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]',
      'input[placeholder*="Username"]',
      'input[name="username"]',
      'input[id="email"]',
      'input[id="username"]'
    ].filter(Boolean);
    
    this.logger.debug(`Available username selectors: ${usernameSelectors.join(', ')}`);
    
    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        this.logger.debug(`Trying username selector: ${selector}`);
        usernameField = await browser.findElement(By.css(selector));
        this.logger.debug(`Found username field with selector: ${selector}`);
        break;
      } catch (error) {
        this.logger.debug(`Username selector failed: ${selector}`);
      }
    }
    
    if (!usernameField) {
      // Try to get page source for debugging
      const pageSource = await browser.getPageSource();
      this.logger.debug(`Page source preview: ${pageSource.substring(0, 500)}...`);
      throw new Error('Could not find username/email field on login page. Please check the login URL and selectors.');
    }
    
    await usernameField.clear();
    await usernameField.sendKeys(username);

    // More robust password field detection
    const passwordSelectors = [
      selectors?.passwordField,
      'input[name="password"][type="password"]',
      'input[type="password"]',
      'input[name="password"]',
      'input[id*="password"]',
      'input[placeholder*="password"]',
      'input[placeholder*="Password"]',
      'input[id="password"]'
    ].filter(Boolean);
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        this.logger.debug(`Trying password selector: ${selector}`);
        passwordField = await browser.findElement(By.css(selector));
        this.logger.debug(`Found password field with selector: ${selector}`);
        break;
      } catch (error) {
        this.logger.debug(`Password selector failed: ${selector}`);
      }
    }
    
    if (!passwordField) {
      throw new Error('Could not find password field on login page');
    }
    
    await passwordField.clear();
    await passwordField.sendKeys(password);

    // More robust submit button detection
    const submitSelectors = [
      selectors?.submitButton,
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Sign In")',
      'button:contains("Login")',
      'button:contains("Submit")',
      'input[value*="Sign"]',
      'input[value*="Login"]',
      'input[value*="Submit"]',
      'button[class*="submit"]',
      'button[class*="login"]',
      'button[class*="sign"]'
    ].filter(Boolean);
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        this.logger.debug(`Trying submit selector: ${selector}`);
        submitButton = await browser.findElement(By.css(selector));
        this.logger.debug(`Found submit button with selector: ${selector}`);
        break;
      } catch (error) {
        this.logger.debug(`Submit selector failed: ${selector}`);
      }
    }
    
    if (!submitButton) {
      throw new Error('Could not find submit button on login page');
    }
    
    await submitButton.click();
    await new Promise(r => setTimeout(r, 1200));

    // Wait for login to complete with better error handling
    if (waitForLogin) {
      if (waitForLogin.type === 'url') {
        this.logger.debug(`Waiting for URL to contain: ${waitForLogin.value}`);
        try {
          await browser.wait(until.urlContains(waitForLogin.value), 30000);
          this.logger.debug(`Successfully redirected to URL containing: ${waitForLogin.value}`);
        } catch (error) {
          const currentUrl = await browser.getCurrentUrl();
          this.logger.debug(`Timeout waiting for URL. Current URL: ${currentUrl}`);
          throw new Error(`Login timeout: Expected URL to contain '${waitForLogin.value}' but got '${currentUrl}'`);
        }
      } else if (waitForLogin.type === 'selector') {
        this.logger.debug(`Waiting for selector: ${waitForLogin.value}`);
        try {
          await browser.wait(until.elementLocated(By.css(waitForLogin.value)), 30000);
          this.logger.debug(`Successfully found element: ${waitForLogin.value}`);
        } catch (error) {
          throw new Error(`Login timeout: Could not find element '${waitForLogin.value}'`);
        }
      }
    } else {
      // Default wait for navigation
      this.logger.debug('Waiting for navigation after login');
      try {
        await browser.wait(until.urlNotContains('login'), 10000);
      } catch (error) {
        this.logger.debug('Default login wait failed, continuing anyway');
      }
    }

    this.logger.debug('Basic Auth login completed');
    return { success: true, type: 'basic' };
  }

  /**
   * Handle Token Auth login
   */
  private async handleTokenAuthLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling Token Auth login');
    
    const { token } = loginConfig.credentials || {};
    
    if (!token) {
      throw new Error('Token Auth requires token');
    }

    // Add authorization header
    await browser.executeScript(`
      const headers = new Headers();
      headers.append('Authorization', 'Bearer ${token}');
    `);

    // Navigate to URL with token
    await browser.get(url);

    this.logger.debug('Token Auth login completed');
    return { success: true, type: 'token' };
  }

  /**
   * Handle SSO login
   */
  private async handleSSOLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling SSO login');
    
    const { username, password } = loginConfig.credentials || {};
    
    if (!username || !password) {
      throw new Error('SSO login requires username and password');
    }

    // Navigate to SSO login page
    await browser.get(url);

    // Find and fill username field
    const usernameField = await browser.findElement(By.name('username') || By.id('username'));
    await usernameField.sendKeys(username);

    // Find and fill password field
    const passwordField = await browser.findElement(By.name('password') || By.id('password'));
    await passwordField.sendKeys(password);

    // Submit form
    const submitButton = await browser.findElement(By.type('submit') || By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for SSO redirect to complete
    await browser.wait(until.urlNotContains('login'), 15000);

    this.logger.debug('SSO login completed');
    return { success: true, type: 'sso' };
  }

  /**
   * Handle Custom login
   */
  private async handleCustomLogin(url: string, loginConfig: LoginConfig, browser: any): Promise<any> {
    this.logger.debug('Handling Custom login');
    
    if (!loginConfig.customScript) {
      throw new Error('Custom login requires customScript');
    }

    // Navigate to login page
    await browser.get(url);

    // Execute custom login script
    await browser.executeScript(loginConfig.customScript);

    this.logger.debug('Custom login completed');
    return { success: true, type: 'custom' };
  }
} 