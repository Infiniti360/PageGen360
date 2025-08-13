import { BasePage } from './BasePage';
import { Page, ElementHandle } from 'puppeteer';
import { expect } from 'chai';

/**
 * Puppeteer-specific base class with async method chaining support
 */
export class PuppeteerBasePage extends BasePage {
  protected page: Page;
  protected elements: Record<string, ElementHandle<Element>> = {};
  
  constructor(page: Page) {
    super();
    this.page = page;
  }
  
  // Navigation methods
  async navigateToPage(url: string): Promise<void> {
    this.pageUrl = url;
    await this.page.goto(url, { waitUntil: 'networkidle0' });
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('body');
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content
  }
  
  // Utility methods
  async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || this.generateScreenshotFilename('puppeteer');
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
    const body = await this.page.$('body');
    expect(body).to.exist;
    
    const mainElements = await this.page.$$('main, .main, #main');
    expect(mainElements.length).to.be.greaterThan(0);
  }
  
  async validateAccessibility(): Promise<void> {
    // Basic accessibility checks for Puppeteer
    const buttons = await this.page.$$('button');
    
    for (const button of buttons) {
      const hasAriaLabel = await button.evaluate(el => el.getAttribute('aria-label'));
      const hasText = await button.evaluate(el => el.textContent);
      const hasImgAlt = await button.evaluate(el => {
        const img = el.querySelector('img');
        return img ? img.getAttribute('alt') : null;
      });
      
      expect(hasAriaLabel || hasText?.trim() || hasImgAlt).to.be.true;
    }
  }
  
  async validateResponsiveDesign(): Promise<void> {
    // Basic responsive checks for Puppeteer
    const body = await this.page.$('body');
    expect(body).to.exist;
    
    // Test different viewport sizes
    await this.page.setViewport({ width: 1920, height: 1080 });
    expect(await this.page.$('body')).to.exist;
    
    await this.page.setViewport({ width: 768, height: 1024 });
    expect(await this.page.$('body')).to.exist;
  }
  
  // Protected helper methods for chaining
  protected async assertElementVisible(element: ElementHandle<Element>): Promise<this> {
    const isVisible = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
    });
    expect(isVisible).to.be.true;
    return this;
  }
  
  protected async assertElementText(element: ElementHandle<Element>, expectedText: string): Promise<this> {
    const actualText = await element.evaluate(el => el.textContent);
    expect(actualText).to.contain(expectedText);
    return this;
  }
  
  protected async assertElementExists(element: ElementHandle<Element>): Promise<this> {
    expect(element).to.exist;
    return this;
  }
  
  protected async assertElementNotVisible(element: ElementHandle<Element>): Promise<this> {
    const isVisible = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
    });
    expect(isVisible).to.be.false;
    return this;
  }
  
  protected async clickElement(element: ElementHandle<Element>): Promise<this> {
    await element.click();
    return this;
  }
  
  protected async typeText(element: ElementHandle<Element>, text: string): Promise<this> {
    await element.evaluate(el => (el as HTMLInputElement).value = '');
    await element.type(text);
    return this;
  }
  
  protected async clearText(element: ElementHandle<Element>): Promise<this> {
    await element.evaluate(el => (el as HTMLInputElement).value = '');
    return this;
  }
  
  protected async hoverElement(element: ElementHandle<Element>): Promise<this> {
    await element.hover();
    return this;
  }
  
  protected async waitForElement(element: ElementHandle<Element>, timeout: number = 10000): Promise<this> {
    await element.waitForElementState('visible', { timeout });
    return this;
  }
  
  protected async waitForElementToDisappear(element: ElementHandle<Element>, timeout: number = 10000): Promise<this> {
    await element.waitForElementState('hidden', { timeout });
    return this;
  }
  
  protected async scrollToElement(element: ElementHandle<Element>): Promise<this> {
    await element.scrollIntoView();
    return this;
  }
  
  protected async selectOption(element: ElementHandle<Element>, option: string): Promise<this> {
    await element.select(option);
    return this;
  }
  
  protected async checkCheckbox(element: ElementHandle<Element>): Promise<this> {
    const isChecked = await element.evaluate(el => (el as HTMLInputElement).checked);
    if (!isChecked) {
      await element.click();
    }
    return this;
  }
  
  protected async uncheckCheckbox(element: ElementHandle<Element>): Promise<this> {
    const isChecked = await element.evaluate(el => (el as HTMLInputElement).checked);
    if (isChecked) {
      await element.click();
    }
    return this;
  }
  
  protected async assertUrlContains(path: string): Promise<this> {
    const currentUrl = await this.page.url();
    expect(currentUrl).to.contain(path);
    return this;
  }
  
  protected async assertPageTitle(title: string): Promise<this> {
    const currentTitle = await this.page.title();
    expect(currentTitle).to.equal(title);
    return this;
  }
  
  // Element management methods
  protected async getElement(selector: string): Promise<ElementHandle<Element>> {
    return await this.page.$(selector);
  }
  
  protected async getElementById(id: string): Promise<ElementHandle<Element>> {
    return await this.page.$(`#${id}`);
  }
  
  protected async getElementByText(text: string): Promise<ElementHandle<Element>> {
    return await this.page.$(`text=${text}`);
  }
  
  protected async getElementByXPath(xpath: string): Promise<ElementHandle<Element>> {
    const elements = await this.page.$x(xpath);
    return elements[0];
  }
  
  protected async getElementByClassName(className: string): Promise<ElementHandle<Element>> {
    return await this.page.$(`.${className}`);
  }
  
  protected async getElementByName(name: string): Promise<ElementHandle<Element>> {
    return await this.page.$(`[name="${name}"]`);
  }
  
  protected async getElementByTagName(tagName: string): Promise<ElementHandle<Element>> {
    return await this.page.$(tagName);
  }
  
  // Wait utilities
  protected async waitForElementLocated(selector: string, timeout: number = 10000): Promise<ElementHandle<Element>> {
    return await this.page.waitForSelector(selector, { timeout });
  }
  
  protected async waitForElementVisible(selector: string, timeout: number = 10000): Promise<ElementHandle<Element>> {
    return await this.page.waitForSelector(selector, { visible: true, timeout });
  }
  
  protected async waitForElementHidden(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { hidden: true, timeout });
  }
  
  // Page evaluation methods
  protected async evaluateOnPage<T>(pageFunction: () => T): Promise<T> {
    return await this.page.evaluate(pageFunction);
  }
  
  protected async evaluateOnElement<T>(element: ElementHandle<Element>, pageFunction: (el: Element) => T): Promise<T> {
    return await element.evaluate(pageFunction);
  }
}
