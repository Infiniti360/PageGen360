# Universal POM Generator CLI Usage Guide

## Overview

The Universal POM Generator CLI is a powerful tool that can generate Page Object Models for any website with AI enhancement and industrial standards. It supports multiple frameworks, languages, and authentication methods.

## Quick Start

### 1. **Basic Usage**

```bash
# Generate POM for any website
npm run generate -- --url https://example.com

# Interactive mode
npm run generate-interactive
```

### 2. **With Authentication**

```bash
# Website with login
npm run generate -- --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass
```

## Command Line Options

### **Required Options**

| Option | Description | Example |
|--------|-------------|---------|
| `--url` | Target URL (required) | `https://example.com` |

### **Authentication Options**

| Option | Description | Example |
|--------|-------------|---------|
| `--login-url` | Login page URL | `https://example.com/login` |
| `--username` | Username/Email | `user@example.com` |
| `--password` | Password | `mypassword` |

### **Framework & Language Options**

| Option | Description | Default | Examples |
|--------|-------------|---------|----------|
| `--framework` | Testing framework | `playwright` | `playwright`, `selenium`, `cypress`, `puppeteer`, `testcafe` |
| `--language` | Programming language | `typescript` | `typescript`, `javascript`, `python`, `java`, `csharp` |
| `--browser` | Browser | `chrome` | `chrome`, `firefox`, `safari`, `edge` |

### **Generation Options**

| Option | Description | Default |
|--------|-------------|---------|
| `--headless` | Run in headless mode | `false` |
| `--no-tests` | Skip test generation | `false` |
| `--no-interfaces` | Skip interface generation | `false` |
| `--no-performance` | Skip performance tests | `false` |
| `--output` | Output directory | `./generated-pom` |
| `--project-name` | Custom project name | Auto-generated from URL |

### **AI Enhancement Options**

| Option | Description | Default |
|--------|-------------|---------|
| `--api-key` | OpenAI API Key | `process.env.OPENAI_API_KEY` |

## Real-World Examples

### **Example 1: TOCA Football (E-commerce/Portal)**

```bash
# TOCA Football with authentication
npm run generate -- \
  --url https://staging.my.tocafootball.com/home \
  --login-url https://staging.my.tocafootball.com/auth/signin/email \
  --username forkrrish@gmail.com \
  --password Toca123! \
  --framework playwright \
  --language typescript \
  --output ./toca-football-pom
```

**Generated Files:**
- `TocaFootballHomePage.ts` - Main POM class
- `TocaFootballHomePage.test.ts` - Test suite
- `TocaFootballHomePage.interfaces.ts` - TypeScript interfaces
- `TocaFootballHomePage.metadata.json` - Generation metadata
- `README.md` - Documentation

### **Example 2: E-commerce Website**

```bash
# E-commerce site with login
npm run generate -- \
  --url https://shop.example.com \
  --login-url https://shop.example.com/login \
  --username customer@example.com \
  --password mypassword \
  --framework selenium \
  --language java \
  --output ./ecommerce-pom
```

**Generated Files:**
- `ShopExampleComPage.ts` - Main POM class
- `ShopExampleComPage.test.ts` - Test suite
- `ShopExampleComPage.interfaces.ts` - TypeScript interfaces

### **Example 3: News Website (Public)**

```bash
# Public news website (no authentication)
npm run generate -- \
  --url https://news.example.com \
  --framework cypress \
  --language javascript \
  --output ./news-pom
```

**Generated Files:**
- `NewsExampleComPage.ts` - Main POM class
- `NewsExampleComPage.test.ts` - Test suite

### **Example 4: Dashboard Application**

```bash
# Dashboard with custom project name
npm run generate -- \
  --url https://dashboard.example.com \
  --login-url https://dashboard.example.com/auth \
  --username admin@example.com \
  --password adminpass \
  --project-name DashboardApp \
  --headless \
  --output ./dashboard-pom
```

**Generated Files:**
- `DashboardApp.ts` - Main POM class (custom name)
- `DashboardApp.test.ts` - Test suite
- `DashboardApp.interfaces.ts` - TypeScript interfaces

