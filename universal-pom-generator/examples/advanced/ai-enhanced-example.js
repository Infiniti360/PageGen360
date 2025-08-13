const { UniversalPOMGenerator } = require('../dist/index');

/**
 * 🎯 AI-ENHANCED POM GENERATION EXAMPLE
 * 
 * This example demonstrates how to use AI via MCP to generate POM code
 * for different automation tools in their specific languages.
 * 
 * The system extracts DOM elements and sends them to AI for intelligent
 * code generation, resulting in framework-optimized POM classes.
 */

async function generateAIPOM() {
  console.log('🎯 AI-Enhanced POM Generation Example');
  console.log('📝 Demonstrating AI-powered code generation for multiple frameworks\n');

  try {
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Example URLs for different types of pages
    const testPages = [
      {
        name: 'Login Page',
        url: 'https://httpbin.org/forms/post',
        description: 'Form-based page with inputs and buttons'
      },
      {
        name: 'E-commerce Page',
        url: 'https://httpbin.org/html',
        description: 'Content-rich page with navigation'
      }
    ];

    // Framework configurations
    const frameworks = [
      {
        name: 'Selenium Java',
        framework: 'selenium',
        language: 'java',
        features: ['WebDriver', 'WebElement', 'By selectors', 'Wait strategies']
      },
      {
        name: 'Playwright TypeScript',
        framework: 'playwright',
        language: 'typescript',
        features: ['Page', 'Locator', 'Auto-waiting', 'TypeScript types']
      },
      {
        name: 'Cypress JavaScript',
        framework: 'cypress',
        language: 'javascript',
        features: ['cy commands', 'Chainable', 'Built-in assertions']
      },
      {
        name: 'Puppeteer JavaScript',
        framework: 'puppeteer',
        language: 'javascript',
        features: ['Page', 'ElementHandle', 'Promise-based', 'Chrome DevTools']
      },
      {
        name: 'TestCafe JavaScript',
        framework: 'testcafe',
        language: 'javascript',
        features: ['Selector', 'Client functions', 'Cross-browser', 'No WebDriver']
      }
    ];

    for (const page of testPages) {
      console.log(`\n🌐 Testing Page: ${page.name}`);
      console.log(`📄 URL: ${page.url}`);
      console.log(`📝 Description: ${page.description}`);
      console.log('─'.repeat(60));

      for (const framework of frameworks) {
        console.log(`\n🔧 Framework: ${framework.name}`);
        console.log(`💻 Language: ${framework.language}`);
        console.log(`✨ Features: ${framework.features.join(', ')}`);
        
        const options = {
          framework: framework.framework,
          language: framework.language,
          browser: { 
            name: 'chrome', 
            headless: true,
            viewport: { width: 1920, height: 1080 }
          },
          includeTests: true,
          includeComments: true,
          includeWaitStrategies: true,
          includeErrorHandling: true,
          mcpIntegration: {
            serverUrl: 'https://mcp-server.example.com',
            tools: [
              'generate_pom_with_ai',
              'detect_page_elements',
              'optimize_pom_code',
              'generate_pom_structure'
            ],
            contextManagement: true,
            aiConfig: {
              provider: 'openai',
              apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
              model: 'gpt-4',
              temperature: 0.7,
              maxTokens: 3000
            }
          }
        };

        console.log('🤖 Sending DOM to AI for code generation...');
        
        const startTime = Date.now();
        const result = await generator.generatePOM(page.url, options);
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
          
          // Show method details
          console.log('\n🔍 Generated Methods:');
          result.pom.methods.forEach((method, index) => {
            console.log(`  ${index + 1}. ${method.name}() - ${method.description}`);
            console.log(`     Return Type: ${method.returnType}`);
            console.log(`     Element ID: ${method.elementId || 'N/A'}`);
          });
          
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
        
        console.log('\n' + '─'.repeat(40));
      }
    }

    console.log('\n🎉 AI-Enhanced POM Generation Complete!');
    console.log('\n💡 Key Benefits:');
    console.log('  • AI generates framework-specific code');
    console.log('  • Language-optimized syntax and patterns');
    console.log('  • Intelligent method naming and organization');
    console.log('  • Best practices for each automation tool');
    console.log('  • Comprehensive error handling and wait strategies');
    console.log('  • Test methods with proper assertions');
    
    console.log('\n🔧 Supported Frameworks:');
    frameworks.forEach(fw => {
      console.log(`  • ${fw.name} (${fw.language})`);
    });

  } catch (error) {
    console.error('💥 Example error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

/**
 * Example usage with specific configuration
 */
async function generateSpecificPOM() {
  console.log('\n🎯 Specific POM Generation Example');
  
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  const options = {
    framework: 'playwright',
    language: 'typescript',
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
        apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 2000
      }
    }
  };

  const result = await generator.generatePOM('https://httpbin.org/forms/post', options);
  
  if (result.success) {
    console.log('✅ Playwright TypeScript POM Generated!');
    console.log('📝 Code Preview:');
    console.log(result.pom.generatedCode.substring(0, 500) + '...');
  }
}

// 🚀 RUN EXAMPLES
if (require.main === module) {
  generateAIPOM()
    .then(() => generateSpecificPOM())
    .catch(console.error);
}

module.exports = { generateAIPOM, generateSpecificPOM }; 