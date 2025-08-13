#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const path = require('path');
const { UniversalPOMGenerator } = require(path.join(__dirname, '../../dist/index'));
const fs = require('fs');

// 🌐 Enhanced Universal POM Generator CLI
// Usage: node cli-universal-enhanced.js [options]
// This tool generates POMs with enhanced naming conventions and AI enhancement

function showHelp() {
  console.log(`
🌐 Enhanced Universal POM Generator CLI

Generate Page Object Models for any website with enhanced naming conventions and AI enhancement.

Usage: node cli-universal-enhanced.js [options]

Options:
  --url <url>                    Target URL (required)
  --login-url <url>              Login URL (if authentication required)
  --username <email>             Username/Email (if authentication required)
  --password <password>          Password (if authentication required)
  --framework <framework>        Framework: playwright, selenium, cypress, puppeteer, testcafe (default: playwright)
  --language <language>          Language: typescript, javascript, python, java, csharp (default: typescript)
  --browser <browser>            Browser: chrome, firefox, safari, edge (default: chrome)
  --headless                     Run in headless mode
  --no-tests                     Skip test generation
  --no-interfaces                Skip interface generation
  --no-performance               Skip performance tests
  --output <directory>           Output directory (default: ./generated-pom-enhanced)
  --api-key <key>                OpenAI API Key (or set OPENAI_API_KEY env var)
  --project-name <name>          Custom project name (default: auto-generated from URL)
  --help                         Show this help message

Examples:
  # Basic usage for any website
  node cli-universal-enhanced.js --url https://example.com

  # TOCA Football example with enhanced naming
  node cli-universal-enhanced.js --url https://staging.my.tocafootball.com/home \
    --login-url https://staging.my.tocafootball.com/auth/signin/email \
    --username forkrrish@gmail.com --password Toca123!

  # E-commerce example
  node cli-universal-enhanced.js --url https://shop.example.com \
    --login-url https://shop.example.com/login \
    --username customer@example.com --password mypass

  # Public website (no login)
  node cli-universal-enhanced.js --url https://news.example.com --framework cypress

  # Different framework and language
  node cli-universal-enhanced.js --url https://app.example.com \
    --framework selenium --language java

  # Headless mode with custom output
  node cli-universal-enhanced.js --url https://dashboard.example.com \
    --headless --output ./my-enhanced-pom --project-name DashboardApp

  # With OpenAI API key
  node cli-universal-enhanced.js --url https://example.com \
    --api-key sk-your-openai-api-key-here
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: null, // Required
    loginUrl: null,
    username: null,
    password: null,
    framework: 'playwright',
    language: 'typescript',
    browser: 'chrome',
    headless: false,
    generateTests: true,
    generateInterfaces: true,
    includePerformanceTests: true,
    output: './generated-pom-enhanced',
    apiKey: process.env.OPENAI_API_KEY,
    projectName: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
        
      case '--url':
        options.url = args[++i];
        break;
        
      case '--login-url':
        options.loginUrl = args[++i];
        break;
        
      case '--username':
        options.username = args[++i];
        break;
        
      case '--password':
        options.password = args[++i];
        break;
        
      case '--framework':
        options.framework = args[++i];
        break;
        
      case '--language':
        options.language = args[++i];
        break;
        
      case '--browser':
        options.browser = args[++i];
        break;
        
      case '--headless':
        options.headless = true;
        break;
        
      case '--no-tests':
        options.generateTests = false;
        break;
        
      case '--no-interfaces':
        options.generateInterfaces = false;
        break;
        
      case '--no-performance':
        options.includePerformanceTests = false;
        break;
        
      case '--output':
        options.output = args[++i];
        break;
        
      case '--api-key':
        options.apiKey = args[++i];
        break;
        
      case '--project-name':
        options.projectName = args[++i];
        break;
        
      default:
        console.log(`⚠️  Unknown option: ${arg}`);
        console.log('Use --help for usage information');
        process.exit(1);
    }
  }

  // Validate required URL
  if (!options.url) {
    console.log('❌ Target URL is required!');
    console.log('Use --url <url> to specify the target website');
    console.log('Example: node cli-universal-enhanced.js --url https://example.com');
    process.exit(1);
  }

  return options;
}

function generateProjectName(url, customName) {
  if (customName) {
    return customName;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '');
    const pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '');
    
    let projectName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    if (pathname) {
      projectName += pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
    
    return projectName + 'Page';
  } catch (error) {
    return 'GeneratedPage';
  }
}

function generateLoginConfig(options) {
  if (!options.loginUrl) {
    return null;
  }

  return {
    loginUrl: options.loginUrl,
    type: 'basic',
    credentials: {
      username: options.username,
      password: options.password
    },
    selectors: {
      usernameField: "input[type='email'], input[type='text'], input[name='username'], input[name='email']",
      passwordField: "input[type='password']",
      loginButton: "button[type='submit'], input[type='submit'], button:contains('Login'), button:contains('Sign In')"
    }
  };
}

function generateEnhancedPOMCode(result, projectName) {
  const framework = result.pom.framework || 'playwright';
  const language = result.pom.language || 'typescript';
  const className = projectName;

  // Use modular approach - select appropriate generator
  if (language === 'java') {
    return generateJavaPOMCode(result, className, framework);
  } else if (language === 'python') {
    return generatePythonPOMCode(result, className, framework);
  } else if (language === 'csharp') {
    return generateCSharpPOMCode(result, className, framework);
  } else {
    // Default to TypeScript/JavaScript
    return generateTypeScriptPOMCode(result, className, framework);
  }
}

// Java POM Generator
function generateJavaPOMCode(result, className, framework) {
  if (framework === 'selenium') {
    return `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

/**
 * ${className} - Enhanced Page Object Model
 * 
 * This class provides a clean, semantic interface for interacting with
 * the ${className.replace('Page', '')} page elements and functionality.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2024-01-01
 */
public class ${className} {
  private WebDriver driver;
  
  public ${className}(WebDriver driver) {
    this.driver = driver;
  }

  /**
   * Navigate to the page
   */
  public void navigateToPage() {
    this.driver.get("${result.pom.url}");
    this.waitForPageLoad();
  }

  /**
   * Wait for the page to fully load
   */
  public void waitForPageLoad() {
    WebDriverWait wait = new WebDriverWait(this.driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("body")));
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
  }

  /**
   * Verify that the page is loaded and accessible
   */
  public void verifyPageIsLoaded() {
    String title = this.driver.getTitle();
    if (title == null || title.isEmpty()) {
        throw new RuntimeException("Page title is empty");
    }
    this.driver.findElement(By.cssSelector("body"));
  }

  /**
   * Get page information
   */
  public PageInfo getPageInfo() {
    String title = this.driver.getTitle();
    String url = this.driver.getCurrentUrl();
    String headerGreeting = this.getHeaderGreeting();
    String profilePictureUrl = this.getProfilePictureUrl();

    return new PageInfo(title, url, headerGreeting, profilePictureUrl);
  }

  /**
   * Get header greeting text
   */
  public String getHeaderGreeting() {
    try {
        WebElement element = this.driver.findElement(By.cssSelector("[data-testid='header-greeting'], .header-greeting, h1, h2"));
        return element.getText();
    } catch (Exception e) {
        return "";
    }
  }

  /**
   * Get profile picture URL
   */
  public String getProfilePictureUrl() {
    try {
        WebElement element = this.driver.findElement(By.cssSelector("[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']"));
        return element.getAttribute("src");
    } catch (Exception e) {
        return "";
    }
  }

  /**
   * Verify player card is displayed
   */
  public void verifyPlayerCardIsDisplayed() {
    WebElement element = this.driver.findElement(By.cssSelector("[data-testid='player-card'], .player-card, .card"));
    WebDriverWait wait = new WebDriverWait(this.driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.visibilityOf(element));
  }

  /**
   * Click on profile picture button
   */
  public void clickProfilePictureButton() {
    WebElement element = this.driver.findElement(By.cssSelector("[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']"));
    element.click();
  }

  /**
   * Get page title
   */
  public String getPageTitle() {
    return this.driver.getTitle();
  }

  /**
   * Take a screenshot of the page
   */
  public String takeScreenshot(String filename) {
    String screenshotPath = filename != null ? filename : "${className.toLowerCase()}-" + System.currentTimeMillis() + ".png";
    // Selenium doesn't have built-in screenshot, would need external tool
    return screenshotPath;
  }
}

/**
 * Page Information Data Class
 */
class PageInfo {
  private String title;
  private String url;
  private String headerGreeting;
  private String profilePictureUrl;

  public PageInfo(String title, String url, String headerGreeting, String profilePictureUrl) {
    this.title = title;
    this.url = url;
    this.headerGreeting = headerGreeting;
    this.profilePictureUrl = profilePictureUrl;
  }

  // Getters
  public String getTitle() { return title; }
  public String getUrl() { return url; }
  public String getHeaderGreeting() { return headerGreeting; }
  public String getProfilePictureUrl() { return profilePictureUrl; }
}`;
  } else {
    return `// Java support for ${framework} is not yet implemented
// Please use Selenium framework for Java support`;
  }
}

