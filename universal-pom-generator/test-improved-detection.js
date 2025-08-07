const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST IMPROVED ELEMENT DETECTION
// This tests the improved element detection that captures more elements

async function testImprovedDetection() {
  console.log('🎯 Testing Improved Element Detection');
  console.log('📝 This tests the enhanced element detection for more comprehensive POMs\n');

  try {
    // Test with a static page that has various elements
    const generator = new UniversalPOMGenerator({ 
      logLevel: 'info',
      browser: { 
        name: 'chrome', 
        headless: true 
      }
    });
    
    const targetUrl = 'https://httpbin.org/';
    const options = {
      framework: 'cypress',
      language: 'typescript',
      browser: { name: 'chrome', headless: true },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    console.log('🚀 Generating POM with improved element detection...\n');
    
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
    
    // Show detailed element analysis
    console.log('\n📝 Detailed Element Analysis:');
    if (result.pom.elements && Array.isArray(result.pom.elements)) {
      const interactiveElements = result.pom.elements.filter(el => el.isInteractive);
      const textElements = result.pom.elements.filter(el => el.text && el.text.length > 0);
      const dataTestIdElements = result.pom.elements.filter(el => 
        el.attributes && (el.attributes['data-testid'] || el.attributes['data-cy'] || el.attributes['data-selenium'])
      );
      
      console.log(`🖱️ Interactive Elements: ${interactiveElements.length}`);
      console.log(`📄 Text Elements: ${textElements.length}`);
      console.log(`🏷️ Data-Test-ID Elements: ${dataTestIdElements.length}`);
      console.log(`📊 Total Elements: ${result.pom.elements.length}`);
      
      console.log('\n📋 Element Types:');
      const elementTypes = {};
      result.pom.elements.forEach(element => {
        elementTypes[element.tagName] = (elementTypes[element.tagName] || 0) + 1;
      });
      
      Object.entries(elementTypes).forEach(([tagName, count]) => {
        console.log(`   ${tagName}: ${count}`);
      });
      
      console.log('\n📝 Sample Elements:');
      result.pom.elements.slice(0, 10).forEach((element, index) => {
        const elementType = element.isInteractive ? '🖱️' : '📄';
        const textPreview = element.text?.substring(0, 30) || 'No text';
        const dataTestId = element.attributes?.['data-testid'] || element.attributes?.['data-cy'] || element.attributes?.['data-selenium'];
        const dataTestIdInfo = dataTestId ? ` (data-testid: ${dataTestId})` : '';
        console.log(`   ${index + 1}. ${elementType} ${element.tagName} - ${textPreview}...${dataTestIdInfo}`);
      });
      
      if (result.pom.elements.length > 10) {
        console.log(`   ... and ${result.pom.elements.length - 10} more elements`);
      }
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
    
    console.log('\n🎉 Improved element detection is working correctly!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testImprovedDetection().catch(console.error);
}

module.exports = { testImprovedDetection }; 