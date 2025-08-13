const { Builder, By, until } = require('selenium-webdriver');

// 🎯 DEBUG AUTH PROCESS
// This script will trace the authentication process step by step

async function debugAuthProcess() {
  console.log('🎯 Debugging Authentication Process');
  console.log('📝 This will trace the authentication process step by step\n');

  let driver = null;
  
  try {
    // Initialize browser
    driver = await new Builder().forBrowser('chrome').build();
    
    const targetUrl = 'https://staging.my.tocafootball.com/home';
    const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
    
    console.log(`🚀 Step 1: Navigating to target URL: ${targetUrl}`);
    await driver.get(targetUrl);
    
    const currentUrl1 = await driver.getCurrentUrl();
    const title1 = await driver.getTitle();
    console.log(`📄 Current URL: ${currentUrl1}`);
    console.log(`📄 Page Title: ${title1}`);
    
    console.log(`\n🚀 Step 2: Navigating to login URL: ${loginUrl}`);
    await driver.get(loginUrl);
    
    const currentUrl2 = await driver.getCurrentUrl();
    const title2 = await driver.getTitle();
    console.log(`📄 Current URL: ${currentUrl2}`);
    console.log(`📄 Page Title: ${title2}`);
    
    // Wait for page to load
    await driver.wait(until.titleContains(''), 10000);
    
    console.log('\n🔍 Step 3: Looking for email field...');
    
    // Try the exact selector from our debug
    const emailSelectors = [
      'input[name="email"][type="email"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[type="text"]'
    ];
    
    let emailField = null;
    for (const selector of emailSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        emailField = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found email field with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!emailField) {
      console.log('\n❌ Could not find email field with any selector');
      
      // Get all input elements for debugging
      const allInputs = await driver.findElements(By.tagName('input'));
      console.log(`\n📝 Found ${allInputs.length} input elements on page:`);
      
      for (let i = 0; i < allInputs.length; i++) {
        try {
          const input = allInputs[i];
          const type = await input.getAttribute('type');
          const name = await input.getAttribute('name');
          const id = await input.getAttribute('id');
          const placeholder = await input.getAttribute('placeholder');
          
          console.log(`  Input ${i + 1}: type="${type}", name="${name}", id="${id}", placeholder="${placeholder}"`);
        } catch (error) {
          console.log(`  Error getting input ${i + 1} details: ${error.message}`);
        }
      }
      
      return;
    }
    
    console.log('\n🔍 Step 4: Looking for password field...');
    
    const passwordSelectors = [
      'input[name="password"][type="password"]',
      'input[type="password"]',
      'input[name="password"]'
    ];
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        passwordField = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found password field with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!passwordField) {
      console.log('\n❌ Could not find password field with any selector');
      return;
    }
    
    console.log('\n🔍 Step 5: Looking for submit button...');
    
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Sign In")',
      'button:contains("Login")'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        submitButton = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found submit button with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!submitButton) {
      console.log('\n❌ Could not find submit button with any selector');
      
      // Get all button elements for debugging
      const allButtons = await driver.findElements(By.tagName('button'));
      console.log(`\n📝 Found ${allButtons.length} button elements on page:`);
      
      for (let i = 0; i < allButtons.length; i++) {
        try {
          const button = allButtons[i];
          const type = await button.getAttribute('type');
          const text = await button.getText();
          const id = await button.getAttribute('id');
          
          console.log(`  Button ${i + 1}: type="${type}", text="${text}", id="${id}"`);
        } catch (error) {
          console.log(`  Error getting button ${i + 1} details: ${error.message}`);
        }
      }
      
      return;
    }
    
    console.log('\n✅ All elements found! Authentication should work.');
    console.log('\n🎯 RECOMMENDED SELECTORS:');
    console.log('Email field: input[name="email"][type="email"]');
    console.log('Password field: input[name="password"][type="password"]');
    console.log('Submit button: button[type="submit"]');
    
  } catch (error) {
    console.error('💥 Debug error:', error.message);
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

// 🚀 RUN THE DEBUG
if (require.main === module) {
  debugAuthProcess().catch(console.error);
}

module.exports = { debugAuthProcess }; 