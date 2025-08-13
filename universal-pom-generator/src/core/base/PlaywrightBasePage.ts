import { BasePage } from './BasePage';
import { Page, Locator, expect } from '@playwright/test';

/**
 * Playwright-specific base class with async method chaining support
 */
export class PlaywrightBasePage extends BasePage {
  protected page: Page;
  protected locators: Record<string, Locator> = {};
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  // Navigation methods
  async navigateToPage(url: string): Promise<void> {
    this.pageUrl = url;
    await this.page.goto(url);
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content
  }
  
  // Utility methods
  async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || this.generateScreenshotFilename('playwright');
    await this.page.screenshot({ path: screenshotPath });
    return screenshotPath;
  }
  
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
  
  async getPageUrl(): Promise<string> {
    return this.page.url();
  }
  
  // Validation methods
  async validatePageStructure(): Promise<void> {
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page.locator('main, .main, #main')).toHaveCount(1);
  }
  
  async validateAccessibility(): Promise<void> {
    // Basic accessibility checks for Playwright
    const buttons = this.page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      const hasImgAlt = await button.locator('img').getAttribute('alt');
      
      if (!hasAriaLabel && !hasText?.trim() && !hasImgAlt) {
        throw new Error(`Button at index ${i} lacks accessibility attributes`);
      }
    }
  }
  
  async validateResponsiveDesign(): Promise<void> {
    // Basic responsive checks for Playwright
    await expect(this.page.locator('body')).toBeVisible();
    
    // Test different viewport sizes
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await expect(this.page.locator('body')).toBeVisible();
    
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await expect(this.page.locator('body')).toBeVisible();
  }
  
  // Protected helper methods for chaining
  protected async assertElementVisible(locator: Locator): Promise<this> {
    await expect(locator).toBeVisible();
    return this;
  }
  
  protected async assertElementText(locator: Locator, expectedText: string): Promise<this> {
    await expect(locator).toHaveText(expectedText);
    return this;
  }
  
  protected async assertElementExists(locator: Locator): Promise<this> {
    await expect(locator).toHaveCount(1);
    return this;
  }
  
  protected async assertElementNotVisible(locator: Locator): Promise<this> {
    await expect(locator).not.toBeVisible();
    return this;
  }
  
  protected async clickElement(locator: Locator): Promise<this> {
    await locator.click();
    return this;
  }
  
  protected async typeText(locator: Locator, text: string): Promise<this> {
    await locator.fill(text);
    return this;
  }
  
  protected async clearText(locator: Locator): Promise<this> {
    await locator.clear();
    return this;
  }
  
  protected async hoverElement(locator: Locator): Promise<this> {
    await locator.hover();
    return this;
  }
  
  protected async waitForElement(locator: Locator, timeout: number = 10000): Promise<this> {
    await locator.waitFor({ state: 'visible', timeout });
    return this;
  }
  
  protected async waitForElementToDisappear(locator: Locator, timeout: number = 10000): Promise<this> {
    await locator.waitFor({ state: 'hidden', timeout });
    return this;
  }
  
  protected async scrollToElement(locator: Locator): Promise<this> {
    await locator.scrollIntoViewIfNeeded();
    return this;
  }
  
  protected async selectOption(locator: Locator, option: string): Promise<this> {
    await locator.selectOption(option);
    return this;
  }
  
  protected async checkCheckbox(locator: Locator): Promise<this> {
    await locator.check();
    return this;
  }
  
  protected async uncheckCheckbox(locator: Locator): Promise<this> {
    await locator.uncheck();
    return this;
  }
  
  protected async assertUrlContains(path: string): Promise<this> {
    await expect(this.page).toHaveURL(new RegExp(path));
    return this;
  }
  
  protected async assertPageTitle(title: string): Promise<this> {
    await expect(this.page).toHaveTitle(title);
    return this;
  }
  
  // Locator management methods
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }
  
  protected getLocatorByText(text: string): Locator {
    return this.page.getByText(text);
  }
  
  protected getLocatorByRole(role: string, options?: any): Locator {
    return this.page.getByRole(role, options);
  }
  
  protected getLocatorByLabel(label: string): Locator {
    return this.page.getByLabel(label);
  }
  
  protected getLocatorByPlaceholder(placeholder: string): Locator {
    return this.page.getByPlaceholder(placeholder);
  }
}
