const { UniversalPOMGenerator } = require('./dist/core/UniversalPOMGenerator');
const fs = require('fs');

async function generateTocaPOM() {
  try {
    console.log('🚀 Starting TOCA Football POM Generation...');
    
    // Initialize the enhanced POM generator
    const generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    // Load configuration
    const config = JSON.parse(fs.readFileSync('./pom-config.json', 'utf8'));
    
    console.log('📋 Configuration loaded');
    console.log(`🎯 Target URL: ${config.url}`);
    console.log(`🔐 Login URL: ${config.loginConfig.loginUrl}`);
    console.log(`�� Username: ${config.loginConfig.username}`);

    // Generate POM with authentication
    console.log('⏳ Generating POM with authentication...');
    const result = await generator.generatePOM(config.url, {
      framework: config.framework,
      language: config.language,
      browser: config.browser,
      loginConfig: config.loginConfig,
      mcpIntegration: config.mcpIntegration,
      codeGeneration: config.codeGeneration
    });

    if (result.success) {
      console.log('✅ POM Generation Successful!');
      console.log(`📊 Generated Class: ${result.pom.className}`);
      console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
      console.log(`⏱️  Generation Time: ${result.metadata.generationTime}ms`);
      console.log(`�� Quality Metrics:`, result.pom.metadata.qualityMetrics);
      
      // Save generated files
      const outputDir = './generated-pom';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Save main POM file
      fs.writeFileSync(
        `${outputDir}/TocaFootballHomePage.ts`,
        result.pom.generatedCode
      );
      
      // Save test file if generated
      if (result.pom.metadata.testCode) {
        fs.writeFileSync(
          `${outputDir}/TocaFootballHomePage.test.ts`,
          result.pom.metadata.testCode
        );
      }
      
      // Save metadata
      fs.writeFileSync(
        `${outputDir}/TocaFootballHomePage.metadata.json`,
        JSON.stringify(result.pom.metadata, null, 2)
      );
      
      console.log('💾 Files saved to ./generated-pom/');
      console.log('📁 Generated files:');
      console.log('   - TocaFootballHomePage.ts');
      console.log('   - TocaFootballHomePage.test.ts');
      console.log('   - TocaFootballHomePage.metadata.json');
      
    } else {
      console.error('❌ POM Generation Failed!');
      console.error('Errors:', result.errors);
    }
    
  } catch (error) {
    console.error('💥 Error during POM generation:', error);
  }
}

// Run the generation
generateTocaPOM().catch(console.error);