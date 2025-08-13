const { UniversalPOMGenerator } = require('./dist/index');

/**
 * 🎯 SIMPLE AI-POWERED POM GENERATION TEST
 * 
 * This test demonstrates the AI-powered POM generation feature
 * that extracts DOM elements and sends them to AI for code generation.
 */

async function testAIPOMGeneration() {
  console.log('🎯 Testing AI-Powered POM Generation');
  console.log('📝 This demonstrates AI-generated POM code for different frameworks\n');

  try {
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Test URL
    const targetUrl = 'https://httpbin.org/forms/post';
    
    // Test configurations
    const testConfigs = [
      {
        name: 'Selenium Java',
        framework: 'selenium',
        language: 'java',
        description: 'Testing Selenium with Java'
      },
      {
        name: 'Playwright TypeScript',
        framework: 'playwright',
        language: 'typescript',
        description: 'Testing Playwright with TypeScript'
      },
      {
        name: 'Cypress JavaScript',
        framework: 'cypress',
        language: 'javascript',
        description: 'Testing Cypress with JavaScript'
      }
    ];

    for (const config of testConfigs) {
      console.log(`\n🚀 Testing ${config.name}...`);
      console.log(`📋 ${config.description}\n`);
      
      const options = {
        framework: config.framework,
        language: config.language,
        browser: { name: 'chrome', headless: true },
        includeTests: true,
        includeComments: true,
        includeWaitStrategies: true,
        includeErrorHandling: true,
        mcpIntegration: {
          serverUrl: 'https://mcp-server.example.com',
          tools: ['generate_pom_with_ai'],
          aiConfig: {
            provider: 'openai',
            apiKey: 'test-api-key',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2000
          }
        }
      };
      
      console.log('🤖 Sending DOM to AI for code generation...');
      
      const startTime = Date.now();
      const result = await generator.generatePOM(targetUrl, options);
      const generationTime = Date.now() - startTime;

      if (result.success) {
        console.log('✅ AI Generation Successful!');
        console.log(`⏱️  Generation Time: ${generationTime}ms`);
        console.log(`📄 Class Name: ${result.pom.className}`);
        console.log(`📦 Elements Detected: ${result.pom.elements.length}`);
        console.log(`⚙️  Methods Generated: ${result.pom.methods.length}`);
        console.log(`📚 Import Statements: ${result.pom.imports.length}`);
        
        // Show AI-generated code
        console.log('\n📝 AI-Generated Code:');
        console.log('='.repeat(50));
        console.log(result.pom.generatedCode);
        console.log('='.repeat(50));
        
        // Show metadata
        console.log('\n📊 AI Metadata:');
        console.log(`  AI Enhanced: ${result.pom.metadata.llmEnhanced}`);
        console.log(`  AI Provider: ${result.pom.metadata.llmProvider}`);
        console.log(`  AI Model: ${result.pom.metadata.llmModel}`);
        console.log(`  Framework: ${result.pom.framework}`);
        console.log(`  Language: ${result.pom.language}`);
        
      } else {
        console.log('❌ AI Generation Failed!');
        console.log('📋 Errors:');
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
      console.log('\n' + '─'.repeat(60));
    }
    
    console.log('\n🎉 AI-Powered POM Generation Test Completed!');
    console.log('\n💡 Key Features:');
    console.log('  • DOM elements are extracted from web pages');
    console.log('  • DOM data is sent to AI via MCP for processing');
    console.log('  • AI generates framework-specific code');
    console.log('  • Each automation tool gets optimized code');
    console.log('  • Language-specific patterns and best practices');
    console.log('  • Comprehensive error handling and documentation');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testAIPOMGeneration().catch(console.error);
}

module.exports = { testAIPOMGeneration }; 