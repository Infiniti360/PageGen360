const { UniversalPOMGenerator } = require('../dist/index');

async function playwrightExample() {
  console.log('🚀 Universal POM Generator - Playwright Example');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    // Generate POM with login handling
    console.log('\n📝 Generating POM with login handling...');
    
    const result = await generator.generatePOM('https://www.w3schools.com/jS/js_htmldom_html.asp', {
      framework: 'playwright',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'testuser',
          password: 'testpass'
        }
      },
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

// Run the example
playwrightExample().catch(console.error); 