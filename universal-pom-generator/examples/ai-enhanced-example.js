const { UniversalPOMGenerator } = require('../dist/index');

async function aiEnhancedExample() {
  console.log('🚀 Universal POM Generator - AI-Enhanced Example');
  
  // Initialize the generator
  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  try {
    // Generate POM with AI enhancements
    console.log('\n📝 Generating AI-enhanced POM...');
    
    const result = await generator.generatePOM('https://example.com/dashboard', {
      framework: 'selenium',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'oauth2',
        credentials: {
          clientId: 'your_client_id',
          clientSecret: 'your_client_secret',
          redirectUri: 'https://example.com/callback'
        }
      },
      llmIntegration: {
        provider: 'openai',
        apiKey: 'your_openai_api_key',
        model: 'gpt-4',
        temperature: 0.7
      },
      mcpIntegration: {
        serverUrl: 'https://mcp-server.example.com',
        tools: ['pom_generation', 'element_detection', 'pom_updates'],
        contextManagement: true
      },
      browser: {
        name: 'chrome',
        headless: true
      }
    });

    if (result.success) {
      console.log('✅ AI-enhanced POM generated successfully!');
      console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
      console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
      console.log(`⏱️  Generation time: ${result.metadata.generationTime}ms`);
      console.log(`🤖 LLM enhanced: ${result.pom.metadata.llmEnhanced}`);
      console.log(`🧠 MCP enhanced: ${result.pom.metadata.mcpEnhanced}`);
      
      // Display AI-enhanced code
      console.log('\n📄 AI-Enhanced POM Code:');
      console.log('='.repeat(50));
      
      // Show imports
      console.log('// AI-Enhanced Imports');
      result.pom.imports.forEach(import_ => console.log(import_));
      console.log();
      
      // Show class definition
      console.log(`export class ${result.pom.className} {`);
      console.log(`  constructor(private driver: WebDriver) {}`);
      console.log();
      
      // Show AI-enhanced methods
      result.pom.methods.forEach(method => {
        console.log(`  ${method.name}(): ${method.returnType} {`);
        console.log(`    // ${method.description}`);
        console.log(`    ${method.body}`);
        console.log(`  }`);
        console.log();
      });
      
      console.log('}');
      console.log('='.repeat(50));
      
      // Show AI enhancements
      console.log('\n🤖 AI Enhancements Applied:');
      console.log(`- LLM Provider: ${result.pom.metadata.llmProvider}`);
      console.log(`- LLM Model: ${result.pom.metadata.llmModel}`);
      console.log(`- MCP Tools: ${result.pom.metadata.mcpTools?.join(', ')}`);
      console.log(`- MCP Server: ${result.pom.metadata.mcpServerUrl}`);
      
    } else {
      console.error('❌ AI-enhanced POM generation failed:', result.errors);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

// Run the example
aiEnhancedExample().catch(console.error); 