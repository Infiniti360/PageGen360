import { BasePage } from './BasePage';
import { WebDriver, WebElement, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

/**
 * Selenium-specific base class with method chaining support
 */
export class SeleniumBasePage extends BasePage {
  protected driver: WebDriver;
  protected elements: Record<string, WebElement> = {};
  
  constructor(driver: WebDriver) {
    super();
    this.driver = driver;
  }
  
  // Navigation methods
  async navigateToPage(url: string): Promise<void> {
    this.pageUrl = url;
    await this.driver.get(url);
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.driver.wait(until.titleContains(''), 10000);
    await this.driver.wait(until.elementLocated(By.css('body')), 10000);
  }
  
  // Utility methods
  async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || this.generateScreenshotFilename('selenium');
    const screenshot = await this.driver.takeScreenshot();
    const fs = require('fs');
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
    return screenshotPath;
  }
  
  async getPageTitle(): Promise<string> {
    return await this.driver.getTitle();
  }
  
  async getPageUrl(): Promise<string> {
    return await this.driver.getCurrentUrl();
  }
  
  // Validation methods
  async validatePageStructure(): Promise<void> {
    const body = await this.driver.findElement(By.css('body'));
    expect(await body.isDisplayed()).to.be.true;
    
    const mainElements = await this.driver.findElements(By.css('main, .main, #main'));
    expect(mainElements.length).to.be.greaterThan(0);
  }
  
  async validateAccessibility(): Promise<void> {
    // Basic accessibility checks for Selenium
    const buttons = await this.driver.findElements(By.css('button'));
    
    for (const button of buttons) {
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.getText();
      const hasImgAlt = await button.findElements(By.css('img[alt]')).then(elements => elements.length > 0);
      
      expect(hasAriaLabel || hasText.trim() || hasImgAlt).to.be.true;
    }
  }
  
  async validateResponsiveDesign(): Promise<void> {
    // Basic responsive checks for Selenium
    const body = await this.driver.findElement(By.css('body'));
    expect(await body.isDisplayed()).to.be.true;
    
    // Test different window sizes
    await this.driver.manage().window().setRect(1920, 1080, 0, 0);
    expect(await body.isDisplayed()).to.be.true;
    
    await this.driver.manage().window().setRect(768, 1024, 0, 0);
    expect(await body.isDisplayed()).to.be.true;
  }
  
  // Protected helper methods for chaining
  protected async assertElementVisible(element: WebElement): Promise<this> {
    expect(await element.isDisplayed()).to.be.true;
    return this;
  }
  
  protected async assertElementText(element: WebElement, expectedText: string): Promise<this> {
    const actualText = await element.getText();
    expect(actualText).to.contain(expectedText);
    return this;
  }
  
  protected async assertElementExists(element: WebElement): Promise<this> {
    expect(element).to.exist;
    return this;
  }
  
  protected async assertElementNotVisible(element: WebElement): Promise<this> {
    expect(await element.isDisplayed()).to.be.false;
    return this;
  }
  
  protected async clickElement(element: WebElement): Promise<this> {
    await element.click();
    return this;
  }
  
  protected async typeText(element: WebElement, text: string): Promise<this> {
    await element.clear();
    await element.sendKeys(text);
    return this;
  }
  
  protected async clearText(element: WebElement): Promise<this> {
    await element.clear();
    return this;
  }
  
  protected async hoverElement(element: WebElement): Promise<this> {
    const actions = this.driver.actions({ async: true });
    await actions.move({ origin: element }).perform();
    return this;
  }
  
  protected async waitForElement(element: WebElement, timeout: number = 10000): Promise<this> {
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return this;
  }
  
  protected async waitForElementToDisappear(element: WebElement, timeout: number = 10000): Promise<this> {
    await this.driver.wait(until.stalenessOf(element), timeout);
    return this;
  }
  
  protected async scrollToElement(element: WebElement): Promise<this> {
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    return this;
  }
  
  protected async selectOption(element: WebElement, option: string): Promise<this> {
    const select = require('selenium-webdriver/lib/input').Select;
    const selectElement = new select(element);
    await selectElement.selectByVisibleText(option);
    return this;
  }
  
  protected async checkCheckbox(element: WebElement): Promise<this> {
    if (!(await element.isSelected())) {
      await element.click();
    }
    return this;
  }
  
  protected async uncheckCheckbox(element: WebElement): Promise<this> {
    if (await element.isSelected()) {
      await element.click();
    }
    return this;
  }
  
  protected async assertUrlContains(path: string): Promise<this> {
    const currentUrl = await this.driver.getCurrentUrl();
    expect(currentUrl).to.contain(path);
    return this;
  }
  
  protected async assertPageTitle(title: string): Promise<this> {
    const currentTitle = await this.driver.getTitle();
    expect(currentTitle).to.equal(title);
    return this;
  }
  
  // Element management methods
  protected getElement(selector: string): WebElement {
    return this.driver.findElement(By.css(selector));
  }
  
  protected getElementById(id: string): WebElement {
    return this.driver.findElement(By.id(id));
  }
  
  protected getElementByText(text: string): WebElement {
    return this.driver.findElement(By.xpath(`//*[contains(text(), '${text}')]`));
  }
  
  protected getElementByXPath(xpath: string): WebElement {
    return this.driver.findElement(By.xpath(xpath));
  }
  
  protected getElementByClassName(className: string): WebElement {
    return this.driver.findElement(By.className(className));
  }
  
  protected getElementByName(name: string): WebElement {
    return this.driver.findElement(By.name(name));
  }
  
  protected getElementByTagName(tagName: string): WebElement {
    return this.driver.findElement(By.tagName(tagName));
  }
  
  // Wait utilities
  protected async waitForElementLocated(selector: string, timeout: number = 10000): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
  }
  
  protected async waitForElementVisible(selector: string, timeout: number = 10000): Promise<WebElement> {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }
  
  protected async waitForElementClickable(selector: string, timeout: number = 10000): Promise<WebElement> {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }
}
