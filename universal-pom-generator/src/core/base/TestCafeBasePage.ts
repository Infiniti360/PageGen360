import { BasePage } from './BasePage';
import { Selector, t } from 'testcafe';

/**
 * TestCafe-specific base class with method chaining support
 */
export class TestCafeBasePage extends BasePage {
  protected selectors: Record<string, Selector> = {};
  
  constructor() {
    super();
  }
  
  // Navigation methods
  async navigateToPage(url: string): Promise<void> {
    this.pageUrl = url;
    await t.navigateTo(url);
  }
  
  async waitForPageLoad(): Promise<void> {
    await t.expect(Selector('body').exists).ok();
    await t.wait(2000); // Additional wait for dynamic content
  }
  
  // Utility methods
  async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || this.generateScreenshotFilename('testcafe');
    await t.takeScreenshot(screenshotPath);
    return screenshotPath;
  }
  
  async getPageTitle(): Promise<string> {
    return await t.eval(() => document.title);
  }
  
  async getPageUrl(): Promise<string> {
    return await t.eval(() => window.location.href);
  }
  
  // Validation methods
  async validatePageStructure(): Promise<void> {
    await t.expect(Selector('body').exists).ok();
    await t.expect(Selector('main, .main, #main').exists).ok();
  }
  
  async validateAccessibility(): Promise<void> {
    // Basic accessibility checks for TestCafe
    const buttonCount = await Selector('button').count;
    
    for (let i = 0; i < buttonCount; i++) {
      const button = Selector('button').nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent;
      const hasImgAlt = await button.find('img').getAttribute('alt');
      
      if (!hasAriaLabel && !hasText?.trim() && !hasImgAlt) {
        throw new Error(`Button at index ${i} lacks accessibility attributes`);
      }
    }
  }
  
  async validateResponsiveDesign(): Promise<void> {
    // Basic responsive checks for TestCafe
    await t.expect(Selector('body').exists).ok();
    
    // Test different viewport sizes
    await t.resizeWindow(1920, 1080);
    await t.expect(Selector('body').exists).ok();
    
    await t.resizeWindow(768, 1024);
    await t.expect(Selector('body').exists).ok();
  }
  
  // Protected helper methods for chaining
  protected async assertElementVisible(selector: Selector): Promise<this> {
    await t.expect(selector.visible).ok();
    return this;
  }
  
  protected async assertElementText(selector: Selector, expectedText: string): Promise<this> {
    await t.expect(selector.textContent).contains(expectedText);
    return this;
  }
  
  protected async assertElementExists(selector: Selector): Promise<this> {
    await t.expect(selector.exists).ok();
    return this;
  }
  
  protected async assertElementNotVisible(selector: Selector): Promise<this> {
    await t.expect(selector.visible).notOk();
    return this;
  }
  
  protected async clickElement(selector: Selector): Promise<this> {
    await t.click(selector);
    return this;
  }
  
  protected async typeText(selector: Selector, text: string): Promise<this> {
    await t.typeText(selector, text, { replace: true });
    return this;
  }
  
  protected async clearText(selector: Selector): Promise<this> {
    await t.selectText(selector);
    await t.pressKey('delete');
    return this;
  }
  
  protected async hoverElement(selector: Selector): Promise<this> {
    await t.hover(selector);
    return this;
  }
  
  protected async waitForElement(selector: Selector, timeout: number = 10000): Promise<this> {
    await t.expect(selector.visible).ok({ timeout });
    return this;
  }
  
  protected async waitForElementToDisappear(selector: Selector, timeout: number = 10000): Promise<this> {
    await t.expect(selector.exists).notOk({ timeout });
    return this;
  }
  
  protected async scrollToElement(selector: Selector): Promise<this> {
    await t.scrollTo(selector);
    return this;
  }
  
  protected async selectOption(selector: Selector, option: string): Promise<this> {
    await t.click(selector);
    await t.click(Selector('option').withText(option));
    return this;
  }
  
  protected async checkCheckbox(selector: Selector): Promise<this> {
    await t.expect(selector.checked).notOk();
    await t.click(selector);
    return this;
  }
  
  protected async uncheckCheckbox(selector: Selector): Promise<this> {
    await t.expect(selector.checked).ok();
    await t.click(selector);
    return this;
  }
  
  protected async assertUrlContains(path: string): Promise<this> {
    const currentUrl = await t.eval(() => window.location.href);
    if (!currentUrl.includes(path)) {
      throw new Error(`Expected URL to contain '${path}', but got '${currentUrl}'`);
    }
    return this;
  }
  
  protected async assertPageTitle(title: string): Promise<this> {
    const currentTitle = await t.eval(() => document.title);
    if (currentTitle !== title) {
      throw new Error(`Expected page title to be '${title}', but got '${currentTitle}'`);
    }
    return this;
  }
  
  // Selector management methods
  protected getSelector(selector: string): Selector {
    return Selector(selector);
  }
  
  protected getSelectorById(id: string): Selector {
    return Selector(`#${id}`);
  }
  
  protected getSelectorByText(text: string): Selector {
    return Selector(text);
  }
  
  protected getSelectorByXPath(xpath: string): Selector {
    return Selector(() => document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
  }
  
  protected getSelectorByClassName(className: string): Selector {
    return Selector(`.${className}`);
  }
  
  protected getSelectorByName(name: string): Selector {
    return Selector(`[name="${name}"]`);
  }
  
  protected getSelectorByTagName(tagName: string): Selector {
    return Selector(tagName);
  }
  
  // Wait utilities
  protected async waitForElementLocated(selector: string, timeout: number = 10000): Promise<Selector> {
    const sel = Selector(selector);
    await t.expect(sel.exists).ok({ timeout });
    return sel;
  }
  
  protected async waitForElementVisible(selector: string, timeout: number = 10000): Promise<Selector> {
    const sel = Selector(selector);
    await t.expect(sel.visible).ok({ timeout });
    return sel;
  }
  
  protected async waitForElementHidden(selector: string, timeout: number = 10000): Promise<void> {
    const sel = Selector(selector);
    await t.expect(sel.visible).notOk({ timeout });
  }
  
  // TestCafe specific methods
  protected async setTestSpeed(speed: number): Promise<this> {
    await t.setTestSpeed(speed);
    return this;
  }
  
  protected async setPageLoadTimeout(timeout: number): Promise<this> {
    await t.setPageLoadTimeout(timeout);
    return this;
  }
  
  protected async maximizeWindow(): Promise<this> {
    await t.maximizeWindow();
    return this;
  }
  
  protected async resizeWindow(width: number, height: number): Promise<this> {
    await t.resizeWindow(width, height);
    return this;
  }
}
