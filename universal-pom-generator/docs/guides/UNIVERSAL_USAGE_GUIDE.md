# 🌐 Universal POM Generator - Complete Usage Guide

## Overview

The Universal POM Generator is a powerful tool that can generate Page Object Models for **any website** with AI enhancement and industrial standards. It's not limited to TOCA Football - it works with any website, framework, and scenario.

## 🚀 **Quick Start**

### **Method 1: Interactive CLI (Recommended for Beginners)**

```bash
cd universal-pom-generator
node cli-universal-interactive.js
```

Just answer the questions:
- What website do you want to generate POM for?
- Does it need login?
- What framework/language do you prefer?

### **Method 2: Command Line (For Advanced Users)**

```bash
# Basic usage for any website
node cli-universal.js --url https://example.com

# With authentication
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass

# Different framework
node cli-universal.js --url https://shop.example.com \
  --framework selenium --language java
```

## 📋 **Supported Scenarios**

### **1. Public Websites (No Login)**
```bash
# News website
node cli-universal.js --url https://news.example.com

# Documentation site
node cli-universal.js --url https://docs.example.com --framework cypress

# Marketing site
node cli-universal.js --url https://marketing.example.com --language python
```

### **2. E-commerce Websites**
```bash
# Online store
node cli-universal.js --url https://shop.example.com \
  --login-url https://shop.example.com/login \
  --username customer@example.com --password mypassword

# Product catalog
node cli-universal.js --url https://products.example.com \
  --framework selenium --language java
```

### **3. Web Applications**
```bash
# Dashboard application
node cli-universal.js --url https://dashboard.example.com \
  --login-url https://dashboard.example.com/auth \
  --username admin@example.com --password admin123

# CRM system
node cli-universal.js --url https://crm.example.com \
  --framework playwright --language typescript
```

### **4. Social Media Platforms**
```bash
# Social network
node cli-universal.js --url https://social.example.com \
  --login-url https://social.example.com/login \
  --username user@example.com --password mypass

# Blog platform
node cli-universal.js --url https://blog.example.com \
  --framework cypress --language javascript
```

### **5. Banking/Financial Applications**
```bash
# Banking portal
node cli-universal.js --url https://bank.example.com \
  --login-url https://bank.example.com/login \
  --username account@example.com --password securepass

# Investment platform
node cli-universal.js --url https://invest.example.com \
  --framework selenium --language java
```

## 🛠️ **Supported Frameworks & Languages**

### **Frameworks**
- ✅ **Playwright** (TypeScript, JavaScript)
- ✅ **Selenium** (Java, Python, JavaScript)
- ✅ **Cypress** (JavaScript)
- ✅ **Puppeteer** (JavaScript)
- ✅ **TestCafe** (JavaScript)

### **Languages**
- ✅ **TypeScript** (Recommended)
- ✅ **JavaScript**
- ✅ **Python**
- ✅ **Java**
- ✅ **C#**

## 🔐 **Authentication Support**

### **Basic Authentication**
```bash
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass
```

### **OAuth2**
```bash
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/oauth \
  --username client_id --password client_secret
```

### **SAML**
```bash
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/saml \
  --username saml_user --password saml_pass
```

## 🎯 **Real-World Examples**

### **Example 1: E-commerce Site**
```bash
# Amazon-like store
node cli-universal.js --url https://shop.example.com \
  --login-url https://shop.example.com/login \
  --username customer@example.com --password mypass \
  --framework playwright --language typescript \
  --output ./ecommerce-pom
```

**Generated POM will include:**
- Product listing methods
- Shopping cart functionality
- Checkout process
- User account management
- Search functionality

### **Example 2: Banking Application**
```bash
# Banking portal
node cli-universal.js --url https://bank.example.com \
  --login-url https://bank.example.com/login \
  --username account@example.com --password securepass \
  --framework selenium --language java \
  --output ./banking-pom
```

**Generated POM will include:**
- Account overview methods
- Transaction history
- Transfer functionality
- Bill payment
- Security features

### **Example 3: Social Media Platform**
```bash
# Social network
node cli-universal.js --url https://social.example.com \
  --login-url https://social.example.com/login \
  --username user@example.com --password mypass \
  --framework cypress --language javascript \
  --output ./social-pom
```

**Generated POM will include:**
- Post creation methods
- Friend management
- Messaging functionality
- Profile management
- Feed navigation

## ⚙️ **Advanced Configuration**

### **Custom Selectors**
```bash
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass \
  --framework playwright --language typescript \
  --custom-selectors '{"loginButton": "#custom-login-btn"}'
```

### **Performance Testing**
```bash
node cli-universal.js --url https://app.example.com \
  --framework playwright --language typescript \
  --include-performance-tests \
  --output ./performance-pom
```

### **Visual Testing**
```bash
node cli-universal.js --url https://app.example.com \
  --framework playwright --language typescript \
  --include-visual-tests \
  --output ./visual-pom
```

