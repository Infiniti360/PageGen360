const { UniversalPOMGenerator } = require('../dist/index');

async function completeTocaFlow() {
  console.log('🎯 Complete Toca Football Flow');
  console.log('🔐 Login → Profiles → Home → POM Generation');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    console.log('\n📝 Generating POM for Toca Football Home Page...');
    console.log('🌐 Target URL: https://staging.my.tocafootball.com/home');
    console.log('🔐 Login URL: https://staging.my.tocafootball.com/auth/signin/email');
    console.log('👤 Credentials: forkrrish@gmail.com / Toca123!');
    console.log('🔄 Flow: Login → Profiles → Home → POM Generation');
    
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
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    });

    if (result.success) {
      console.log('\n🎉 SUCCESS! POM generated successfully!');
      console.log('='.repeat(60));
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`⏱️  Generation time: ${result.metadata.generationTime}ms`);
      console.log(`🔐 Login required: ${result.pom.metadata.loginRequired}`);
      console.log(`📄 Page title: ${result.pom.metadata.pageTitle}`);
      console.log(`🌐 Final URL: ${result.pom.url}`);
      console.log('='.repeat(60));
      
      // Display generated code
      console.log('\n📄 Generated POM Class:');
      console.log('='.repeat(60));
      
      // Show imports
      console.log('// Imports');
      result.pom.imports.forEach(import_ => console.log(import_));
      console.log();
      
      // Show class definition
      console.log(`export class ${result.pom.className} {`);
      console.log(`  constructor(private page: Page) {}`);
      console.log();
      
      // Show all methods
      result.pom.methods.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      console.log('}');
      console.log('='.repeat(60));
      
      // Show usage example
      console.log('\n📋 How to Use the Generated POM:');
      console.log('='.repeat(60));
      console.log(`import { ${result.pom.className} } from './generated/${result.pom.className}.ts';`);
      console.log('import { Page } from "playwright";');
      console.log();
      console.log('async function testTocaFootballHome(page: Page) {');
      console.log(`  const homePage = new ${result.pom.className}(page);`);
      console.log();
      console.log('  // Navigate to the home page (login handled automatically)');
      console.log('  await page.goto("https://staging.my.tocafootball.com/home");');
      console.log();
      console.log('  // Use the generated methods');
      if (result.pom.methods.length > 0) {
        const sampleMethod = result.pom.methods[0];
        console.log(`  await homePage.${sampleMethod.name}();`);
      }
      console.log('  const title = await homePage.getPageTitle();');
      console.log('  const screenshotPath = await homePage.takeScreenshot();');
      console.log('}');
      console.log('='.repeat(60));
      
      console.log('\n🎉 COMPLETE FLOW SUMMARY:');
      console.log('✅ Step 1: Login at /auth/signin/email');
      console.log('✅ Step 2: Redirect to /profiles (profile selection)');
      console.log('✅ Step 3: Navigate to /home (actual home page)');
      console.log('✅ Step 4: Generate POM for /home page');
      console.log('✅ Framework: Playwright + TypeScript');
      console.log('✅ Real-world Application: Toca Football Staging');
      
    } else {
      console.error('❌ POM generation failed:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the example
completeTocaFlow().catch(console.error); 