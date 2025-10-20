const { Builder, By, until } = require('selenium-webdriver');

// 🎯 DEBUG LOGIN PAGE
// This script will inspect the login page to find the correct selectors

async function debugLoginPage() {
  console.log('🎯 Debugging Login Page');
  console.log('📝 This will inspect the login page to find correct selectors\n');

  let driver = null;
  
  try {
    // Initialize browser
    driver = await new Builder().forBrowser('chrome').build();
    
    const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
    console.log(`🚀 Navigating to: ${loginUrl}`);
    
    await driver.get(loginUrl);
    
    // Wait for page to load
    await driver.wait(until.titleContains(''), 10000);
    
    const title = await driver.getTitle();
    console.log(`📄 Page Title: ${title}`);
    
    const currentUrl = await driver.getCurrentUrl();
    console.log(`🌐 Current URL: ${currentUrl}`);
    
    // Get page source for analysis
    const pageSource = await driver.getPageSource();
    console.log(`📄 Page Source Length: ${pageSource.length} characters`);
    
    // Look for input fields
    console.log('\n🔍 Searching for input fields...');
    
    const inputs = await driver.findElements(By.tagName('input'));
    console.log(`📝 Found ${inputs.length} input elements`);
    
    for (let i = 0; i < inputs.length; i++) {
      try {
        const input = inputs[i];
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        const className = await input.getAttribute('class');
        
        console.log(`\n📝 Input ${i + 1}:`);
        console.log(`   Type: ${type}`);
        console.log(`   Name: ${name}`);
        console.log(`   ID: ${id}`);
        console.log(`   Placeholder: ${placeholder}`);
        console.log(`   Class: ${className}`);
        
        // Try to get the CSS selector
        const tagName = await input.getTagName();
        let selector = tagName;
        if (id) selector += `#${id}`;
        if (className) selector += `.${className.split(' ').join('.')}`;
        if (name) selector += `[name="${name}"]`;
        if (type) selector += `[type="${type}"]`;
        
        console.log(`   CSS Selector: ${selector}`);
        
      } catch (error) {
        console.log(`   Error getting input ${i + 1} details: ${error.message}`);
      }
    }
    
    // Look for buttons
    console.log('\n🔍 Searching for buttons...');
    
    const buttons = await driver.findElements(By.tagName('button'));
    console.log(`📝 Found ${buttons.length} button elements`);
    
    for (let i = 0; i < buttons.length; i++) {
      try {
        const button = buttons[i];
        const type = await button.getAttribute('type');
        const text = await button.getText();
        const id = await button.getAttribute('id');
        const className = await button.getAttribute('class');
        
        console.log(`\n📝 Button ${i + 1}:`);
        console.log(`   Type: ${type}`);
        console.log(`   Text: ${text}`);
        console.log(`   ID: ${id}`);
        console.log(`   Class: ${className}`);
        
        // Try to get the CSS selector
        const tagName = await button.getTagName();
        let selector = tagName;
        if (id) selector += `#${id}`;
        if (className) selector += `.${className.split(' ').join('.')}`;
        if (type) selector += `[type="${type}"]`;
        
        console.log(`   CSS Selector: ${selector}`);
        
      } catch (error) {
        console.log(`   Error getting button ${i + 1} details: ${error.message}`);
      }
    }
    
    // Look for forms
    console.log('\n🔍 Searching for forms...');
    
    const forms = await driver.findElements(By.tagName('form'));
    console.log(`📝 Found ${forms.length} form elements`);
    
    for (let i = 0; i < forms.length; i++) {
      try {
        const form = forms[i];
        const action = await form.getAttribute('action');
        const method = await form.getAttribute('method');
        const id = await form.getAttribute('id');
        const className = await form.getAttribute('class');
        
        console.log(`\n📝 Form ${i + 1}:`);
        console.log(`   Action: ${action}`);
        console.log(`   Method: ${method}`);
        console.log(`   ID: ${id}`);
        console.log(`   Class: ${className}`);
        
      } catch (error) {
        console.log(`   Error getting form ${i + 1} details: ${error.message}`);
      }
    }
    
    console.log('\n🎯 RECOMMENDED SELECTORS:');
    console.log('Based on the analysis above, here are the recommended selectors:');
    console.log('(This will be shown after the analysis)');
    
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
  debugLoginPage().catch(console.error);
}

module.exports = { debugLoginPage }; 