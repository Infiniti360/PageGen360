const { UniversalPOMGenerator } = require('./dist/index');

async function simpleTest() {
  console.log('🚀 Universal POM Generator - Simple Test');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    // Generate POM for a simple page without authentication
    console.log('\n📝 Generating POM for simple page...');
    
    const result = await generator.generatePOM('https://example.com', {
      framework: 'playwright',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      browser: {
        name: 'chrome',
        headless: true
      }
    });

    if (result.success) {
      console.log('✅ POM generated successfully!');
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`⏱️  Generation time: ${result.metadata.generationTime}ms`);
      
      // Display generated code
      console.log('\n📄 Generated POM Code:');
      console.log('='.repeat(50));
      
      // Show imports
      console.log('// Imports');
      result.pom.imports.forEach(import_ => console.log(import_));
      console.log();
      
      // Show class definition
      console.log(`export class ${result.pom.className} {`);
      console.log(`  constructor(private page: Page) {}`);
      console.log();
      
      // Show methods
      result.pom.methods.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      console.log('}');
      console.log('='.repeat(50));
      
    } else {
      console.error('❌ POM generation failed:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the test
simpleTest().catch(console.error); 