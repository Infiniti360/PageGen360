const { Builder, By, until } = require('selenium-webdriver');
const { ElementDetector } = require('../dist/core/ElementDetector');
const { POMMethodGenerator } = require('../dist/core/POMMethodGenerator');
const { CodeGenerator } = require('../dist/core/CodeGenerator');
const { AuthenticationHandler } = require('../dist/auth/AuthenticationHandler');
const { BrowserManager } = require('../dist/browser/BrowserManager');

async function workingMultiStepFlow() {
  console.log('🎯 Working Multi-Step Toca Football Flow');
  console.log('🏠 Navigate to Home → Redirect to Auth → Login → Profiles → Home → POM');
  
  const browserManager = new BrowserManager();
  const authHandler = new AuthenticationHandler();
  const elementDetector = new ElementDetector();
  const methodGenerator = new POMMethodGenerator();
  const codeGenerator = new CodeGenerator();
  
  try {
    console.log('\n📝 Generating POM for Toca Football Home Page...');
    console.log('🌐 Target URL: https://staging.my.tocafootball.com/home');
    console.log('🔐 Login URL: https://staging.my.tocafootball.com/auth/signin/email');
    console.log('👤 Credentials: forkrrish@gmail.com / Toca123!');
    
    // Step 1: Initialize browser
    console.log('\n📋 Step 1: Initialize browser');
    const browser = await browserManager.initializeBrowser({ name: 'chrome', headless: false });
    
    // Step 2: Navigate to home page (will redirect to auth)
    console.log('\n📋 Step 2: Navigate to home page');
    await browser.get('https://staging.my.tocafootball.com/home');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = await browser.getCurrentUrl();
    console.log('🔗 Current URL:', currentUrl);
    
    // Step 3: Handle login if redirected to auth
    if (currentUrl.includes('auth')) {
      console.log('\n📋 Step 3: Handle login');
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
      console.log('✅ Login successful');
      
      // Step 4: Navigate to home page after login
      console.log('\n📋 Step 4: Navigate to home page');
      await browser.get('https://staging.my.tocafootball.com/home');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('✅ Navigation to home successful');
      console.log('🔗 Final URL:', await browser.getCurrentUrl());
      console.log('📄 Page title:', await browser.getTitle());
      
      // Step 5: Detect elements
      console.log('\n📋 Step 5: Detect elements');
      const elements = await elementDetector.detectElements(browser);
      console.log(`📊 Elements detected: ${elements.length}`);
      
      // Step 6: Generate methods
      console.log('\n📋 Step 6: Generate methods');
      const methods = await methodGenerator.generateMethods(elements, {
        framework: 'playwright',
        language: 'typescript',
        includeWaitStrategies: true,
        includeErrorHandling: true
      });
      console.log(`🔧 Methods generated: ${methods.length}`);
      
      // Step 7: Generate code
      console.log('\n📋 Step 7: Generate code');
      const code = await codeGenerator.generateCode(elements, methods, {
        framework: 'playwright',
        language: 'typescript',
        includeComments: true
      });
      
      // Step 8: Create POM object
      console.log('\n📋 Step 8: Create POM object');
      const pom = {
        id: 'toca-football-home-pom',
        url: 'https://staging.my.tocafootball.com/home',
        version: '1.0.0',
        framework: 'playwright',
        language: 'typescript',
        elements,
        methods,
        imports: code.imports,
        className: 'StagingmytocafootballcomHomePage',
        generatedAt: new Date(),
        metadata: {
          pageTitle: await browser.getTitle(),
          loginRequired: true,
          authenticationMethod: 'basic',
          browser: 'chrome',
          userAgent: await browser.executeScript('return navigator.userAgent;'),
          viewport: { width: 1920, height: 1080 },
          timestamp: new Date(),
        }
      };
      
      // Step 9: Display results
      console.log('\n🎉 SUCCESS! POM generated successfully!');
      console.log('='.repeat(60));
      console.log(`📊 Elements detected: ${elements.length}`);
      console.log(`🔧 Methods generated: ${methods.length}`);
      console.log(`📄 Page title: ${pom.metadata.pageTitle}`);
      console.log(`🌐 Final URL: ${pom.url}`);
      console.log('='.repeat(60));
      
      // Display generated code
      console.log('\n📄 Generated POM Class:');
      console.log('='.repeat(60));
      
      // Show imports
      console.log('// Imports');
      pom.imports.forEach(import_ => console.log(import_));
      console.log();
      
      // Show class definition
      console.log(`export class ${pom.className} {`);
      console.log(`  constructor(private page: Page) {}`);
      console.log();
      
      // Show all methods
      pom.methods.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      console.log('}');
      console.log('='.repeat(60));
      
      // Show usage example
      console.log('\n📋 How to Use the Generated POM:');
      console.log('='.repeat(60));
      console.log(`import { ${pom.className} } from './generated/${pom.className}.ts';`);
      console.log('import { Page } from "playwright";');
      console.log();
      console.log('async function testTocaFootballHome(page: Page) {');
      console.log(`  const homePage = new ${pom.className}(page);`);
      console.log();
      console.log('  // Navigate to the home page (login handled automatically)');
      console.log('  await page.goto("https://staging.my.tocafootball.com/home");');
      console.log();
      console.log('  // Use the generated methods');
      if (pom.methods.length > 0) {
        const sampleMethod = pom.methods[0];
        console.log(`  await homePage.${sampleMethod.name}();`);
      }
      console.log('  const title = await homePage.getPageTitle();');
      console.log('  const screenshotPath = await homePage.takeScreenshot();');
      console.log('}');
      console.log('='.repeat(60));
      
      console.log('\n🎉 MULTI-STEP FLOW SUCCESSFUL!');
      console.log('✅ Step 1: Navigate to /home (redirects to /auth)');
      console.log('✅ Step 2: Login at /auth/signin/email');
      console.log('✅ Step 3: Redirect to /profiles');
      console.log('✅ Step 4: Navigate to /home');
      console.log('✅ Step 5: Generate POM for /home page');
      console.log('✅ Framework: Playwright + TypeScript');
      console.log('✅ Real-world Application: Toca Football Staging');
      
    } else {
      console.log('⚠️  Not redirected to auth page');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await browserManager.cleanup();
  }
}

// Run the example
workingMultiStepFlow().catch(console.error); 