## 📁 **Generated Output Structure**

For any website, the tool generates:

```
./generated-pom/
├── ExamplecomPage.ts          # Main POM class
├── ExamplecomPage.test.ts     # Test suite
├── ExamplecomPage.metadata.json # Generation metadata
├── interfaces.ts              # TypeScript interfaces
├── README.md                 # Usage documentation
└── package.json              # Dependencies
```

## 🔧 **Configuration Options**

### **Basic Options**
```bash
--url <url>                    # Target URL (required)
--login-url <url>              # Login URL (if authentication required)
--username <email>             # Username/Email
--password <password>          # Password
--framework <framework>        # playwright, selenium, cypress, puppeteer, testcafe
--language <language>          # typescript, javascript, python, java, csharp
--browser <browser>            # chrome, firefox, safari, edge
--headless                     # Run in headless mode
--output <directory>           # Output directory
--project-name <name>          # Custom project name
```

### **Generation Options**
```bash
--no-tests                     # Skip test generation
--no-interfaces                # Skip interface generation
--no-performance               # Skip performance tests
--include-visual-tests         # Include visual testing
--include-accessibility-tests  # Include accessibility testing
```

### **AI Enhancement Options**
```bash
--api-key <key>                # OpenAI API Key
--ai-model <model>             # gpt-4, gpt-3.5-turbo, claude-3
--temperature <value>           # AI creativity (0.0-1.0)
--max-tokens <number>          # Maximum tokens for AI
```

## 🧪 **Testing Scenarios**

### **1. Functional Testing**
```typescript
// Generated test for any website
test('should navigate to home page', async () => {
  await page.navigateToHomePage();
  await page.verifyPageIsLoaded();
  await page.verifyPageTitle();
});
```

### **2. Authentication Testing**
```typescript
// Generated login test
test('should login successfully', async () => {
  await page.navigateToLoginPage();
  await page.enterUsername('user@example.com');
  await page.enterPassword('password');
  await page.clickLoginButton();
  await page.verifyLoginSuccess();
});
```

### **3. E-commerce Testing**
```typescript
// Generated e-commerce test
test('should add item to cart', async () => {
  await page.navigateToProductPage();
  await page.selectProductSize('Large');
  await page.clickAddToCartButton();
  await page.verifyItemAddedToCart();
});
```

### **4. Banking Testing**
```typescript
// Generated banking test
test('should view account balance', async () => {
  await page.navigateToAccountPage();
  await page.verifyAccountBalanceIsDisplayed();
  await page.verifyTransactionHistoryIsVisible();
});
```

## 🚀 **Production Usage**

### **CI/CD Integration**
```yaml
# GitHub Actions example
- name: Generate POM
  run: |
    cd universal-pom-generator
    node cli-universal.js --url ${{ secrets.TARGET_URL }} \
      --login-url ${{ secrets.LOGIN_URL }} \
      --username ${{ secrets.USERNAME }} \
      --password ${{ secrets.PASSWORD }} \
      --framework playwright --language typescript \
      --output ./generated-pom
```

### **Team Collaboration**
```bash
# Generate POM for team project
node cli-universal.js --url https://team-app.example.com \
  --login-url https://team-app.example.com/login \
  --username team@example.com --password teampass \
  --framework playwright --language typescript \
  --output ./team-pom --project-name TeamApp
```

## 📊 **Quality Metrics**

The tool provides comprehensive quality metrics:

- **Element Detection**: Number of interactive elements found
- **Method Generation**: Number of methods created
- **Code Quality**: TypeScript compliance, documentation coverage
- **Test Coverage**: Number of test scenarios generated
- **Performance**: Generation time and optimization metrics

## 🎯 **Benefits of Universal Approach**

1. **Any Website**: Works with any website, not just specific domains
2. **Multiple Frameworks**: Choose the framework that fits your needs
3. **Multiple Languages**: Use your preferred programming language
4. **AI Enhancement**: Intelligent code generation with OpenAI
5. **Industrial Standards**: Proper naming conventions and documentation
6. **Scalable**: Generate POMs for entire applications
7. **Maintainable**: Clean, semantic code structure
8. **Testable**: Comprehensive test coverage

## 🔄 **Migration from TOCA-Specific**

If you're currently using the TOCA-specific tools, you can easily migrate:

```bash
# Old TOCA-specific command
node generate-toca-pom.js

# New universal command
node cli-universal.js --url https://staging.my.tocafootball.com/home \
  --login-url https://staging.my.tocafootball.com/auth/signin/email \
  --username forkrrish@gmail.com --password Toca123!
```

## 🎉 **Conclusion**

The Universal POM Generator is a powerful, flexible tool that can handle any website and scenario. Whether you're testing e-commerce sites, banking applications, social media platforms, or any other web application, this tool provides the same high-quality, AI-enhanced Page Object Models with proper naming conventions and industrial standards. 