// Python POM Generator
function generatePythonPOMCode(result, className, framework) {
  if (framework === 'selenium') {
    return `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class ${className}:
    def __init__(self, driver):
        self.driver = driver

    def navigate_to_page(self):
        self.driver.get("${result.pom.url}")
        self.wait_for_page_load()

    def wait_for_page_load(self):
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body")))
        time.sleep(2)

    def verify_page_is_loaded(self):
        title = self.driver.title
        if not title:
            raise Exception("Page title is empty")
        self.driver.find_element(By.CSS_SELECTOR, "body")

    def get_page_info(self):
        title = self.driver.title
        url = self.driver.current_url
        header_greeting = self.get_header_greeting()
        profile_picture_url = self.get_profile_picture_url()
        return PageInfo(title, url, header_greeting, profile_picture_url)

    def get_header_greeting(self):
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='header-greeting'], .header-greeting, h1, h2")
            return element.text
        except:
            return ""

    def get_profile_picture_url(self):
        try:
            element = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']")
            return element.get_attribute("src")
        except:
            return ""

    def verify_player_card_is_displayed(self):
        element = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='player-card'], .player-card, .card")
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.visibility_of(element))

    def click_profile_picture_button(self):
        element = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']")
        element.click()

    def get_page_title(self):
        return self.driver.title

    def take_screenshot(self, filename=None):
        screenshot_path = filename or f"${className.toLowerCase()}-{int(time.time() * 1000)}.png"
        # Selenium doesn't have built-in screenshot, would need external tool
        return screenshot_path

class PageInfo:
    def __init__(self, title, url, header_greeting, profile_picture_url):
        self.title = title
        self.url = url
        self.header_greeting = header_greeting
        self.profile_picture_url = profile_picture_url`;
  } else {
    return `# Python support for ${framework} is not yet implemented
# Please use Selenium framework for Python support`;
  }
}

