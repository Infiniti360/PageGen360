const { UniversalPOMGenerator } = require('./dist/index');
const { BrowserManager } = require('./dist/browser/BrowserManager');
const { AuthenticationHandler } = require('./dist/auth/AuthenticationHandler');

// 🎯 TEST UNIVERSAL FLOW
// This tests the exact flow of UniversalPOMGenerator to identify the issue

async function testUniversalFlow() {
  console.log('🎯 Testing Universal POM Generator Flow');
  console.log('📝 This mimics the exact flow to identify the issue\n');

  let browser = null;
  
  try {
    // Initialize components like UniversalPOMGenerator does
    const browserManager = new BrowserManager();
    const authHandler = new AuthenticationHandler();
    
    const url = 'https://staging.my.tocafootball.com/home';
    const options = {
      framework: 'cypress',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    };
    
    console.log('🚀 Step 1: Initialize browser...');
    browser = await browserManager.initializeBrowser(options.browser);
    console.log('✅ Browser initialized');
    
    console.log('\n🚀 Step 2: Navigate to target URL...');
    await browserManager.navigateToPage(url, browser);
    console.log('✅ Initial navigation completed');
    
    console.log('\n🚀 Step 3: Check current URL...');
    const currentUrl = await browser.getCurrentUrl();
    console.log(`📄 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('auth')) {
      console.log('✅ Detected redirect to auth page, handling login...');
      
      try {
        await authHandler.handleLogin(url, options.loginConfig, browser);
        console.log('✅ Authentication handled successfully');
        
        console.log('\n🚀 Step 4: Navigate to target URL after login...');
        await browserManager.navigateToPage(url, browser);
        console.log('✅ Navigation to target page after login completed');
        
        console.log('\n🚀 Step 5: Check final URL...');
        const finalUrl = await browser.getCurrentUrl();
        console.log(`📄 Final URL: ${finalUrl}`);
        
        if (finalUrl.includes('profiles') && url.includes('home')) {
          console.log('✅ Detected profiles page, navigating to home page...');
          await browserManager.navigateToPage(url, browser);
          console.log('✅ Navigation to home page completed');
          
          const homeUrl = await browser.getCurrentUrl();
          console.log(`📄 Home URL: ${homeUrl}`);
        }
        
        console.log('\n🎉 Universal flow completed successfully!');
        
      } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        console.error('🔧 Stack trace:', error.stack);
      }
    } else {
      console.log('❌ No auth redirect detected');
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  } finally {
    if (browser) {
      try {
        await browser.quit();
        console.log('\n✅ Browser closed');
      } catch (error) {
        console.log('⚠️  Error closing browser:', error.message);
      }
    }
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testUniversalFlow().catch(console.error);
}

module.exports = { testUniversalFlow }; 