### **Example 5: Banking Application**

```bash
# Banking app with security
npm run generate -- \
  --url https://bank.example.com/accounts \
  --login-url https://bank.example.com/login \
  --username user@bank.com \
  --password securepass \
  --framework playwright \
  --language typescript \
  --output ./banking-pom
```

### **Example 6: Social Media Platform**

```bash
# Social media platform
npm run generate -- \
  --url https://social.example.com/profile \
  --login-url https://social.example.com/login \
  --username user@social.com \
  --password socialpass \
  --framework cypress \
  --language javascript \
  --output ./social-pom
```

## Framework-Specific Examples

### **Playwright (Recommended for Modern Web Apps)**

```bash
# Modern web application
npm run generate -- \
  --url https://app.example.com \
  --framework playwright \
  --language typescript \
  --browser chrome \
  --output ./playwright-pom
```

### **Selenium (For Legacy Applications)**

```bash
# Legacy application
npm run generate -- \
  --url https://legacy.example.com \
  --framework selenium \
  --language java \
  --browser chrome \
  --output ./selenium-pom
```

### **Cypress (For Component Testing)**

```bash
# Component testing
npm run generate -- \
  --url https://components.example.com \
  --framework cypress \
  --language javascript \
  --output ./cypress-pom
```

### **Puppeteer (For Scraping/Testing)**

```bash
# Web scraping/testing
npm run generate -- \
  --url https://data.example.com \
  --framework puppeteer \
  --language javascript \
  --headless \
  --output ./puppeteer-pom
```

### **TestCafe (For Cross-Browser Testing)**

```bash
# Cross-browser testing
npm run generate -- \
  --url https://crossbrowser.example.com \
  --framework testcafe \
  --language typescript \
  --output ./testcafe-pom
```

## Language-Specific Examples

### **TypeScript (Recommended)**

```bash
npm run generate -- \
  --url https://example.com \
  --language typescript \
  --output ./typescript-pom
```

### **JavaScript**

```bash
npm run generate -- \
  --url https://example.com \
  --language javascript \
  --output ./javascript-pom
```

### **Python**

```bash
npm run generate -- \
  --url https://example.com \
  --language python \
  --output ./python-pom
```

### **Java**

```bash
npm run generate -- \
  --url https://example.com \
  --language java \
  --output ./java-pom
```

### **C#**

```bash
npm run generate -- \
  --url https://example.com \
  --language csharp \
  --output ./csharp-pom
```

## Interactive Mode

### **Starting Interactive Mode**

```bash
npm run generate-interactive
```

### **Interactive Flow**

1. **OpenAI API Key**: Enter your API key or use environment variable
2. **Target URL**: Enter the website URL
3. **Project Name**: Optional custom name (auto-generated from URL)
4. **Authentication**: Configure login details if required
5. **Framework & Language**: Choose your preferred stack
6. **Browser Settings**: Configure browser options
7. **Generation Options**: Choose what to generate
8. **Output Directory**: Specify where to save files

### **Interactive Example**

