const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');
const { CodeGenerator } = require('./dist/core/CodeGenerator');

// 🎯 TEST CYPRESS CODE GENERATION
// This tests Cypress-specific POM generation

async function testCypressGeneration() {
  console.log('🎯 Testing Cypress Code Generation');
  console.log('📝 This tests Cypress-specific POM generation\n');

  try {
    // Generate POM for a simple page with Cypress
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const targetUrl = 'https://example.com';
    const options = {
      framework: 'cypress',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    console.log('🚀 Generating Cypress POM...\n');
    
    const result = await generator.generatePOM(targetUrl, options);
    
    if (result.success) {
      console.log('✅ POM Generation Successful!');
      console.log(`📊 Found ${result.pom.elements.length} elements`);
      console.log(`📝 Generated ${result.pom.methods.length} methods`);
      console.log(`🛠️ Framework: ${result.pom.framework}`);
      console.log(`💻 Language: ${result.pom.language}`);
      console.log(`📄 Generated Code Available: ${!!result.pom.generatedCode}`);
      
      if (result.pom.generatedCode) {
        console.log(`📄 Generated Code Length: ${result.pom.generatedCode.length} characters`);
        console.log('📄 Generated Code Preview:');
        console.log('='.repeat(50));
        console.log(result.pom.generatedCode.substring(0, 300) + '...');
        console.log('='.repeat(50));
      }
      
      // Test CodeGenerator directly
      console.log('\n🔍 Testing CodeGenerator directly...');
      const codeGenerator = new CodeGenerator();
      const codeResult = await codeGenerator.generateCode(result.pom.elements, result.pom.methods, options);
      console.log(`📄 CodeGenerator imports: ${codeResult.imports.length} imports`);
      console.log(`📄 CodeGenerator className: ${codeResult.className}`);
      console.log(`📄 CodeGenerator code length: ${codeResult.code.length} characters`);
      console.log('📄 CodeGenerator code preview:');
      console.log('='.repeat(50));
      console.log(codeResult.code.substring(0, 300) + '...');
      console.log('='.repeat(50));
      
      // Generate files
      console.log('\n📁 Generating Cypress files...');
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
      
      if (fs.existsSync(files.testFile)) {
        const testContent = fs.readFileSync(files.testFile, 'utf8');
        console.log('\n🧪 Test File Content:');
        console.log('='.repeat(50));
        console.log(testContent);
        console.log('='.repeat(50));
      }
      
      console.log('\n🎉 Cypress code generation is working correctly!');
      
    } else {
      console.log('❌ POM Generation Failed!');
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testCypressGeneration().catch(console.error);
}

module.exports = { testCypressGeneration }; 