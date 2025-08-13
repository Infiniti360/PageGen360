const { UniversalPOMGenerator } = require('../dist/index');

async function tocaFootballUsageExample() {
  console.log('⚽ Toca Football POM Usage Example');
  console.log('🧪 Demonstrating how to use the generated POM');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    console.log('\n📝 Generating POM for Toca Football Home Page...');
    
    const result = await generator.generatePOM('https://staging.my.tocafootball.com/home', {
      framework: 'playwright',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      browser: {
        name: 'chrome',
        headless: false,
        slowMo: 1000
      },
      loginConfig: {
        type: 'basic',
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        selectors: {
          usernameField: 'input[type="email"], input[name="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"], input[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'home'
        }
      }
    });

    if (result.success) {
      console.log('\n✅ POM generated successfully!');
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`📄 Page title: ${result.pom.metadata.pageTitle}`);
      
      // Show how to use the generated POM
      console.log('\n📋 How to Use the Generated POM:');
      console.log('='.repeat(60));
      
      console.log('// 1. Import the generated POM class');
      console.log(`import { ${result.pom.className} } from './generated/${result.pom.className}.ts';`);
      console.log('import { Page } from "playwright";');
      console.log();
      
      console.log('// 2. Create a test function');
      console.log('async function testTocaFootballHomePage(page: Page) {');
      console.log(`  const homePage = new ${result.pom.className}(page);`);
      console.log();
      
      console.log('  // 3. Navigate to the page (login handled automatically)');
      console.log('  await page.goto("https://staging.my.tocafootball.com/home");');
      console.log();
      
      console.log('  // 4. Use the generated methods');
      const sampleMethods = result.pom.methods.slice(0, 5);
      sampleMethods.forEach((method, index) => {
        if (method.name.includes('click')) {
          console.log(`  await homePage.${method.name}(); // Click on ${method.name.replace('click', '').replace(/_/g, ' ')}`);
        } else if (method.name.includes('get')) {
          console.log(`  const element = await homePage.${method.name}(); // Get ${method.name.replace('get', '').replace(/_/g, ' ')} element`);
        } else if (method.name.includes('wait')) {
          console.log(`  await homePage.${method.name}(); // Wait for ${method.name.replace('wait', '').replace(/_/g, ' ')}`);
        }
      });
      console.log();
      
      console.log('  // 5. Verify page title');
      console.log('  const title = await homePage.getPageTitle();');
      console.log('  console.log("Page title:", title);');
      console.log();
      
      console.log('  // 6. Take screenshot');
      console.log('  const screenshotPath = await homePage.takeScreenshot();');
      console.log('  console.log("Screenshot saved:", screenshotPath);');
      console.log('}');
      console.log('='.repeat(60));
      
      // Show the actual generated POM class
      console.log('\n📄 Generated POM Class:');
      console.log('='.repeat(60));
      console.log(`export class ${result.pom.className} {`);
      console.log(`  constructor(private page: Page) {}`);
      console.log();
      
      result.pom.methods.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      console.log('}');
      console.log('='.repeat(60));
      
      // Show test file if generated
      if (result.testFile) {
        console.log('\n🧪 Generated Test File:');
        console.log('='.repeat(60));
        console.log(result.testFile);
        console.log('='.repeat(60));
      }
      
    } else {
      console.error('❌ POM generation failed:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the example
tocaFootballUsageExample().catch(console.error); 