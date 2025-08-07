const { Builder, By, until } = require('selenium-webdriver');

async function testProfilesPage() {
  console.log('🔍 Testing Toca Football Profiles Page');
  
  const driver = await new Builder().forBrowser('chrome').build();
  
  try {
    // First login
    console.log('🔐 Logging in...');
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
    
    // Wait for navigation
    await driver.wait(until.urlContains('profiles'), 30000);
    
    console.log('✅ Login successful');
    console.log('🔗 Current URL:', await driver.getCurrentUrl());
    console.log('📄 Page title:', await driver.getTitle());
    
    // Wait for dynamic content
    console.log('\n⏳ Waiting for dynamic content...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check all elements
    console.log('\n📋 Page Analysis:');
    
    // All elements
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
    
    // Divs with text
    const divs = await driver.findElements(By.css('div'));
    console.log(`📦 Divs: ${divs.length}`);
    let textDivs = 0;
    for (let i = 0; i < Math.min(divs.length, 20); i++) {
      try {
        const text = await divs[i].getText();
        if (text && text.trim().length > 0) {
          console.log(`  ${textDivs + 1}. "${text.trim()}"`);
          textDivs++;
        }
      } catch (error) {
        // Ignore errors for elements that might not be accessible
      }
    }
    
    // Check for interactive elements
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
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  } finally {
    await driver.quit();
  }
}

testProfilesPage().catch(console.error); 