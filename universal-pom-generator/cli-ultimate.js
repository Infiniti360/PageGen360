#!/usr/bin/env node

const { Builder, By, until } = require('selenium-webdriver');
const { ElementDetector } = require('./dist/core/ElementDetector');
const { POMMethodGenerator } = require('./dist/core/POMMethodGenerator');
const { CodeGenerator } = require('./dist/core/CodeGenerator');
const { AuthenticationHandler } = require('./dist/auth/AuthenticationHandler');
const { BrowserManager } = require('./dist/browser/BrowserManager');
const readline = require('readline');

// 🎯 ULTIMATE CLI FOR MULTI-STEP FLOWS
// This CLI uses the working component approach for complex flows

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function ultimateCLI() {
  console.log('🎯 Ultimate POM Generator CLI');
  console.log('📝 Handles complex multi-step flows with redirects!\n');

  try {
    // 🚀 STEP 1: What page do you want POM for?
    const targetUrl = await askQuestion('🌐 What page do you want POM for? (e.g., https://example.com): ');
    
    // 🔐 STEP 2: Does it need login?
    const needsLogin = await askQuestion('🔐 Does this page need login? (yes/no): ');
    
    let loginConfig = null;
    
    if (needsLogin.toLowerCase() === 'yes' || needsLogin.toLowerCase() === 'y') {
      // Get login details
      const loginUrl = await askQuestion('🔑 What is the login page URL? (e.g., https://example.com/login): ');
      const username = await askQuestion('👤 What is your username/email? ');
      const password = await askQuestion('🔒 What is your password? ');
      
      // Ask about redirect flow
      const hasRedirect = await askQuestion('🔄 After login, does it redirect to a different page? (yes/no): ');
      
      let waitForUrl = 'dashboard';
      if (hasRedirect.toLowerCase() === 'yes' || hasRedirect.toLowerCase() === 'y') {
        waitForUrl = await askQuestion('🎯 What URL should we wait for after login? (e.g., profiles, dashboard): ');
      }
      
      loginConfig = {
        type: 'basic',
        loginUrl,
        credentials: { username, password },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { type: 'url', value: waitForUrl }
      };
    }
    
    // 🛠️ STEP 3: Framework and language
    const framework = await askQuestion('🛠️ What framework? (playwright/selenium/cypress) [playwright]: ') || 'playwright';
    const language = await askQuestion('💻 What language? (typescript/javascript/python) [typescript]: ') || 'typescript';
    
    // 🎯 STEP 4: Generate POM using ultimate solution
    console.log('\n🚀 Generating POM using ultimate solution... Please wait...\n');
    
    const browserManager = new BrowserManager();
    const authHandler = new AuthenticationHandler();
    const elementDetector = new ElementDetector();
    const methodGenerator = new POMMethodGenerator();
    const codeGenerator = new CodeGenerator();

    let browser = null;

    try {
      // Step 1: Initialize browser
      console.log('🚀 Step 1: Initializing browser...');
      browser = await browserManager.initializeBrowser({ 
        name: 'chrome', 
        headless: false,
        slowMo: 2000
      });

      // Step 2: Navigate to target page (may redirect)
      console.log('🏠 Step 2: Navigating to target page...');
      await browser.get(targetUrl);
      await new Promise(resolve => setTimeout(resolve, 3000));

      const currentUrl = await browser.getCurrentUrl();
      console.log(`📍 Current URL: ${currentUrl}`);

      // Step 3: Handle login if needed
      if (loginConfig) {
        console.log('🔐 Step 3: Handling login...');
        await authHandler.handleLogin(targetUrl, loginConfig, browser);
        console.log('✅ Login completed successfully');

        // Step 4: Navigate to target page after login
        console.log('🏠 Step 4: Navigating to target page after login...');
        await browser.get(targetUrl);
        await new Promise(resolve => setTimeout(resolve, 3000));

        const finalUrl = await browser.getCurrentUrl();
        console.log(`📍 Final URL: ${finalUrl}`);
      }

      // Step 5: Detect elements
      console.log('🔍 Step 5: Detecting elements...');
      const elements = await elementDetector.detectElements(browser);
      console.log(`📊 Found ${elements.length} elements`);

      // Step 6: Generate methods
      console.log('⚙️ Step 6: Generating methods...');
      const methods = await methodGenerator.generateMethods(elements, {
        framework,
        language,
        includeWaitStrategies: true,
        includeErrorHandling: true
      });
      console.log(`📝 Generated ${methods.length} methods`);

      // Step 7: Generate code
      console.log('💻 Step 7: Generating code...');
      const code = await codeGenerator.generateCode(elements, methods, {
        framework,
        language,
        includeComments: true
      });

      // Step 8: Create POM object
      console.log('📦 Step 8: Creating POM object...');
      const pom = {
        elements: elements,
        methods: methods,
        pomClass: code.pomClass,
        testFile: code.testFile,
        metadata: {
          url: targetUrl,
          title: await browser.getTitle(),
          framework,
          language,
          authenticationMethod: loginConfig ? 'basic' : undefined,
          elementCount: elements.length,
          methodCount: methods.length,
          generatedAt: new Date().toISOString()
        }
      };

      // Step 9: Display results
      console.log('\n🎉 SUCCESS! POM Generated!');
      console.log(`📊 Found ${pom.elements.length} elements`);
      console.log(`📝 Generated ${pom.methods.length} methods`);
      console.log(`📁 Generated files:`);
      console.log(`   - POM Class: ${pom.pomClass ? 'Generated' : 'Not generated'}`);
      console.log(`   - Test File: ${pom.testFile ? 'Generated' : 'Not generated'}`);
      console.log(`   - Metadata: ${pom.metadata ? 'Generated' : 'Not generated'}`);

      if (pom.pomClass) {
        console.log('\n📝 Generated POM Class Preview:');
        console.log('='.repeat(50));
        console.log(pom.pomClass.substring(0, 500) + '...');
        console.log('='.repeat(50));
      }

      // Step 10: Show element details
      console.log('\n🔍 Element Details:');
      pom.elements.forEach((element, index) => {
        console.log(`${index + 1}. ${element.type} - ${element.selector} (${element.text?.substring(0, 30) || 'No text'}...)`);
      });

    } catch (error) {
      console.error('\n💥 Error in POM generation:', error.message);
      throw error;
    } finally {
      if (browser) {
        console.log('\n🧹 Cleaning up browser...');
        await browserManager.cleanup();
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// 🚀 RUN THE ULTIMATE CLI
if (require.main === module) {
  ultimateCLI();
}

module.exports = { ultimateCLI }; 