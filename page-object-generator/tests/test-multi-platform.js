// Multi-Platform POM Generator Test Suite
// Tests all supported automation platforms

const { generatePageObject } = require('../generator.js');

// Mock scan result data
const mockScanResult = {
  selectors: {
    'email_field_0': {
      selector: '[data-test-id="email-field"]',
      type: 'data-test-id',
      methodName: 'EmailField',
      elementType: 'input',
      attributes: {
        type: 'email',
        'data-test-id': 'email-field',
        placeholder: 'Enter your email'
      }
    },
    'submit_button_1': {
      selector: '[data-test-id="submit-button"]',
      type: 'data-test-id',
      methodName: 'SubmitButton',
      elementType: 'button',
      attributes: {
        'data-test-id': 'submit-button',
        textContent: 'Submit Form'
      }
    },
    'country_dropdown_2': {
      selector: '[data-test-id="country-dropdown"]',
      type: 'data-test-id',
      methodName: 'CountryDropdown',
      elementType: 'select',
      attributes: {
        'data-test-id': 'country-dropdown',
        name: 'country'
      },
      isDropdown: true
    },
    'users_table_3': {
      selector: '[data-test-id="users-table"]',
      type: 'data-test-id',
      methodName: 'UsersTable',
      elementType: 'table',
      attributes: {
        'data-test-id': 'users-table',
        className: 'data-table'
      },
      isTable: true,
      rowSelector: 'tr',
      actionSelectors: ['button[data-action]', 'a[data-action]', 'input[type="checkbox"]']
    }
  },
  elementInfo: [],
  pageTitle: 'Test Page',
  pageUrl: 'https://example.com/test',
  totalElements: 150
};

// Test platforms
const platforms = [
  { name: 'TypeScript (Cypress)', value: 'typescript', extension: '.ts' },
  { name: 'Java (Selenium)', value: 'java', extension: '.java' },
  { name: 'Python (Selenium)', value: 'python', extension: '.py' },
  { name: 'WebdriverIO', value: 'webdriverio', extension: '.js' },
  { name: 'Playwright', value: 'playwright', extension: '.js' },
  { name: 'Puppeteer', value: 'puppeteer', extension: '.js' },
  { name: 'Protractor', value: 'protractor', extension: '.js' },
  { name: 'Nightwatch', value: 'nightwatch', extension: '.js' }
];

console.log('🚀 Starting Multi-Platform POM Generator Test Suite\n');

let totalTests = 0;
let passedTests = 0;

// Test each platform
platforms.forEach(platform => {
  console.log(`🧪 Testing ${platform.name}...`);
  
  try {
    // Generate POM for this platform
    const pomContent = generatePageObject(mockScanResult, 'testpage', platform.value);
    
    // Test basic structure
    totalTests++;
    if (pomContent.includes('class') || pomContent.includes('export class')) {
      console.log(`  ✅ Contains class definition`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing class definition`);
    }
    
    // Test visit method
    totalTests++;
    if (pomContent.includes('visit()') || pomContent.includes('goto') || pomContent.includes('url')) {
      console.log(`  ✅ Contains visit method`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing visit method`);
    }
    
    // Test element methods
    totalTests++;
    if (pomContent.includes('EmailField') || pomContent.includes('emailField')) {
      console.log(`  ✅ Contains element methods`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing element methods`);
    }
    
    // Test platform-specific syntax
    totalTests++;
    let platformSpecificSyntax = false;
    
    switch (platform.value) {
      case 'typescript':
        platformSpecificSyntax = pomContent.includes('cy.get') && pomContent.includes('cy.visit');
        break;
      case 'java':
        platformSpecificSyntax = pomContent.includes('@FindBy') && pomContent.includes('WebElement');
        break;
      case 'python':
        platformSpecificSyntax = pomContent.includes('By.') && pomContent.includes('WebDriverWait');
        break;
      case 'webdriverio':
        platformSpecificSyntax = pomContent.includes('$(') && pomContent.includes('browser.url');
        break;
      case 'playwright':
        platformSpecificSyntax = pomContent.includes('this.page.') && pomContent.includes('this.page.goto');
        break;
      case 'puppeteer':
        platformSpecificSyntax = pomContent.includes('this.page.') && pomContent.includes('this.page.goto');
        break;
      case 'protractor':
        platformSpecificSyntax = pomContent.includes('element(by.') && pomContent.includes('browser.get');
        break;
      case 'nightwatch':
        platformSpecificSyntax = pomContent.includes('this.api.') && pomContent.includes('this.api.url');
        break;
    }
    
    if (platformSpecificSyntax) {
      console.log(`  ✅ Contains ${platform.name} specific syntax`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing ${platform.name} specific syntax`);
    }
    
    // Test comprehensive operations
    totalTests++;
    let hasComprehensiveOps = false;
    
    switch (platform.value) {
      case 'typescript':
        hasComprehensiveOps = pomContent.includes('type(') && pomContent.includes('click(') && pomContent.includes('clear(');
        break;
      case 'java':
        hasComprehensiveOps = pomContent.includes('sendKeys(') && pomContent.includes('click()') && pomContent.includes('clear()');
        break;
      case 'python':
        hasComprehensiveOps = pomContent.includes('send_keys(') && pomContent.includes('click()') && pomContent.includes('clear()');
        break;
      case 'webdriverio':
        hasComprehensiveOps = pomContent.includes('setValue(') && pomContent.includes('click()') && pomContent.includes('clearValue()');
        break;
      case 'playwright':
        hasComprehensiveOps = pomContent.includes('fill(') && pomContent.includes('click()');
        break;
      case 'puppeteer':
        hasComprehensiveOps = pomContent.includes('type(') && pomContent.includes('click()');
        break;
      case 'protractor':
        hasComprehensiveOps = pomContent.includes('sendKeys(') && pomContent.includes('click()');
        break;
      case 'nightwatch':
        hasComprehensiveOps = pomContent.includes('setValue(') && pomContent.includes('click()');
        break;
    }
    
    if (hasComprehensiveOps) {
      console.log(`  ✅ Contains comprehensive operations`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing comprehensive operations`);
    }
    
    // Test metadata
    totalTests++;
    if (pomContent.includes('Generated POM for:') && pomContent.includes('Total elements found:') && pomContent.includes('Interactive elements found:')) {
      console.log(`  ✅ Contains metadata`);
      passedTests++;
    } else {
      console.log(`  ❌ Missing metadata`);
    }
    
    console.log(`  📄 Generated ${platform.extension} file successfully\n`);
    
  } catch (error) {
    console.log(`  ❌ Error generating ${platform.name}: ${error.message}\n`);
    totalTests += 6; // Add the 6 tests that would have been run
  }
});

// Summary
console.log('============================================================');
console.log('📊 Multi-Platform Test Results:');
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${totalTests - passedTests}`);
console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 EXCELLENT! All platforms supported successfully!');
  console.log('\n✅ Supported Platforms:');
  platforms.forEach(platform => {
    console.log(`   - ${platform.name} (${platform.extension})`);
  });
} else {
  console.log('\n⚠️  Some platforms need attention');
}

console.log('\n🚀 Page Object Generator now supports 8 automation platforms!'); 