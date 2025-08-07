const { UniversalPOMGenerator } = require('../dist/index');

async function simpleExample() {
  console.log('🚀 Universal POM Generator - Simple Example (No Login)');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    // Generate POM for a simple public page (no authentication required)
    console.log('\n📝 Generating POM for public page...');
    
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
      console.log(`🔐 Login required: ${result.pom.metadata.loginRequired}`);
      
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
      
      // Show first few methods (to avoid overwhelming output)
      const methodsToShow = result.pom.methods.slice(0, 10);
      methodsToShow.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      if (result.pom.methods.length > 10) {
        console.log(`  // ... and ${result.pom.methods.length - 10} more methods`);
        console.log();
      }
      
      console.log('}');
      console.log('='.repeat(50));
      
    } else {
      console.error('❌ POM generation failed:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the example
simpleExample().catch(console.error); 