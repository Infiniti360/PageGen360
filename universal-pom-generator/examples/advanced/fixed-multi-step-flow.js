const { UniversalPOMGenerator } = require('../dist/index');

// 🎯 FIXED MULTI-STEP FLOW FOR COMPLEX REDIRECTS
// This handles the Toca Football flow properly

async function fixedMultiStepFlow() {
  console.log('🎯 Fixed Multi-Step Flow for Complex Redirects');
  console.log('🏠 Navigate to Home → Redirect to Auth → Login → Profiles → Home → POM');

  const generator = new UniversalPOMGenerator({
    logLevel: 'debug' // Enable debug for troubleshooting
  });

  try {
    console.log('\n📝 Generating POM for Toca Football Home Page...');
    console.log('🌐 Target URL: https://staging.my.tocafootball.com/home');
    console.log('🔐 Login URL: https://staging.my.tocafootball.com/auth/signin/email');

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
        slowMo: 2000 // Increased wait time for complex flows
      },
      loginConfig: {
        type: 'basic',
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email', // Direct login URL
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
          value: 'profiles' // Wait for redirect to profiles
        }
      }
    });

    console.log('\n🎉 SUCCESS! POM Generated for Complex Multi-Step Flow!');
    console.log(`📊 Found ${result.elements.length} elements`);
    console.log(`📁 Generated files:`);
    console.log(`   - POM Class: ${result.pomClass ? 'Generated' : 'Not generated'}`);
    console.log(`   - Test File: ${result.testFile ? 'Generated' : 'Not generated'}`);
    console.log(`   - Metadata: ${result.metadata ? 'Generated' : 'Not generated'}`);

    if (result.pomClass) {
      console.log('\n📝 Generated POM Class Preview:');
      console.log('='.repeat(50));
      console.log(result.pomClass.substring(0, 500) + '...');
      console.log('='.repeat(50));
    }

  } catch (error) {
    console.error('\n💥 Error in Fixed Multi-Step Flow:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// 🚀 RUN THE FIXED FLOW
if (require.main === module) {
  fixedMultiStepFlow().catch(console.error);
}

module.exports = { fixedMultiStepFlow }; 