```bash
$ npm run generate-interactive

🌐 Universal POM Generator - Interactive CLI
🎯 Industrial Standards + OpenAI Integration
📝 Generate POMs for any website with AI enhancement

🚀 Starting Universal POM Generation...

🔑 OpenAI Configuration:
✅ OpenAI API Key found in environment variables

🌐 Website Configuration:
🌐 What website do you want to generate POM for? (e.g., https://example.com): https://shop.example.com

📝 Custom project name (optional, will auto-generate from URL): 

🔐 Authentication Configuration:
🔐 Does this website require login? (y/n): y

🔗 Login page URL: https://shop.example.com/login
👤 Username/Email: customer@example.com
🔒 Password: mypassword

🛠️ Framework Configuration:
🛠️ Framework (playwright/selenium/cypress/puppeteer/testcafe) [playwright]: 
💻 Language (typescript/javascript/python/java/csharp) [typescript]: 

🌐 Browser Configuration:
🌐 Browser (chrome/firefox/safari/edge) [chrome]: 
👻 Run in headless mode? (y/n) [n]: 

⚙️ Generation Options:
🧪 Generate test files? (y/n) [y]: 
📋 Generate TypeScript interfaces? (y/n) [y]: 
⚡ Include performance tests? (y/n) [y]: 

📁 Output directory [./generated-pom]: ./shop-pom

📋 Configuration Summary:
   🌐 Target URL: https://shop.example.com
   📝 Project Name: ShopExampleComPage
   🔐 Login Required: Yes
   🔗 Login URL: https://shop.example.com/login
   👤 Username: customer@example.com
   🛠️ Framework: playwright
   💻 Language: typescript
   🌐 Browser: chrome (headed)
   🧪 Generate Tests: Yes
   📋 Generate Interfaces: Yes
   ⚡ Performance Tests: Yes
   📁 Output Directory: ./shop-pom

✅ Proceed with generation? (y/n) [y]: 

🚀 Starting POM Generation...
⏳ This may take a few minutes...

✅ POM Generation Successful!
📊 Generated Class: ShopExampleComPage
🔧 Methods Count: 18
⏱️  Generation Time: 3200ms
📈 Quality Metrics: { codeCoverage: '95%', documentationCoverage: '100%', typeSafety: '100%' }

💾 Files saved successfully!
📁 Output Directory: ./shop-pom

📄 Generated Files:
   📄 ShopExampleComPage.ts
   🧪 ShopExampleComPage.test.ts
   📋 ShopExampleComPage.interfaces.ts
   📊 ShopExampleComPage.metadata.json
   📖 README.md

🎉 POM Generation Complete!
```

## Environment Variables

### **Required Environment Variables**

```bash
# OpenAI API Key (required for AI-enhanced generation)
export OPENAI_API_KEY="sk-your-openai-api-key-here"
```

### **Optional Environment Variables**

```bash
# Debug mode
export DEBUG=true

# Log level
export LOG_LEVEL=info

# Custom MCP server
export MCP_SERVER_URL="http://localhost:3000"
```

## Generated Code Structure

### **Main POM Class**

```typescript
/**
 * ExampleComPage - Page Object Model
 * 
 * This class represents the Playwright page object with industrial standards
 * and proper naming conventions.
 * 
 * @author Test Automation Team
 * @version 2.0.0
 * @since 2024-01-01
 */
export class ExampleComPage {
  private readonly page: Page;

  // Header Elements
  public readonly headerLogo: Locator;
  public readonly navigationMenu: Locator;

  // Main Content Elements
  public readonly mainContent: Locator;
  public readonly sidebar: Locator;

  // Form Elements
  public readonly searchInput: Locator;
  public readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize all elements
  }

  // Navigation Methods
  async navigateToPage(): Promise<void> { /* ... */ }
  async waitForPageToLoad(): Promise<void> { /* ... */ }

  // Interaction Methods
  async clickLogo(): Promise<void> { /* ... */ }
  async searchForText(text: string): Promise<void> { /* ... */ }

  // Verification Methods
  async verifyPageIsLoaded(): Promise<void> { /* ... */ }
  async verifyLogoIsVisible(): Promise<void> { /* ... */ }

  // Data Retrieval Methods
  async getPageTitle(): Promise<string> { /* ... */ }
  async getMainContent(): Promise<string> { /* ... */ }

  // Utility Methods
  async takeScreenshot(path: string): Promise<void> { /* ... */ }
  async waitForElement(selector: string): Promise<void> { /* ... */ }
}
```

### **Test Suite**

```typescript
import { test, expect } from '@playwright/test';
import { ExampleComPage } from './ExampleComPage';

test.describe('Example.com Page', () => {
  let page: ExampleComPage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new ExampleComPage(browserPage);
    await page.navigateToPage();
  });

  test.describe('Page Navigation and Loading', () => {
    test('should load the page successfully', async () => {
      await page.verifyPageIsLoaded();
      await page.verifyLogoIsVisible();
    });
  });

  test.describe('User Interactions', () => {
    test('should handle search functionality', async () => {
      await page.searchForText('test query');
      await page.clickSubmitButton();
    });
  });
});
```

