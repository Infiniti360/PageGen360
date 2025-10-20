const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST SIMPLE CYPRESS
// This tests Cypress generation without login

async function testSimpleCypress() {
  console.log('🎯 Testing Simple Cypress Generation');
  console.log('📝 This tests Cypress generation without login\n');

  try {
    // Generate POM for a simple page with Cypress
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const targetUrl = 'https://example.com';
    const options = {
      framework: 'cypress',
      language: 'typescript',
      browser: { name: 'chrome', headless: true }, // Use headless to avoid browser issues
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    console.log('🚀 Generating Cypress POM...\n');
    
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
    
    console.log('\n🎉 Cypress code generation is working correctly!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testSimpleCypress().catch(console.error);
}

module.exports = { testSimpleCypress }; 