import { MethodTemplate } from '../../types';

/**
 * Method templates for different frameworks and automation tools
 */
export class MethodTemplates {
  
  // Getter method templates
  static readonly getterTemplates: MethodTemplate = {
    cypress: `
  get${elementName}() {
    return cy.get('${selector}');
  }`,
    
    playwright: `
  get ${elementName}Locator(): Locator {
    return this.page.locator('${selector}');
  }`,
    
    selenium: `
  get ${elementName}Element(): WebElement {
    return this.driver.findElement(By.css('${selector}'));
  }`,
    
    puppeteer: `
  async get${elementName}Element(): Promise<ElementHandle<Element>> {
    return await this.page.$('${selector}');
  }`,
    
    python: `
    @property
    def ${elementName}_element(self):
        return self.driver.find_element(By.CSS_SELECTOR, '${selector}')`,
    
    java: `
    public WebElement get${elementName}Element() {
        return driver.findElement(By.cssSelector("${selector}"));
    }`,
    
    csharp: `
    public IWebElement Get${elementName}Element()
    {
        return driver.FindElement(By.CssSelector("${selector}"));
    }`
  };

  // Assertion method templates
  static readonly assertionTemplates: MethodTemplate = {
    cypress: `
  assert${elementName}Visible(): this {
    cy.get('${selector}').should('be.visible');
    return this;
  }`,
    
    playwright: `
  async assert${elementName}Visible(): Promise<this> {
    await expect(this.${elementName}Locator).toBeVisible();
    return this;
  }`,
    
    selenium: `
  assert${elementName}Visible(): this {
    expect(this.${elementName}Element.isDisplayed()).toBe(true);
    return this;
  }`,
    
    puppeteer: `
  async assert${elementName}Visible(): Promise<this> {
    const element = await this.get${elementName}Element();
    await expect(element).to.exist;
    return this;
  }`,
    
    python: `
    def assert_${elementName}_visible(self):
        assert self.${elementName}_element.is_displayed()
        return self`,
    
    java: `
    public ${className} assert${elementName}Visible() {
        assert ${elementName}Element.isDisplayed();
        return this;
    }`,
    
    csharp: `
    public ${className} Assert${elementName}Visible()
    {
        Assert.IsTrue(Get${elementName}Element().Displayed);
        return this;
    }`
  };

  // Action method templates
  static readonly actionTemplates: MethodTemplate = {
    cypress: `
  click${elementName}(): this {
    cy.get('${selector}').click();
    return this;
  }`,
    
    playwright: `
  async click${elementName}(): Promise<this> {
    await this.${elementName}Locator.click();
    return this;
  }`,
    
    selenium: `
  click${elementName}(): this {
    this.${elementName}Element.click();
    return this;
  }`,
    
    puppeteer: `
  async click${elementName}(): Promise<this> {
    const element = await this.get${elementName}Element();
    await element.click();
    return this;
  }`,
    
    python: `
    def click_${elementName}(self):
        self.${elementName}_element.click()
        return self`,
    
    java: `
    public ${className} click${elementName}() {
        ${elementName}Element.click();
        return this;
    }`,
    
    csharp: `
    public ${className} Click${elementName}()
    {
        Get${elementName}Element().Click();
        return this;
    }`
  };

  // Text assertion templates
  static readonly textAssertionTemplates: MethodTemplate = {
    cypress: `
  assert${elementName}Text(expectedText: string): this {
    cy.get('${selector}').should('contain.text', expectedText);
    return this;
  }`,
    
    playwright: `
  async assert${elementName}Text(expectedText: string): Promise<this> {
    await expect(this.${elementName}Locator).toHaveText(expectedText);
    return this;
  }`,
    
    selenium: `
  assert${elementName}Text(expectedText: string): this {
    expect(this.${elementName}Element.getText()).toContain(expectedText);
    return this;
  }`,
    
    puppeteer: `
  async assert${elementName}Text(expectedText: string): Promise<this> {
    const element = await this.get${elementName}Element();
    const actualText = await element.evaluate(el => el.textContent);
    expect(actualText).to.contain(expectedText);
    return this;
  }`,
    
    python: `
    def assert_${elementName}_text(self, expected_text: str):
        actual_text = self.${elementName}_element.text
        assert expected_text in actual_text
        return self`,
    
    java: `
    public ${className} assert${elementName}Text(String expectedText) {
        assert ${elementName}Element.getText().contains(expectedText);
        return this;
    }`,
    
    csharp: `
    public ${className} Assert${elementName}Text(string expectedText)
    {
        Assert.IsTrue(Get${elementName}Element().Text.Contains(expectedText));
        return this;
    }`
  };

