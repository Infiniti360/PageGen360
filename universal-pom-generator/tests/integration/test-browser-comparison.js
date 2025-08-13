const { Builder, By } = require('selenium-webdriver');
const { BrowserManager } = require('./dist/browser/BrowserManager');

async function testBrowserComparison() {
  console.log('🔍 Testing Browser Initialization Comparison');
  
  // Test 1: Direct Selenium WebDriver
  console.log('\n📋 Test 1: Direct Selenium WebDriver');
  const directDriver = await new Builder().forBrowser('chrome').build();
  try {
    await directDriver.get('https://staging.my.tocafootball.com/auth/signin/email');
    console.log('✅ Direct driver navigation successful');
    console.log('📄 Page title:', await directDriver.getTitle());
    
    // Test finding email field
    const emailField = await directDriver.findElement(By.css('input[type="email"]'));
    console.log('✅ Direct driver found email field');
  } catch (error) {
    console.error('❌ Direct driver error:', error.message);
  } finally {
    await directDriver.quit();
  }
  
  // Test 2: BrowserManager
  console.log('\n📋 Test 2: BrowserManager');
  const browserManager = new BrowserManager();
  const browserManagerDriver = await browserManager.initializeBrowser({ name: 'chrome', headless: false });
  try {
    await browserManagerDriver.get('https://staging.my.tocafootball.com/auth/signin/email');
    console.log('✅ BrowserManager navigation successful');
    console.log('📄 Page title:', await browserManagerDriver.getTitle());
    
    // Test finding email field
    const emailField = await browserManagerDriver.findElement(By.css('input[type="email"]'));
    console.log('✅ BrowserManager found email field');
  } catch (error) {
    console.error('❌ BrowserManager error:', error.message);
  } finally {
    await browserManagerDriver.quit();
  }
  
  console.log('\n✅ Browser comparison test completed');
}

testBrowserComparison().catch(console.error); 