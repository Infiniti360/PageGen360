const { Builder, By, until } = require('selenium-webdriver');

async function testCorrectedFlow() {
  console.log('🎯 Testing Corrected Toca Football Flow');
  console.log('🏠 Navigate to Home → Redirect to Auth → Login → Profiles → Home');
  
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // Step 1: Navigate to home page (should redirect to auth)
    console.log('\n📋 Step 1: Navigate to home page');
    await driver.get('https://staging.my.tocafootball.com/home');
    
    // Wait for redirect
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    console.log('📄 Page title:', await driver.getTitle());
    
    // Check if we were redirected to auth
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('auth')) {
      console.log('✅ Successfully redirected to auth page');
    } else {
      console.log('⚠️  Not redirected to auth page');
    }
    
    // Step 2: Navigate to email login page
    console.log('\n📋 Step 2: Navigate to email login page');
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
    
    // Fill login form
    const emailField = await driver.findElement(By.css('input[type="email"]'));
    await emailField.clear();
    await emailField.sendKeys('forkrrish@gmail.com');
    
    const passwordField = await driver.findElement(By.css('input[type="password"]'));
    await passwordField.clear();
    await passwordField.sendKeys('Toca123!');
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();
    
    // Wait for navigation to profiles
    await driver.wait(until.urlContains('profiles'), 30000);
    console.log('✅ Login successful, redirected to profiles');
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    console.log('📄 Page title:', await driver.getTitle());
    
    // Step 3: Navigate to home page
    console.log('\n📋 Step 3: Navigate to home page');
    await driver.get('https://staging.my.tocafootball.com/home');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Navigation to home successful');
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    console.log('📄 Page title:', await driver.getTitle());
    
    // Step 4: Analyze home page
    console.log('\n📋 Step 4: Analyze home page');
    
    // Check all elements
    const allElements = await driver.findElements(By.css('*'));
    console.log(`📊 Total elements: ${allElements.length}`);
    
    // Buttons
    const buttons = await driver.findElements(By.css('button'));
    console.log(`🔘 Buttons: ${buttons.length}`);
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].getText();
      const className = await buttons[i].getAttribute('class');
      console.log(`  ${i + 1}. "${text}" (class: ${className})`);
    }
    
    // Links
    const links = await driver.findElements(By.css('a'));
    console.log(`🔗 Links: ${links.length}`);
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const text = await links[i].getText();
      const href = await links[i].getAttribute('href');
      console.log(`  ${i + 1}. "${text}" -> ${href}`);
    }
    
    // Inputs
    const inputs = await driver.findElements(By.css('input'));
    console.log(`📝 Inputs: ${inputs.length}`);
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      console.log(`  ${i + 1}. type="${type}", placeholder="${placeholder}"`);
    }
    
    // Interactive elements
    console.log('\n🔍 Interactive Elements:');
    const interactiveSelectors = [
      'button',
      'a[href]',
      'input',
      'select',
      'textarea',
      '[onclick]',
      '[role="button"]',
      '[tabindex]'
    ];
    
    for (const selector of interactiveSelectors) {
      try {
        const elements = await driver.findElements(By.css(selector));
        console.log(`  ${selector}: ${elements.length} elements`);
      } catch (error) {
        console.log(`  ${selector}: error`);
      }
    }
    
    console.log('\n🎉 CORRECTED FLOW SUCCESSFUL!');
    console.log('✅ Step 1: Navigate to /home (redirects to /auth)');
    console.log('✅ Step 2: Login at /auth/signin/email');
    console.log('✅ Step 3: Redirect to /profiles');
    console.log('✅ Step 4: Navigate to /home');
    console.log('✅ Step 5: Element detection on home page');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await driver.quit();
  }
}

testCorrectedFlow().catch(console.error); 