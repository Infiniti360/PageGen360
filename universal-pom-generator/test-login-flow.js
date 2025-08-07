const { Builder, By, until } = require('selenium-webdriver');

async function testLoginFlow() {
  console.log('🔍 Testing Toca Football Login Flow');
  
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Navigate to login page
    console.log('🌐 Navigating to login page...');
    await driver.get('https://staging.my.tocafootball.com/auth/signin/email');
    
    // Wait for page to load
    await driver.executeScript(`
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
    `);
    
    // Additional wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📄 Page title:', await driver.getTitle());
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    
    // Try to find email field
    console.log('\n🔍 Looking for email field...');
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[type="text"]',
      'input[id*="email"]',
      'input[id*="username"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]'
    ];
    
    let usernameField = null;
    for (const selector of emailSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        usernameField = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!usernameField) {
      throw new Error('Could not find username/email field on login page');
    }
    
    // Fill email
    console.log('\n📝 Filling email field...');
    await usernameField.clear();
    await usernameField.sendKeys('forkrrish@gmail.com');
    
    // Try to find password field
    console.log('\n🔍 Looking for password field...');
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[id*="password"]',
      'input[placeholder*="password"]',
      'input[placeholder*="Password"]'
    ];
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        passwordField = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!passwordField) {
      throw new Error('Could not find password field on login page');
    }
    
    // Fill password
    console.log('\n📝 Filling password field...');
    await passwordField.clear();
    await passwordField.sendKeys('Toca123!');
    
    // Try to find submit button
    console.log('\n🔍 Looking for submit button...');
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Sign In")',
      'button:contains("Login")',
      'button:contains("Submit")'
    ];
    
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        console.log(`  Trying selector: ${selector}`);
        submitButton = await driver.findElement(By.css(selector));
        console.log(`  ✅ Found with selector: ${selector}`);
        break;
      } catch (error) {
        console.log(`  ❌ Not found with selector: ${selector}`);
      }
    }
    
    if (!submitButton) {
      throw new Error('Could not find submit button on login page');
    }
    
    // Click submit
    console.log('\n🔘 Clicking submit button...');
    await submitButton.click();
    
    // Wait a bit and check what happened
    console.log('\n⏳ Waiting for response...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    console.log('📄 Current page title:', await driver.getTitle());
    
    // Check if there are any error messages
    try {
      const errorElements = await driver.findElements(By.css('.error, .alert, .message, [role="alert"]'));
      if (errorElements.length > 0) {
        console.log('⚠️  Error messages found:');
        for (let i = 0; i < errorElements.length; i++) {
          const text = await errorElements[i].getText();
          console.log(`  ${i + 1}. ${text}`);
        }
      }
    } catch (error) {
      console.log('No error messages found');
    }
    
    // Check if we're still on the login page
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('signin') || currentUrl.includes('login')) {
      console.log('⚠️  Still on login page - credentials might be incorrect');
    } else {
      console.log('✅ Successfully navigated away from login page');
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await driver.quit();
  }
}

testLoginFlow().catch(console.error); 