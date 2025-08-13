const { Builder, By, until } = require('selenium-webdriver');
const { ElementDetector } = require('./dist/core/ElementDetector');
const { POMMethodGenerator } = require('./dist/core/POMMethodGenerator');
const { CodeGenerator } = require('./dist/core/CodeGenerator');
const { AuthenticationHandler } = require('./dist/auth/AuthenticationHandler');
const { BrowserManager } = require('./dist/browser/BrowserManager');

// 🎯 TEST ULTIMATE CLI FUNCTIONALITY
// This simulates the ultimate CLI with predefined inputs for Toca Football

async function testUltimateCLI() {
  console.log('🎯 Testing Ultimate CLI for Multi-Step Flows');
  console.log('📝 Simulating Toca Football complex flow\n');

  // Simulate CLI inputs for Toca Football
  const targetUrl = 'https://staging.my.tocafootball.com/home';
  const needsLogin = 'yes';
  const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
  const username = 'forkrrish@gmail.com';
  const password = 'Toca123!';
  const hasRedirect = 'yes';
  const waitForUrl = 'profiles';
  const framework = 'playwright';
  const language = 'typescript';

  console.log('🌐 Target URL:', targetUrl);
  console.log('🔐 Needs Login:', needsLogin);
  console.log('🔑 Login URL:', loginUrl);
  console.log('👤 Username:', username);
  console.log('🔄 Has Redirect:', hasRedirect);
  console.log('🎯 Wait For URL:', waitForUrl);
  console.log('🛠️ Framework:', framework);
  console.log('💻 Language:', language);

  const loginConfig = {
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

  try {
    // 🎯 Generate POM using ultimate solution
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

      return pom;

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
    return null;
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testUltimateCLI().catch(console.error);
}

module.exports = { testUltimateCLI }; 