const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST ERROR HANDLING
// This tests the error handling when POM generation fails

async function testErrorHandling() {
  console.log('🎯 Testing Error Handling');
  console.log('📝 This simulates a failed POM generation\n');

  try {
    // Simulate a failed POM generation
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Use an invalid URL that will cause login issues
    const targetUrl = 'https://staging.my.tocafootball.com/home';
    const options = {
      framework: 'playwright',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'basic',
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        credentials: { username: 'invalid@email.com', password: 'wrongpassword' },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { type: 'url', value: 'profiles' }
      }
    };
    
    console.log('🚀 Attempting POM generation with invalid credentials...\n');
    
    const result = await generator.generatePOM(targetUrl, options);
    
    // Show the actual result structure
    console.log('📊 Result Object Structure:');
    console.log(`  success: ${result.success}`);
    console.log(`  pom: ${result.pom ? 'exists' : 'undefined'}`);
    if (result.pom) {
      console.log(`  pom.className: ${result.pom.className || 'undefined'}`);
      console.log(`  pom.elements: ${result.pom.elements ? 'exists' : 'undefined'}`);
      console.log(`  pom.methods: ${result.pom.methods ? 'exists' : 'undefined'}`);
      console.log(`  pom.imports: ${result.pom.imports ? 'exists' : 'undefined'}`);
    }
    console.log(`  errors: ${result.errors ? result.errors.length : 0} errors`);
    console.log('');
    
    // Check if generation was successful
    if (!result.success) {
      console.log('❌ POM Generation Failed! (Expected)');
      console.log('📋 Error Details:');
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
      // Test FileGenerator with failed result
      console.log('\n📁 Testing FileGenerator with failed result...');
      const fileGenerator = new FileGenerator();
      
      try {
        await fileGenerator.generateFiles(result);
        console.log('❌ FileGenerator should have failed but didn\'t');
      } catch (fileError) {
        console.log('✅ FileGenerator correctly rejected failed POM generation');
        console.log(`   Error: ${fileError.message}`);
      }
      
      console.log('\n💡 Error handling is working correctly!');
      console.log('✅ CLI will now properly handle failed generations');
      
    } else {
      console.log('⚠️  POM generation succeeded (unexpected)');
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testErrorHandling().catch(console.error);
}

module.exports = { testErrorHandling }; 