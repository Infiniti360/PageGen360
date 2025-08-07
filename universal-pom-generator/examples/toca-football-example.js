const { UniversalPOMGenerator } = require('../dist/index');

async function tocaFootballExample() {
  console.log('⚽ Universal POM Generator - Toca Football Example');
  console.log('🔐 Authentication Required Example');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    console.log('\n📝 Generating POM for Toca Football Profiles Page...');
    console.log('🌐 Target URL: https://staging.my.tocafootball.com/profiles');
    console.log('🔐 Login URL: https://staging.my.tocafootball.com/auth/signin/email');
    
    const result = await generator.generatePOM('https://staging.my.tocafootball.com/profiles', {
      framework: 'playwright',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      browser: {
        name: 'chrome',
        headless: false, // Set to false to see the browser in action
        slowMo: 1000 // Slow down for better visibility
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
      console.log('\n✅ POM generated successfully!');
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`⏱️  Generation time: ${result.metadata.generationTime}ms`);
      console.log(`🔐 Login required: ${result.pom.metadata.loginRequired}`);
      console.log(`📄 Page title: ${result.pom.metadata.pageTitle}`);
      
      // Display generated code
      console.log('\n📄 Generated POM Code:');
      console.log('='.repeat(60));
      
      // Show imports
      console.log('// Imports');
      result.pom.imports.forEach(import_ => console.log(import_));
      console.log();
      
      // Show class definition
      console.log(`export class ${result.pom.className} {`);
      console.log(`  constructor(private page: Page) {}`);
      console.log();
      
      // Show first few methods (to avoid overwhelming output)
      const methodsToShow = result.pom.methods.slice(0, 15);
      methodsToShow.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      if (result.pom.methods.length > 15) {
        console.log(`  // ... and ${result.pom.methods.length - 15} more methods`);
        console.log();
      }
      
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
tocaFootballExample().catch(console.error); 