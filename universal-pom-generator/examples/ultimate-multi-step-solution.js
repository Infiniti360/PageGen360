const { Builder, By, until } = require('selenium-webdriver');
const { ElementDetector } = require('../dist/core/ElementDetector');
const { POMMethodGenerator } = require('../dist/core/POMMethodGenerator');
const { CodeGenerator } = require('../dist/core/CodeGenerator');
const { AuthenticationHandler } = require('../dist/auth/AuthenticationHandler');
const { BrowserManager } = require('../dist/browser/BrowserManager');

// 🎯 ULTIMATE MULTI-STEP SOLUTION
// This handles complex redirect flows by directly orchestrating components

async function ultimateMultiStepSolution() {
  console.log('🎯 Ultimate Multi-Step Solution for Complex Redirects');
  console.log('🏠 Navigate to Home → Redirect to Auth → Login → Profiles → Home → POM');

  const browserManager = new BrowserManager();
  const authHandler = new AuthenticationHandler();
  const elementDetector = new ElementDetector();
  const methodGenerator = new POMMethodGenerator();
  const codeGenerator = new CodeGenerator();

  let browser = null;

  try {
    // Step 1: Initialize browser
    console.log('\n🚀 Step 1: Initializing browser...');
    browser = await browserManager.initializeBrowser({ 
      name: 'chrome', 
      headless: false,
      slowMo: 2000
    });

    // Step 2: Navigate to home page (will redirect to auth)
    console.log('\n🏠 Step 2: Navigating to home page...');
    await browser.get('https://staging.my.tocafootball.com/home');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const currentUrl = await browser.getCurrentUrl();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Step 3: Handle login if redirected to auth
    if (currentUrl.includes('auth')) {
      console.log('\n🔐 Step 3: Handling login...');
      
      const loginConfig = {
        type: 'basic',
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      };

      await authHandler.handleLogin('https://staging.my.tocafootball.com/home', loginConfig, browser);
      console.log('✅ Login completed successfully');

      // Step 4: Navigate to home page after login
      console.log('\n🏠 Step 4: Navigating to home page after login...');
      await browser.get('https://staging.my.tocafootball.com/home');
      await new Promise(resolve => setTimeout(resolve, 3000));

      const finalUrl = await browser.getCurrentUrl();
      console.log(`📍 Final URL: ${finalUrl}`);

      // Step 5: Detect elements
      console.log('\n🔍 Step 5: Detecting elements...');
      const elements = await elementDetector.detectElements(browser);
      console.log(`📊 Found ${elements.length} elements`);

      // Step 6: Generate methods
      console.log('\n⚙️ Step 6: Generating methods...');
      const methods = await methodGenerator.generateMethods(elements, {
        framework: 'playwright',
        language: 'typescript',
        includeWaitStrategies: true,
        includeErrorHandling: true
      });
      console.log(`📝 Generated ${methods.length} methods`);

      // Step 7: Generate code
      console.log('\n💻 Step 7: Generating code...');
      const code = await codeGenerator.generateCode(elements, methods, {
        framework: 'playwright',
        language: 'typescript',
        includeComments: true
      });

      // Step 8: Create POM object
      console.log('\n📦 Step 8: Creating POM object...');
      const pom = {
        elements: elements,
        methods: methods,
        pomClass: code.pomClass,
        testFile: code.testFile,
        metadata: {
          url: 'https://staging.my.tocafootball.com/home',
          title: await browser.getTitle(),
          framework: 'playwright',
          language: 'typescript',
          authenticationMethod: 'basic',
          elementCount: elements.length,
          methodCount: methods.length,
          generatedAt: new Date().toISOString()
        }
      };

      // Step 9: Display results
      console.log('\n🎉 SUCCESS! POM Generated for Complex Multi-Step Flow!');
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

      return pom;

    } else {
      console.log('⚠️ Not redirected to auth page');
      return null;
    }

  } catch (error) {
    console.error('\n💥 Error in Ultimate Multi-Step Solution:', error.message);
    console.error('Stack trace:', error.stack);
    return null;
  } finally {
    if (browser) {
      console.log('\n🧹 Cleaning up browser...');
      await browserManager.cleanup();
    }
  }
}

// 🚀 RUN THE ULTIMATE SOLUTION
if (require.main === module) {
  ultimateMultiStepSolution().catch(console.error);
}

module.exports = { ultimateMultiStepSolution }; 