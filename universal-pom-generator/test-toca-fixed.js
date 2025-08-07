const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST TOCA FOOTBALL FIXED
// This tests the fixed authentication handler with the multi-step Toca Football flow

async function testTocaFixed() {
  console.log('🎯 Testing Toca Football Fixed Flow');
  console.log('📝 This tests the multi-step authentication flow\n');

  try {
    // Generate POM for Toca Football with the complex multi-step login
    const generator = new UniversalPOMGenerator({ 
      logLevel: 'info',
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
    
    console.log('🚀 Generating POM with fixed authentication...\n');
    
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
    
    if (!result.success) {
      console.log('\n❌ POM Generation Failed!');
      console.log('💡 This might be expected if the login selectors need adjustment');
      return;
    }
    
    // Generate files
    console.log('\n📁 Generating files...');
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);
    
    console.log('\n📍 Generated Files:');
    console.log(`📄 POM Class: ${files.pomClassFile}`);
    console.log(`🧪 Test File: ${files.testFile}`);
    console.log(`📊 Metadata: ${files.metadataFile}`);
    
    // Show file contents
    const fs = require('fs');
    
    if (fs.existsSync(files.pomClassFile)) {
      const pomContent = fs.readFileSync(files.pomClassFile, 'utf8');
      console.log('\n📄 POM Class Content:');
      console.log('='.repeat(50));
      console.log(pomContent);
      console.log('='.repeat(50));
    }
    
    console.log('\n🎉 Toca Football flow is working correctly!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testTocaFixed().catch(console.error);
}

module.exports = { testTocaFixed }; 