// C# POM Generator
function generateCSharpPOMCode(result, className, framework) {
  if (framework === 'selenium') {
    return `using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Threading.Tasks;

namespace TestAutomation
{
    public class ${className}
    {
        private IWebDriver driver;

        public ${className}(IWebDriver driver)
        {
            this.driver = driver;
        }

        public async Task NavigateToPageAsync()
        {
            this.driver.Navigate().GoToUrl("${result.pom.url}");
            await this.WaitForPageLoadAsync();
        }

        public async Task WaitForPageLoadAsync()
        {
            var wait = new WebDriverWait(this.driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementToBeClickable(By.CssSelector("body")));
            await Task.Delay(2000);
        }

        public void VerifyPageIsLoaded()
        {
            var title = this.driver.Title;
            if (string.IsNullOrEmpty(title))
            {
                throw new Exception("Page title is empty");
            }
            this.driver.FindElement(By.CssSelector("body"));
        }

        public PageInfo GetPageInfo()
        {
            var title = this.driver.Title;
            var url = this.driver.Url;
            var headerGreeting = this.GetHeaderGreeting();
            var profilePictureUrl = this.GetProfilePictureUrl();

            return new PageInfo(title, url, headerGreeting, profilePictureUrl);
        }

        public string GetHeaderGreeting()
        {
            try
            {
                var element = this.driver.FindElement(By.CssSelector("[data-testid='header-greeting'], .header-greeting, h1, h2"));
                return element.Text;
            }
            catch
            {
                return "";
            }
        }

        public string GetProfilePictureUrl()
        {
            try
            {
                var element = this.driver.FindElement(By.CssSelector("[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']"));
                return element.GetAttribute("src");
            }
            catch
            {
                return "";
            }
        }

        public void VerifyPlayerCardIsDisplayed()
        {
            var element = this.driver.FindElement(By.CssSelector("[data-testid='player-card'], .player-card, .card"));
            var wait = new WebDriverWait(this.driver, TimeSpan.FromSeconds(10));
            wait.Until(ExpectedConditions.ElementIsVisible(element));
        }

        public void ClickProfilePictureButton()
        {
            var element = this.driver.FindElement(By.CssSelector("[data-testid='profile-picture'], .profile-picture, button[aria-label*='profile']"));
            element.Click();
        }

        public string GetPageTitle()
        {
            return this.driver.Title;
        }

        public string TakeScreenshot(string filename = null)
        {
            var screenshotPath = filename ?? $"${className.toLowerCase()}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.png";
            // Selenium doesn't have built-in screenshot, would need external tool
            return screenshotPath;
        }
    }

    public class PageInfo
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public string HeaderGreeting { get; set; }
        public string ProfilePictureUrl { get; set; }

        public PageInfo(string title, string url, string headerGreeting, string profilePictureUrl)
        {
            Title = title;
            Url = url;
            HeaderGreeting = headerGreeting;
            ProfilePictureUrl = profilePictureUrl;
        }
    }
}`;
  } else {
    return `// C# support for ${framework} is not yet implemented
// Please use Selenium framework for C# support`;
  }
}

