const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

// 🎯 TEST AI-POWERED POM GENERATION
// This tests the AI-powered POM generation via MCP

async function testAIPOMGeneration() {
  console.log('🎯 Testing AI-Powered POM Generation');
  console.log('📝 This demonstrates AI-generated POM code for different frameworks\n');

  try {
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Test URL
    const targetUrl = 'https://httpbin.org/forms/post';
    
    // Test different frameworks and languages
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
      },
      {
        name: 'Puppeteer JavaScript',
        framework: 'puppeteer',
        language: 'javascript',
        description: 'Testing Puppeteer with JavaScript'
      },
      {
        name: 'TestCafe JavaScript',
        framework: 'testcafe',
        language: 'javascript',
        description: 'Testing TestCafe with JavaScript'
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
          tools: ['generate_pom_with_ai', 'detect_page_elements'],
          contextManagement: true,
          aiConfig: {
            provider: 'openai',
            apiKey: 'test-api-key',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 2000
          }
        }
      };
      
      console.log('📊 Generating POM with AI...');
      const result = await generator.generatePOM(targetUrl, options);
      
      if (result.success) {
        console.log('✅ POM Generation Successful!');
        console.log(`📄 Class Name: ${result.pom.className}`);
        console.log(`🔧 Framework: ${result.pom.framework}`);
        console.log(`💻 Language: ${result.pom.language}`);
        console.log(`📦 Elements: ${result.pom.elements.length}`);
        console.log(`⚙️  Methods: ${result.pom.methods.length}`);
        console.log(`📚 Imports: ${result.pom.imports.length}`);
        
        // Show generated code
        console.log('\n📝 Generated Code:');
        console.log('='.repeat(50));
        console.log(result.pom.generatedCode);
        console.log('='.repeat(50));
        
        // Show metadata
        console.log('\n📊 Metadata:');
        console.log(`  AI Enhanced: ${result.pom.metadata.llmEnhanced || false}`);
        console.log(`  AI Provider: ${result.pom.metadata.llmProvider || 'N/A'}`);
        console.log(`  AI Model: ${result.pom.metadata.llmModel || 'N/A'}`);
        console.log(`  Generation Time: ${result.metadata.generationTime}ms`);
        
        // Generate files
        console.log('\n📁 Generating files...');
        const fileGenerator = new FileGenerator();
        await fileGenerator.generateFiles(result);
        console.log('✅ Files generated successfully!');
        
      } else {
        console.log('❌ POM Generation Failed!');
        console.log('📋 Error Details:');
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
          });
        }
      }
      
      console.log('\n' + '─'.repeat(60));
    }
    
    console.log('\n🎉 AI-Powered POM Generation Test Completed!');
    console.log('💡 The system now uses AI via MCP to generate POM code for each automation tool');
    console.log('🔧 Each framework gets optimized code in its specific language');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testAIPOMGeneration().catch(console.error);
}

module.exports = { testAIPOMGeneration }; 