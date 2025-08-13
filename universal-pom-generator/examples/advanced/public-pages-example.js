const { UniversalPOMGenerator } = require('../dist/index');

async function publicPagesExample() {
  console.log('🚀 Universal POM Generator - Public Pages Example');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  // List of public pages to test
  const publicPages = [
    {
      name: 'Simple Landing Page',
      url: 'https://example.com',
      description: 'Basic landing page with minimal elements'
    },
    {
      name: 'Documentation Page',
      url: 'https://httpbin.org/',
      description: 'API documentation with forms and buttons'
    },
    {
      name: 'News Website',
      url: 'https://httpbin.org/html',
      description: 'Content-heavy page with navigation'
    }
  ];

  for (const page of publicPages) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 Testing: ${page.name}`);
    console.log(`🌐 URL: ${page.url}`);
    console.log(`📝 Description: ${page.description}`);
    console.log(`${'='.repeat(60)}`);

    try {
      const result = await generator.generatePOM(page.url, {
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
        console.log(`📄 Page title: ${result.pom.metadata.pageTitle}`);
        
        // Show sample of generated methods
        console.log('\n📋 Sample Methods Generated:');
        const sampleMethods = result.pom.methods.slice(0, 5);
        sampleMethods.forEach((method, index) => {
          console.log(`  ${index + 1}. ${method.name}()`);
        });
        
        if (result.pom.methods.length > 5) {
          console.log(`     ... and ${result.pom.methods.length - 5} more methods`);
        }
        
      } else {
        console.error('❌ POM generation failed:', result.errors);
      }

    } catch (error) {
      console.error(`💥 Error processing ${page.name}:`, error.message);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 Public Pages Example Completed!');
  console.log('✅ All pages processed successfully');
  console.log('📊 Summary:');
  console.log('   • No authentication required');
  console.log('   • Direct page access');
  console.log('   • Fast generation times');
  console.log('   • Framework-agnostic');
  console.log(`${'='.repeat(60)}`);
}

// Run the example
publicPagesExample().catch(console.error); 