// TypeScript/JavaScript POM Generator
function generateTypeScriptPOMCode(result, className, framework) {
  // Framework-specific imports
  let imports = '';
  if (framework === 'cypress') {
    imports = `/// <reference types="cypress" />
export {}; // Make this a module`;
  } else if (framework === 'playwright') {
    imports = `import { Page, Locator, expect } from '@playwright/test'`;
  } else if (framework === 'selenium') {
    imports = `import { WebDriver, WebElement, By, until } from 'selenium-webdriver'`;
  } else if (framework === 'puppeteer') {
    imports = `import { Page, ElementHandle } from 'puppeteer'`;
  } else if (framework === 'testcafe') {
    imports = `import { Selector } from 'testcafe'`;
  } else {
    imports = `// Framework: ${framework}`;
  }

  return `${imports};

/**
 * ${className} - Enhanced Page Object Model
 * 
 * This class provides a clean, semantic interface for interacting with
 * the ${className.replace('Page', '')} page elements and functionality.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2024-01-01
 */
export class ${className} {
  ${framework === 'cypress' ? '' : framework === 'selenium' ? 'private driver: WebDriver;\n  ' : 'private page: Page;\n  '}
  
  // Page elements with semantic naming
  ${framework === 'cypress' ? 
    `// Cypress Page Object - elements are accessed via cy.get() methods
  // No private properties needed` : framework === 'selenium' ?
    `// Selenium Page Object - elements are accessed via driver.findElement() methods
  // No private properties needed` : framework === 'testcafe' ?
    `// TestCafe Page Object - elements are accessed via Selector() methods
  // No private properties needed` :
    `private readonly headerGreeting: Locator;
  private readonly profilePictureButton: Locator;
  private readonly profilePictureImage: Locator;
  private readonly playerCard: Locator;
  private readonly playerAge: Locator;
  private readonly playerReps: Locator;
  private readonly jerseyBackName: Locator;
  private readonly jerseyBackNumber: Locator;
  private readonly upcomingSessionsSection: Locator;
  private readonly leaderboardsLink: Locator;
  private readonly mySessionsLink: Locator;`
  }

  constructor(${framework === 'cypress' ? '' : framework === 'selenium' ? 'driver: WebDriver' : 'page: Page'}) {
    ${framework === 'cypress' ? 
      '// Cypress Page Object - no constructor needed' : framework === 'selenium' ?
      'this.driver = driver;\n    \n    // Selenium Page Object - no locator initialization needed' : framework === 'testcafe' ?
      '// TestCafe Page Object - no constructor needed' :
      'this.page = page;\n    \n    // Initialize locators with semantic names\n    this.headerGreeting = page.locator(\'[data-testid="header-greeting"], .header-greeting, h1, h2\');\n    this.profilePictureButton = page.locator(\'[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]\');\n    this.profilePictureImage = page.locator(\'[data-testid="profile-image"], .profile-image, img[alt*="profile"]\');\n    this.playerCard = page.locator(\'[data-testid="player-card"], .player-card, .card\');\n    this.playerAge = page.locator(\'[data-testid="player-age"], .player-age, .age\');\n    this.playerReps = page.locator(\'[data-testid="player-reps"], .player-reps, .reps\');\n    this.jerseyBackName = page.locator(\'[data-testid="jersey-name"], .jersey-name, .name\');\n    this.jerseyBackNumber = page.locator(\'[data-testid="jersey-number"], .jersey-number, .number\');\n    this.upcomingSessionsSection = page.locator(\'[data-testid="upcoming-sessions"], .upcoming-sessions, section\');\n    this.leaderboardsLink = page.locator(\'[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]\');\n    this.mySessionsLink = page.locator(\'[data-testid="my-sessions"], .my-sessions, a[href*="session"]\');'
    }
  }

  /**
   * Navigate to the page
   */
  ${framework === 'cypress' ? 
    `visit(): Cypress.Chainable<null> {
    return cy.visit('${result.pom.url}');
  }` :
    `async navigateToPage(): Promise<void> {
    await this.${framework === 'selenium' ? 'driver.get' : 'page.goto'}('${result.pom.url}');
    await this.waitForPageLoad();
  }`
  }

  /**
   * Wait for the page to fully load
   */
  ${framework === 'cypress' ? 
    `waitForPageLoad(): Cypress.Chainable<null> {
    return cy.wait(2000); // Wait for dynamic content
  }` : framework === 'selenium' ?
    `async waitForPageLoad(): Promise<void> {
    await this.driver.wait(until.elementLocated(By.css('body')));
    await new Promise(resolve => setTimeout(resolve, 2000));
  }` :
    `async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content
  }`
  }

  /**
   * Verify that the page is loaded and accessible
   */
  ${framework === 'cypress' ? 
    `verifyPageIsLoaded(): Cypress.Chainable<null> {
    cy.title().should('exist');
    cy.get('body').should('be.visible');
  }` : framework === 'selenium' ?
    `async verifyPageIsLoaded(): Promise<void> {
    const title = await this.driver.getTitle();
    expect(title).toBeTruthy();
    await this.driver.findElement(By.css('body'));
  }` :
    `async verifyPageIsLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/.*/);
    await expect(this.page.locator('body')).toBeVisible();
  }`
  }

  /**
   * Get page information
   */
  ${framework === 'cypress' ? 
    `getPageInfo(): Cypress.Chainable<PageInfo> {
    return cy.wrap({
      title: cy.title(),
      url: cy.url(),
      headerGreeting: cy.get('[data-testid="header-greeting"], .header-greeting, h1, h2').invoke('text'),
      profilePictureUrl: cy.get('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]').invoke('attr', 'src')
    });
  }` : framework === 'selenium' ?
    `async getPageInfo(): Promise<PageInfo> {
    const title = await this.driver.getTitle();
    const url = await this.driver.getCurrentUrl();
    const headerGreeting = await this.getHeaderGreeting();
    const profilePictureUrl = await this.getProfilePictureUrl();

    return {
      title,
      url,
      headerGreeting,
      profilePictureUrl
    };
  }` :
    `async getPageInfo(): Promise<PageInfo> {
    const title = await this.getPageTitle();
    const url = this.page.url();
    const headerGreeting = await this.getHeaderGreeting();
    const profilePictureUrl = await this.getProfilePictureUrl();

    return {
      title,
      url,
      headerGreeting,
      profilePictureUrl
    };
  }`
  }

  /**
   * Get header greeting text
   */
  ${framework === 'cypress' ? 
    `getHeaderGreeting(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="header-greeting"], .header-greeting, h1, h2');
  }` : framework === 'selenium' ?
    `async getHeaderGreeting(): Promise<string> {
    const element = await this.driver.findElement(By.css('[data-testid="header-greeting"], .header-greeting, h1, h2'));
    return await element.getText() || '';
  }` :
    `async getHeaderGreeting(): Promise<string> {
    return await this.headerGreeting.textContent() || '';
  }`
  }

  /**
   * Get profile picture URL
   */
  ${framework === 'cypress' ? 
    `getProfilePictureUrl(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]');
  }` : framework === 'selenium' ?
    `async getProfilePictureUrl(): Promise<string> {
    const element = await this.driver.findElement(By.css('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]'));
    return await element.getAttribute('src') || '';
  }` :
    `async getProfilePictureUrl(): Promise<string> {
    return await this.profilePictureImage.getAttribute('src') || '';
  }`
  }

  /**
   * Verify player card is displayed
   */
  ${framework === 'cypress' ? 
    `verifyPlayerCardIsDisplayed(): Cypress.Chainable<null> {
    cy.get('[data-testid="player-card"], .player-card, .card').should('be.visible');
  }` : framework === 'selenium' ?
    `async verifyPlayerCardIsDisplayed(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="player-card"], .player-card, .card'));
    await this.driver.wait(until.elementIsVisible(element));
  }` :
    `async verifyPlayerCardIsDisplayed(): Promise<void> {
    await expect(this.playerCard).toBeVisible();
  }`
  }

  /**
   * Verify upcoming sessions section is displayed
   */
  ${framework === 'cypress' ? 
    `verifyUpcomingSessionsSectionIsDisplayed(): Cypress.Chainable<null> {
    cy.get('[data-testid="upcoming-sessions"], .upcoming-sessions, section').should('be.visible');
  }` : framework === 'selenium' ?
    `async verifyUpcomingSessionsSectionIsDisplayed(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="upcoming-sessions"], .upcoming-sessions, section'));
    await this.driver.wait(until.elementIsVisible(element));
  }` :
    `async verifyUpcomingSessionsSectionIsDisplayed(): Promise<void> {
    await expect(this.upcomingSessionsSection).toBeVisible();
  }`
  }

  /**
   * Verify leaderboards link is available
   */
  ${framework === 'cypress' ? 
    `verifyLeaderboardsLinkIsAvailable(): Cypress.Chainable<null> {
    cy.get('[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]').should('be.visible');
  }` : framework === 'selenium' ?
    `async verifyLeaderboardsLinkIsAvailable(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]'));
    await this.driver.wait(until.elementIsVisible(element));
  }` :
    `async verifyLeaderboardsLinkIsAvailable(): Promise<void> {
    await expect(this.leaderboardsLink).toBeVisible();
  }`
  }

  /**
   * Verify profile picture is loaded
   */
  ${framework === 'cypress' ? 
    `verifyProfilePictureIsLoaded(): Cypress.Chainable<null> {
    cy.get('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]').should('be.visible');
  }` : framework === 'selenium' ?
    `async verifyProfilePictureIsLoaded(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]'));
    await this.driver.wait(until.elementIsVisible(element));
  }` :
    `async verifyProfilePictureIsLoaded(): Promise<void> {
    await expect(this.profilePictureImage).toBeVisible();
  }`
  }

  /**
   * Click on profile picture button
   */
  ${framework === 'cypress' ? 
    `clickProfilePictureButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]').click();
  }` : framework === 'selenium' ?
    `async clickProfilePictureButton(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]'));
    await element.click();
  }` :
    `async clickProfilePictureButton(): Promise<void> {
    await this.profilePictureButton.click();
  }`
  }

  /**
   * Click on leaderboards link
   */
  ${framework === 'cypress' ? 
    `clickLeaderboardsLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]').click();
  }` : framework === 'selenium' ?
    `async clickLeaderboardsLink(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]'));
    await element.click();
  }` :
    `async clickLeaderboardsLink(): Promise<void> {
    await this.leaderboardsLink.click();
  }`
  }

  /**
   * Click on my sessions link
   */
  ${framework === 'cypress' ? 
    `clickMySessionsLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="my-sessions"], .my-sessions, a[href*="session"]').click();
  }` : framework === 'selenium' ?
    `async clickMySessionsLink(): Promise<void> {
    const element = await this.driver.findElement(By.css('[data-testid="my-sessions"], .my-sessions, a[href*="session"]'));
    await element.click();
  }` :
    `async clickMySessionsLink(): Promise<void> {
    await this.mySessionsLink.click();
  }`
  }

  /**
   * Take a screenshot of the page
   */
  ${framework === 'cypress' ? 
    `takeScreenshot(filename?: string): Cypress.Chainable<null> {
    const screenshotPath = filename || \`${className.toLowerCase()}-\${Date.now()}.png\`;
    cy.screenshot(screenshotPath);
    return cy.wrap(screenshotPath);
  }` : framework === 'selenium' ?
    `async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || \`${className.toLowerCase()}-\${Date.now()}.png\`;
    // Selenium doesn't have built-in screenshot, would need external tool
    return screenshotPath;
  }` :
    `async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || \`${className.toLowerCase()}-\${Date.now()}.png\`;
    await this.page.screenshot({ path: screenshotPath });
    return screenshotPath;
  }`
  }

  /**
   * Get page title
   */
  ${framework === 'cypress' ? 
    `getPageTitle(): Cypress.Chainable<string> {
    return cy.title();
  }` : framework === 'selenium' ?
    `async getPageTitle(): Promise<string> {
    return await this.driver.getTitle();
  }` :
    `async getPageTitle(): Promise<string> {
    return await this.page.title();
  }`
  }
}

