const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST FILE GENERATION
// This demonstrates where POM files are generated

async function testFileGeneration() {
  console.log('🎯 Testing File Generation');
  console.log('📝 Demonstrating where POM files are generated\n');

  try {
    // 🎯 Generate POM
    console.log('🚀 Generating POM... Please wait...\n');
    
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const options = {
      framework: 'playwright',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    const result = await generator.generatePOM('https://example.com', options);
    
    // 🎉 Show results
    console.log('\n🎉 SUCCESS! POM Generated!');
    console.log(`📊 Found ${result.pom.elements.length} elements`);
    console.log(`📝 Generated ${result.pom.methods.length} methods`);
    console.log(`📁 Generated files:`);
    
    // Generate actual files
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);
    
    console.log(`   - POM Class: ${files.pomClassFile}`);
    console.log(`   - Test File: ${files.testFile}`);
    console.log(`   - Metadata: ${files.metadataFile}`);
    
    console.log('\n📝 Generated POM Class Preview:');
    console.log('='.repeat(50));
    console.log(`Class Name: ${result.pom.className}`);
    console.log(`Framework: ${result.pom.framework}`);
    console.log(`Language: ${result.pom.language}`);
    console.log(`Elements: ${result.pom.elements.length}`);
    console.log(`Methods: ${result.pom.methods.length}`);
    console.log('='.repeat(50));
    
    // Show element details
    console.log('\n🔍 Element Details:');
    result.pom.elements.forEach((element, index) => {
      console.log(`${index + 1}. ${element.tagName} - ${element.text?.substring(0, 30) || 'No text'}...`);
    });

    // Show file contents
    console.log('\n📄 File Contents Preview:');
    console.log('='.repeat(50));
    
    const fs = require('fs');
    if (fs.existsSync(files.pomClassFile)) {
      const pomContent = fs.readFileSync(files.pomClassFile, 'utf8');
      console.log('POM Class File:');
      console.log(pomContent.substring(0, 500) + '...');
    }
    
    if (fs.existsSync(files.testFile)) {
      const testContent = fs.readFileSync(files.testFile, 'utf8');
      console.log('\nTest File:');
      console.log(testContent.substring(0, 300) + '...');
    }
    
    if (fs.existsSync(files.metadataFile)) {
      const metadataContent = fs.readFileSync(files.metadataFile, 'utf8');
      console.log('\nMetadata File:');
      console.log(metadataContent.substring(0, 300) + '...');
    }
    
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testFileGeneration().catch(console.error);
}

module.exports = { testFileGeneration }; 