### **TypeScript Interfaces**

```typescript
/**
 * Interface for page data
 */
export interface PageData {
  title: string;
  url: string;
  description: string;
  timestamp: Date;
}

/**
 * Interface for search results
 */
export interface SearchResult {
  query: string;
  results: string[];
  count: number;
}
```

## Running Generated Tests

### **Install Dependencies**

```bash
# Install Playwright
npm install @playwright/test

# Install Playwright browsers
npx playwright install
```

### **Run Tests**

```bash
# Run all tests
npx playwright test ./generated-pom/ExampleComPage.test.ts

# Run with headed mode
npx playwright test ./generated-pom/ExampleComPage.test.ts --headed

# Run specific test
npx playwright test ./generated-pom/ExampleComPage.test.ts -g "should load the page successfully"

# Generate HTML report
npx playwright test ./generated-pom/ExampleComPage.test.ts --reporter=html
```

## Troubleshooting

### **Common Issues**

#### **1. OpenAI API Key Issues**

```bash
# Error: OpenAI API Key is required!
# Solution: Set environment variable
export OPENAI_API_KEY="sk-your-openai-api-key-here"

# Or use command line option
npm run generate -- --api-key sk-your-openai-api-key-here
```

#### **2. Browser Issues**

```bash
# Error: Browser not found
# Solution: Install Playwright browsers
npx playwright install chrome

# Or use different browser
npm run generate -- --browser firefox
```

#### **3. Network Issues**

```bash
# Error: Page not accessible
# Solution: Check URL and network connection
npm run generate -- --url https://example.com

# Or run in headed mode for debugging
npm run generate -- --headless false
```

#### **4. Authentication Issues**

```bash
# Error: Login failed
# Solution: Verify credentials
npm run generate -- \
  --url https://example.com \
  --login-url https://example.com/login \
  --username user@example.com \
  --password mypass
```

### **Debug Mode**

```bash
# Enable debug logging
export DEBUG=true
npm run generate -- --url https://example.com

# Or use verbose output
npm run generate -- --url https://example.com --verbose
```

## Best Practices

### **1. API Key Security**

```bash
# Use environment variables (recommended)
export OPENAI_API_KEY="sk-your-openai-api-key-here"

# Don't hardcode in scripts
# ❌ npm run generate -- --api-key sk-xxx
```

### **2. Output Organization**

```bash
# Use descriptive output directories
npm run generate -- --url https://example.com --output ./pom/example-site

# Organize by project
npm run generate -- --url https://example.com --output ./projects/example/pom
```

### **3. Framework Selection**

```bash
# For modern web apps (recommended)
npm run generate -- --url https://example.com --framework playwright

# For legacy applications
npm run generate -- --url https://example.com --framework selenium

# For component testing
npm run generate -- --url https://example.com --framework cypress
```

### **4. Project Naming**

```bash
# Auto-generated name (recommended)
npm run generate -- --url https://shop.example.com
# Generates: ShopExampleComPage

# Custom name
npm run generate -- --url https://shop.example.com --project-name EcommerceApp
# Generates: EcommerceApp
```

## Integration with CI/CD

### **GitHub Actions Example**

```yaml
name: Generate POM
on: [push, pull_request]
jobs:
  generate-pom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run generate -- --url ${{ secrets.TARGET_URL }}
      - run: npm test
```

### **Local Development**

```bash
# Generate POM for development
npm run generate -- --url https://example.com --output ./dev-pom

# Run tests in watch mode
npx playwright test ./dev-pom/ExampleComPage.test.ts --watch
```

## Support

For issues and questions:

1. **Check the troubleshooting section above**
2. **Review generated files for errors**
3. **Enable debug mode for detailed logs**
4. **Verify OpenAI API key and credits**
5. **Test with different browser settings**

The Universal POM Generator CLI provides industrial-standard code generation with comprehensive documentation, proper naming conventions, TypeScript interfaces, robust error handling, and modular design. Follow these guidelines for optimal results. 