export interface PageInfo {
  title: string;
  url: string;
  headerGreeting: string;
  profilePictureUrl: string;
}`;
}

function generateEnhancedTestCode(result, projectName) {
  const framework = result.pom.framework || 'playwright';
  const language = result.pom.language || 'typescript';
  
  // Framework-specific test imports
  let imports = '';
  if (framework === 'cypress') {
    imports = `// Cypress Test File
import { ${projectName}, PageInfo } from './${projectName}';`;
  } else if (framework === 'playwright') {
    imports = `import { test, expect } from '@playwright/test';
import { ${projectName}, PageInfo } from './${projectName}';`;
  } else if (framework === 'selenium') {
    imports = `import { Builder, By, until } from 'selenium-webdriver';
import { ${projectName}, PageInfo } from './${projectName}';`;
  } else if (framework === 'puppeteer') {
    imports = `import { ${projectName}, PageInfo } from './${projectName}';`;
  } else if (framework === 'testcafe') {
    imports = `import { ${projectName}, PageInfo } from './${projectName}';`;
  } else {
    imports = `// Framework: ${framework}
import { ${projectName}, PageInfo } from './${projectName}';`;
  }
  
  return `${imports};

/**
 * ${projectName} Test Suite
 * 
 * This test suite demonstrates the usage of the ${projectName}
 * Page Object Model with comprehensive test scenarios.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2024-01-01
 */
