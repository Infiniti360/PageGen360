const { AuthenticationHandler } = require('./dist/auth/AuthenticationHandler');
const { Builder } = require('selenium-webdriver');

// 🎯 TEST AUTH HANDLER
// This tests the authentication handler directly

async function testAuthHandler() {
  console.log('🎯 Testing Authentication Handler Directly');
  console.log('📝 This tests the authentication handler with the exact same logic\n');

  let driver = null;
  
  try {
    // Initialize browser
    driver = await new Builder().forBrowser('chrome').build();
    
    const authHandler = new AuthenticationHandler();
    
    const loginConfig = {
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
    };
    
    console.log('🚀 Testing authentication handler...\n');
    
    const result = await authHandler.handleLogin('https://staging.my.tocafootball.com/home', loginConfig, driver);
    
    console.log('📊 Authentication Result:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📄 Type: ${result.type}`);
    
    // Check if we're on the expected page
    const currentUrl = await driver.getCurrentUrl();
    console.log(`🌐 Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('profiles')) {
      console.log('✅ Successfully redirected to profiles page!');
      
      // Now navigate to the home page for POM generation
      console.log('\n🚀 Navigating to home page for POM generation...');
      await driver.get('https://staging.my.tocafootball.com/home');
      
      const homeUrl = await driver.getCurrentUrl();
      const homeTitle = await driver.getTitle();
      console.log(`🌐 Home URL: ${homeUrl}`);
      console.log(`📄 Home Title: ${homeTitle}`);
      
      console.log('\n🎉 Authentication and navigation completed successfully!');
      
    } else {
      console.log('❌ Not redirected to profiles page');
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  } finally {
    if (driver) {
      try {
        await driver.quit();
        console.log('\n✅ Browser closed');
      } catch (error) {
        console.log('⚠️  Error closing browser:', error.message);
      }
    }
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testAuthHandler().catch(console.error);
}

module.exports = { testAuthHandler }; 