  // Input action templates
  static readonly inputActionTemplates: MethodTemplate = {
    cypress: `
  type${elementName}(text: string): this {
    cy.get('${selector}').type(text);
    return this;
  }`,
    
    playwright: `
  async type${elementName}(text: string): Promise<this> {
    await this.${elementName}Locator.fill(text);
    return this;
  }`,
    
    selenium: `
  type${elementName}(text: string): this {
    this.${elementName}Element.clear();
    this.${elementName}Element.sendKeys(text);
    return this;
  }`,
    
    puppeteer: `
  async type${elementName}(text: string): Promise<this> {
    const element = await this.get${elementName}Element();
    await element.evaluate(el => (el as HTMLInputElement).value = '');
    await element.type(text);
    return this;
  }`,
    
    python: `
    def type_${elementName}(self, text: str):
        self.${elementName}_element.clear()
        self.${elementName}_element.send_keys(text)
        return self`,
    
    java: `
    public ${className} type${elementName}(String text) {
        ${elementName}Element.clear();
        ${elementName}Element.sendKeys(text);
        return this;
    }`,
    
    csharp: `
    public ${className} Type${elementName}(string text)
    {
        Get${elementName}Element().Clear();
        Get${elementName}Element().SendKeys(text);
        return this;
    }`
  };

  // Utility method templates
  static readonly utilityTemplates: MethodTemplate = {
    cypress: `
  waitForPageLoad(): this {
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', '#loading');
    return this;
  }`,
    
    playwright: `
  async waitForPageLoad(): Promise<this> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    return this;
  }`,
    
    selenium: `
  waitForPageLoad(): this {
    this.driver.wait(until.titleContains(''), 10000);
    this.driver.wait(until.elementLocated(By.css('body')), 10000);
    return this;
  }`,
    
    puppeteer: `
  async waitForPageLoad(): Promise<this> {
    await this.page.waitForSelector('body');
    await this.page.waitForTimeout(2000);
    return this;
  }`,
    
    python: `
    def wait_for_page_load(self):
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        return self`,
    
    java: `
    public ${className} waitForPageLoad() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.titleContains(""));
        return this;
    }`,
    
    csharp: `
    public ${className} WaitForPageLoad()
    {
        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        wait.Until(d => d.Title.Length > 0);
        return this;
    }`
  };

  // Validation method templates
  static readonly validationTemplates: MethodTemplate = {
    cypress: `
  validatePageStructure(): this {
    cy.get('body').should('be.visible');
    cy.get('main, .main, #main').should('exist');
    return this;
  }`,
    
    playwright: `
  async validatePageStructure(): Promise<this> {
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.page.locator('main, .main, #main')).toHaveCount(1);
    return this;
  }`,
    
    selenium: `
  validatePageStructure(): this {
    WebElement body = this.driver.findElement(By.cssSelector('body'));
    expect(body.isDisplayed()).toBe(true);
    return this;
  }`,
    
    puppeteer: `
  async validatePageStructure(): Promise<this> {
    const body = await this.page.$('body');
    expect(body).to.exist;
    return this;
  }`,
    
    python: `
    def validate_page_structure(self):
        body = self.driver.find_element(By.TAG_NAME, "body")
        assert body.is_displayed()
        return self`,
    
    java: `
    public ${className} validatePageStructure() {
        WebElement body = driver.findElement(By.tagName("body"));
        assert body.isDisplayed();
        return this;
    }`,
    
    csharp: `
    public ${className} ValidatePageStructure()
    {
        var body = driver.FindElement(By.TagName("body"));
        Assert.IsTrue(body.Displayed);
        return this;
    }`
  };

  /**
   * Get template for specific method type and framework
   */
  static getTemplate(
    methodType: 'getter' | 'assertion' | 'action' | 'textAssertion' | 'inputAction' | 'utility' | 'validation',
    framework: string
  ): string {
    switch (methodType) {
      case 'getter':
        return this.getterTemplates[framework as keyof MethodTemplate] || this.getterTemplates.cypress;
      case 'assertion':
        return this.assertionTemplates[framework as keyof MethodTemplate] || this.assertionTemplates.cypress;
      case 'action':
        return this.actionTemplates[framework as keyof MethodTemplate] || this.actionTemplates.cypress;
      case 'textAssertion':
        return this.textAssertionTemplates[framework as keyof MethodTemplate] || this.textAssertionTemplates.cypress;
      case 'inputAction':
        return this.inputActionTemplates[framework as keyof MethodTemplate] || this.inputActionTemplates.cypress;
      case 'utility':
        return this.utilityTemplates[framework as keyof MethodTemplate] || this.utilityTemplates.cypress;
      case 'validation':
        return this.validationTemplates[framework as keyof MethodTemplate] || this.validationTemplates.cypress;
      default:
        return this.getterTemplates.cypress;
    }
  }
}
