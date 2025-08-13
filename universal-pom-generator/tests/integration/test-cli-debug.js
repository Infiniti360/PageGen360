const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST CLI DEBUG
// This tests the CLI logic to see why FileGenerator is being called

async function testCLIDebug() {
  console.log('🎯 Testing CLI Debug');
  console.log('📝 This tests why FileGenerator is being called when generation fails\n');

  try {
    // Generate POM for Toca Football with login (this will fail)
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
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
          usernameField: 'input[type="email"], input[name="email"], input[type="text"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"], input[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    };
    
    console.log('🚀 Generating POM (this will fail)...\n');
    
    const result = await generator.generatePOM(targetUrl, options);
    
    console.log('📊 Result Analysis:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`📄 Generated Code Available: ${!!result.pom.generatedCode}`);
    console.log(`📊 Elements: ${result.pom.elements?.length || 0}`);
    console.log(`📝 Methods: ${result.pom.methods?.length || 0}`);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Simulate CLI logic
    console.log('\n🔍 Simulating CLI logic...');
    
    if (!result.success) {
      console.log('✅ CLI would return early (success = false)');
      console.log('❌ CLI should NOT call FileGenerator.generateFiles()');
      return;
    }
    
    console.log('❌ CLI would continue to FileGenerator (this should not happen)');
    
    // This should not be reached
    console.log('\n📁 Generating files...');
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);
    
    console.log('\n📍 Generated Files:');
    console.log(`📄 POM Class: ${files.pomClassFile}`);
    console.log(`🧪 Test File: ${files.testFile}`);
    console.log(`📊 Metadata: ${files.metadataFile}`);
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testCLIDebug().catch(console.error);
}

module.exports = { testCLIDebug }; 