${framework === 'cypress' ? 
  `describe('${projectName}', () => {
    let page: ${projectName};

    beforeEach(() => {
        page = new ${projectName}();
        page.visit();
    });` :
  `test.describe('${projectName}', () => {
    let page: ${projectName};

    test.beforeEach(async ({ page: playwrightPage }) => {
        page = new ${projectName}(playwrightPage);
        await page.navigateToPage();
    });`
}

    ${framework === 'cypress' ? 'describe' : 'test.describe'}('Page Navigation and Loading', () => {
        ${framework === 'cypress' ? 'it' : 'test'}('should load the page successfully', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            // Verify page is loaded
            ${framework === 'cypress' ? 'page.verifyPageIsLoaded();' : 'await page.verifyPageIsLoaded();'}
            
            // Verify page title
            ${framework === 'cypress' ? 'page.verifyPageTitle();' : 'await page.verifyPageTitle();'}
            
            // Wait for loading to complete
            ${framework === 'cypress' ? 'page.waitForLoadingToComplete();' : 'await page.waitForLoadingToComplete();'}
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should display all main page elements', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            // Verify player card elements
            ${framework === 'cypress' ? 'page.verifyPlayerCardIsDisplayed();' : 'await page.verifyPlayerCardIsDisplayed();'}
            
            // Verify upcoming sessions section
            ${framework === 'cypress' ? 'page.verifyUpcomingSessionsSectionIsDisplayed();' : 'await page.verifyUpcomingSessionsSectionIsDisplayed();'}
            
            // Verify leaderboards link
            ${framework === 'cypress' ? 'page.verifyLeaderboardsLinkIsAvailable();' : 'await page.verifyLeaderboardsLinkIsAvailable();'}
        });
    });

    ${framework === 'cypress' ? 'describe' : 'test.describe'}('Page Information', () => {
        ${framework === 'cypress' ? 'it' : 'test'}('should get page information correctly', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            // Get page information
            ${framework === 'cypress' ? 'const pageInfo: PageInfo = page.getPageInfo();' : 'const pageInfo: PageInfo = await page.getPageInfo();'}
            
            // Verify page information is not empty
            ${framework === 'cypress' ? 
              `pageInfo.then(info => {
                expect(info.title).to.exist;
                expect(info.url).to.exist;
                expect(info.headerGreeting).to.exist;
                expect(info.profilePictureUrl).to.exist;
                
                // Log page information for debugging
                console.log('Page Information:', info);
              });` :
              `expect(pageInfo.title).toBeTruthy();
              expect(pageInfo.url).toBeTruthy();
              expect(pageInfo.headerGreeting).toBeTruthy();
              expect(pageInfo.profilePictureUrl).toBeTruthy();
              
              // Log page information for debugging
              console.log('Page Information:', pageInfo);`
            }
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should have valid page title', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `const title = page.getPageTitle();
            title.then(t => {
              expect(t).to.exist;
              expect(t.length).to.be.greaterThan(0);
            });` :
              `const title = await page.getPageTitle();
            expect(title).toBeTruthy();
            expect(title.length).toBeGreaterThan(0);`
            }
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should have profile picture loaded', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `page.verifyProfilePictureIsLoaded();
            const profileUrl = page.getProfilePictureUrl();
            profileUrl.then(url => {
              expect(url).to.exist;
              expect(url).to.match(/^https?:\\/\\//);
            });` :
              `await page.verifyProfilePictureIsLoaded();
            const profileUrl = await page.getProfilePictureUrl();
            expect(profileUrl).toBeTruthy();
            expect(profileUrl).toMatch(/^https?:\\/\\//);`
            }
        });
    });

    ${framework === 'cypress' ? 'describe' : 'test.describe'}('Navigation and Interactions', () => {
        ${framework === 'cypress' ? 'it' : 'test'}('should be able to click profile picture button', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `page.clickProfilePictureButton();
            // Add verification for profile menu or modal if applicable` :
              `await expect(page.profilePictureButton).toBeVisible();
            await page.clickProfilePictureButton();
            
            // Add verification for profile menu or modal if applicable`
            }
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should be able to navigate to leaderboards', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `page.clickLeaderboardsLink();
            // Verify navigation to leaderboards page
            cy.url().should('include', 'leaderboard');` :
              `await expect(page.leaderboardsLink).toBeVisible();
            await page.clickLeaderboardsLink();
            
            // Verify navigation to leaderboards page
            await expect(page.page).toHaveURL(/leaderboard/);`
            }
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should be able to navigate to my sessions', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `page.clickMySessionsLink();
            // Verify navigation to sessions page
            cy.url().should('include', 'session');` :
              `await expect(page.mySessionsLink).toBeVisible();
            await page.clickMySessionsLink();
            
            // Verify navigation to sessions page
            await expect(page.page).toHaveURL(/session/);`
            }
        });
    });

    ${framework === 'cypress' ? 'describe' : 'test.describe'}('Visual and Performance', () => {
        ${framework === 'cypress' ? 'it' : 'test'}('should take screenshot successfully', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `const screenshotPath = page.takeScreenshot();
            screenshotPath.then(path => {
              expect(path).to.exist;
              expect(path).to.match(/\\.png$/);
            });` :
              `const screenshotPath = await page.takeScreenshot();
            expect(screenshotPath).toBeTruthy();
            expect(screenshotPath).toMatch(/\\.png$/);`
            }
        });

        ${framework === 'cypress' ? 'it' : 'test'}('should have reasonable page load time', ${framework === 'cypress' ? '() =>' : 'async () =>'}) {
            ${framework === 'cypress' ? 
              `const startTime = Date.now();
            page.visit();
            const loadTime = Date.now() - startTime;
            
            // Page should load within 10 seconds
            expect(loadTime).to.be.lessThan(10000);` :
              `const startTime = Date.now();
            await page.navigateToPage();
            const loadTime = Date.now() - startTime;
            
            // Page should load within 10 seconds
            expect(loadTime).toBeLessThan(10000);`
            }
        });
    });
});
`;
}

async function generateEnhancedUniversalPOM(options) {
  try {
    console.log('🌐 Enhanced Universal POM Generator CLI');
    console.log('🎯 Industrial Standards + OpenAI Integration + Enhanced Naming\n');

    // Validate OpenAI API Key
    if (!options.apiKey) {
      console.log('❌ OpenAI API Key is required for enhanced generation!');
      console.log('💡 Set OPENAI_API_KEY environment variable or use --api-key option');
      console.log('Example: export OPENAI_API_KEY="sk-your-api-key-here"');
      process.exit(1);
    }

    // Generate project name
    const projectName = generateProjectName(options.url, options.projectName);

    console.log('📋 Configuration:');
    console.log(`   🌐 Target URL: ${options.url}`);
    if (options.loginUrl) {
      console.log(`   🔗 Login URL: ${options.loginUrl}`);
      console.log(`   👤 Username: ${options.username}`);
    } else {
      console.log(`   🔐 Authentication: Not required`);
    }
    console.log(`   🛠️ Framework: ${options.framework}`);
    console.log(`   💻 Language: ${options.language}`);
    console.log(`   🌐 Browser: ${options.browser} (${options.headless ? 'headless' : 'headed'})`);
    console.log(`   🧪 Generate Tests: ${options.generateTests ? 'Yes' : 'No'}`);
    console.log(`   📋 Generate Interfaces: ${options.generateInterfaces ? 'Yes' : 'No'}`);
    console.log(`   ⚡ Performance Tests: ${options.includePerformanceTests ? 'Yes' : 'No'}`);
    console.log(`   📁 Output Directory: ${options.output}`);
    console.log(`   📝 Project Name: ${projectName}`);

    console.log('\n🚀 Starting Enhanced POM Generation...');
    console.log('⏳ This may take a few minutes...\n');

    // Initialize the enhanced POM generator
    const generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    // Configure login if provided
    const loginConfig = generateLoginConfig(options);

    // Configure generation options with enhanced settings
    const generationOptions = {
      framework: options.framework,
      language: options.language,
      browser: {
        name: options.browser,
        headless: options.headless,
        viewport: { width: 1920, height: 1080 }
      },
      ...(loginConfig && { loginConfig: loginConfig }),
      llmIntegration: {
        provider: 'openai',
        apiKey: options.apiKey,
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 4000
      },
      codeGeneration: {
        generateTests: options.generateTests,
        generateInterfaces: options.generateInterfaces,
        generateDocumentation: true,
        includePerformanceTests: options.includePerformanceTests,
        includeVisualTests: true
      },
      namingConventions: {
        useDescriptiveNames: true,
        removePersonalData: true,
        useCamelCase: true,
        useSemanticNames: true
      }
    };

    // Generate POM
    const result = await generator.generatePOM(options.url, generationOptions);

    if (result.success) {
      console.log('\n✅ Enhanced POM Generation Successful!');
      console.log(`📊 Generated Class: ${result.pom.className}`);
      console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
      console.log(`⏱️  Generation Time: ${result.metadata.generationTime}ms`);
      
      if (result.pom.metadata.qualityMetrics) {
        console.log(`📈 Quality Metrics:`, result.pom.metadata.qualityMetrics);
      }

      // Create output directory
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }

      // Generate enhanced POM with proper naming
      const enhancedPOMCode = generateEnhancedPOMCode(result, projectName);
      
      // Save enhanced POM file
      const pomFileName = `${projectName}.ts`;
      const pomFilePath = path.join(options.output, pomFileName);
      fs.writeFileSync(pomFilePath, enhancedPOMCode);
      console.log(`💾 Saved: ${pomFilePath}`);

      // Generate enhanced test file
      if (options.generateTests) {
        const enhancedTestCode = generateEnhancedTestCode(result, projectName);
        const testFileName = `${projectName}.test.ts`;
        const testFilePath = path.join(options.output, testFileName);
        fs.writeFileSync(testFilePath, enhancedTestCode);
        console.log(`🧪 Saved: ${testFilePath}`);
      }

      // Save metadata
      const metadataFileName = `${projectName}.metadata.json`;
      const metadataFilePath = path.join(options.output, metadataFileName);
      fs.writeFileSync(metadataFilePath, JSON.stringify({
        ...result.pom.metadata,
        enhancedGeneration: true,
        namingConventions: 'improved',
        timestamp: new Date().toISOString()
      }, null, 2));
      console.log(`📊 Saved: ${metadataFilePath}`);

      // Save README
      const readmeContent = `# ${projectName}

## Overview

This is an enhanced Page Object Model generated for ${options.url} with proper naming conventions and AI enhancement.

## Features

- ✅ Semantic naming conventions
- ✅ Comprehensive documentation
- ✅ TypeScript interfaces
- ✅ Error handling
- ✅ Wait strategies
- ✅ Performance optimizations

## Usage

\`\`\`typescript
import { ${projectName} } from './${projectName}';

const page = new ${projectName}(playwrightPage);
await page.navigateToPage();
await page.verifyPageIsLoaded();
\`\`\`

## Generated Files

- \`${projectName}.ts\` - Enhanced POM class
- \`${projectName}.test.ts\` - Test suite
- \`${projectName}.metadata.json\` - Generation metadata

## Quality Metrics

- **Element Detection**: ${result.pom.elements?.length || 0} elements
- **Method Generation**: ${result.pom.methods?.length || 0} methods
- **Generation Time**: ${result.metadata.generationTime}ms
- **Enhanced Features**: ✅ Enabled
`;
      const readmeFilePath = path.join(options.output, 'README.md');
      fs.writeFileSync(readmeFilePath, readmeContent);
      console.log(`📖 Saved: ${readmeFilePath}`);

      console.log('\n🎉 Enhanced POM Generation Complete!');
      console.log(`📁 Files saved to: ${options.output}`);

      console.log('\n🚀 Next Steps:');
      console.log('   1. Review the generated files in ' + options.output);
      console.log('   2. Install dependencies: npm install @playwright/test');
      console.log('   3. Run tests: npx playwright test ' + path.join(options.output, `${projectName}.test.ts`));
      console.log('   4. Use the POM in your test automation projects');

    } else {
      console.log('\n❌ Enhanced POM Generation Failed!');
      console.log('📋 Errors:', result.errors);
      console.log('⚠️  Warnings:', result.warnings);
    }
    
  } catch (error) {
    console.error('\n💥 Error during enhanced POM generation:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  generateEnhancedUniversalPOM(options).catch(console.error);
} 