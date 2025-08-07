const { UniversalPOMGenerator } = require('./dist/index');

// 🎯 TEST UNIVERSAL DETAILED
// This tests the UniversalPOMGenerator with detailed logging

async function testUniversalDetailed() {
  console.log('🎯 Testing Universal POM Generator (Detailed)');
  console.log('📝 This tests with the exact same parameters as the failing test\n');

  try {
    // Use the exact same parameters as the failing test
    const generator = new UniversalPOMGenerator({ 
      logLevel: 'debug', // Use debug level for more detailed logging
      browser: { 
        name: 'chrome', 
        headless: false // Use non-headless to see what's happening
      }
    });
    
    const targetUrl = 'https://staging.my.tocafootball.com/home';
    const options = {
      framework: 'cypress',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    };
    
    console.log('🚀 Generating POM with detailed logging...\n');
    console.log('📋 Options:', JSON.stringify(options, null, 2));
    
    const result = await generator.generatePOM(targetUrl, options);
    
    console.log('\n📊 Result Analysis:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📄 Generated Code Available: ${!!result.pom?.generatedCode}`);
    console.log(`📊 Elements: ${result.pom?.elements?.length || 0}`);
    console.log(`📝 Methods: ${result.pom?.methods?.length || 0}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    if (!result.success) {
      console.log('\n❌ POM Generation Failed!');
      console.log('💡 This suggests there might be a timing or parameter issue');
      return;
    }
    
    console.log('\n🎉 Universal POM Generator completed successfully!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testUniversalDetailed().catch(console.error);
}

module.exports = { testUniversalDetailed }; 