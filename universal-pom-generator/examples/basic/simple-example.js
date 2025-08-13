/**
 * Simple Example - Basic POM Generation
 * 
 * This example demonstrates how to generate a POM for a public website
 * without authentication requirements.
 */

const { UniversalPOMGenerator } = require('../../dist/index');

async function simpleExample() {
  console.log('🌐 Simple POM Generation Example');
  console.log('================================\n');

  try {
    // Initialize the generator
    const generator = new UniversalPOMGenerator({
      logLevel: 'info'
    });

    // Generate POM for a public website
    const result = await generator.generatePOM('https://example.com', {
      framework: 'playwright',
      language: 'typescript',
      browser: {
        name: 'chrome',
        headless: true
      },
      codeGeneration: {
        generateTests: true,
        generateInterfaces: true,
        generateDocumentation: true
      }
    });

    if (result.success) {
      console.log('✅ POM Generation Successful!');
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`⏱️  Generation time: ${result.metadata.generationTime}ms`);
      
      console.log('\n📁 Generated Files:');
      console.log(`   - Main POM: ${result.pom.className}.ts`);
      console.log(`   - Test Suite: ${result.pom.className}.test.ts`);
      console.log(`   - Metadata: ${result.pom.className}.metadata.json`);
      
      console.log('\n🎉 Example completed successfully!');
    } else {
      console.log('❌ POM Generation Failed!');
      console.log('Errors:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error during POM generation:', error);
  }
}

// Run the example
if (require.main === module) {
  simpleExample().catch(console.error);
}

module.exports = { simpleExample }; 