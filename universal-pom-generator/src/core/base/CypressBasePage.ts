import { BasePage } from './BasePage';

/**
 * Cypress-specific base class with method chaining support
 */
export class CypressBasePage extends BasePage {
  protected selectors: Record<string, string> = {};
  
  constructor() {
    super();
  }
  
  // Navigation methods
  navigateToPage(url: string): void {
    this.pageUrl = url;
    cy.visit(url);
  }
  
  waitForPageLoad(): void {
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', '#loading');
  }
  
  // Utility methods
  takeScreenshot(filename?: string): string {
    const screenshotPath = filename || this.generateScreenshotFilename('cypress');
    cy.screenshot(screenshotPath);
    return screenshotPath;
  }
  
  getPageTitle(): string {
    let title = '';
    cy.title().then((pageTitle) => {
      title = pageTitle;
    });
    return title;
  }
  
  getPageUrl(): string {
    let url = '';
    cy.url().then((pageUrl) => {
      url = pageUrl;
    });
    return url;
  }
  
  // Validation methods
  validatePageStructure(): void {
    cy.get('body').should('be.visible');
    cy.get('main, .main, #main').should('exist');
  }
  
  validateAccessibility(): void {
    // Basic accessibility checks for Cypress
    cy.get('button').each(($button) => {
      const hasAriaLabel = $button.attr('aria-label');
      const hasText = $button.text().trim();
      const hasImgAlt = $button.find('img').length > 0 && $button.find('img').attr('alt');
      
      expect(hasAriaLabel || hasText || hasImgAlt).to.be.true;
    });
  }
  
  validateResponsiveDesign(): void {
    // Basic responsive checks for Cypress
    cy.get('body').should('be.visible');
    cy.viewport('macbook-13');
    cy.get('body').should('be.visible');
  }
  
  // Protected helper methods for chaining
  protected assertElementVisible(selector: string): this {
    cy.get(selector).should('be.visible');
    return this;
  }
  
  protected assertElementText(selector: string, expectedText: string): this {
    cy.get(selector).should('contain.text', expectedText);
    return this;
  }
  
  protected assertElementExists(selector: string): this {
    cy.get(selector).should('exist');
    return this;
  }
  
  protected assertElementNotVisible(selector: string): this {
    cy.get(selector).should('not.be.visible');
    return this;
  }
  
  protected clickElement(selector: string): this {
    cy.get(selector).click();
    return this;
  }
  
  protected typeText(selector: string, text: string): this {
    cy.get(selector).type(text);
    return this;
  }
  
  protected clearText(selector: string): this {
    cy.get(selector).clear();
    return this;
  }
  
  protected hoverElement(selector: string): this {
    cy.get(selector).trigger('mouseover');
    return this;
  }
  
  protected waitForElement(selector: string, timeout: number = 10000): this {
    cy.get(selector, { timeout }).should('be.visible');
    return this;
  }
  
  protected waitForElementToDisappear(selector: string, timeout: number = 10000): this {
    cy.get(selector, { timeout }).should('not.exist');
    return this;
  }
  
  protected scrollToElement(selector: string): this {
    cy.get(selector).scrollIntoView();
    return this;
  }
  
  protected selectOption(selector: string, option: string): this {
    cy.get(selector).select(option);
    return this;
  }
  
  protected checkCheckbox(selector: string): this {
    cy.get(selector).check();
    return this;
  }
  
  protected uncheckCheckbox(selector: string): this {
    cy.get(selector).uncheck();
    return this;
  }
  
  protected assertUrlContains(path: string): this {
    cy.url().should('include', path);
    return this;
  }
  
  protected assertPageTitle(title: string): this {
    cy.title().should('eq', title);
    return this;
  }
}
