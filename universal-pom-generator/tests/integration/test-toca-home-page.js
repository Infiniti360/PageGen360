const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

/**
 * 🎯 TOCA FOOTBALL HOME PAGE POM GENERATION
 * 
 * This test properly waits for the home page to load completely
 * after login and extracts the correct home page POM.
 */

async function testTocaFootballHomePage() {
  console.log('🎯 Testing Toca Football Home Page POM Generation');
  console.log('📝 Generating POM for https://staging.my.tocafootball.com/home\n');

  try {
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Toca Football URLs
    const targetUrl = 'https://staging.my.tocafootball.com/home';
    const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
    
    console.log('🔐 Login Configuration:');
    console.log(`  Login URL: ${loginUrl}`);
    console.log(`  Username: forkrrish@gmail.com`);
    console.log(`  Target URL: ${targetUrl}`);
    console.log(`  Framework: Playwright`);
    console.log(`  Language: TypeScript`);
    
    const options = {
      framework: 'playwright',
      language: 'typescript',
      browser: { 
        name: 'chrome', 
        headless: false,
        viewport: { width: 1920, height: 1080 }
      },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: {
        type: 'basic',
        loginUrl: loginUrl,
        credentials: { 
          username: 'forkrrish@gmail.com', 
          password: 'Toca123!' 
        },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { 
          type: 'url', 
          value: 'profiles' 
        }
      },
      mcpIntegration: {
        serverUrl: 'https://mcp-server.example.com',
        tools: ['generate_pom_with_ai'],
        aiConfig: {
          provider: 'openai',
          apiKey: process.env.OPENAI_API_KEY || 'test-api-key',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 3000
        }
      }
    };
    
    console.log('\n🤖 Step 1: Login and wait for profiles page...');
    const startTime = Date.now();
    
    // First, login and get to the profiles page
    const profilesResult = await generator.generatePOM('https://staging.my.tocafootball.com/profiles', options);
    
    if (profilesResult.success) {
      console.log('✅ Login successful! Redirected to profiles page.');
      console.log(`📄 Profiles Page Class: ${profilesResult.pom.className}`);
      console.log(`📦 Elements Detected: ${profilesResult.pom.elements.length}`);
      console.log(`⚙️  Methods Generated: ${profilesResult.pom.methods.length}`);
      
      console.log('\n🤖 Step 2: Navigate to home page and wait for complete load...');
      
      // Create a new generator instance to ensure fresh browser session
      const homeGenerator = new UniversalPOMGenerator({ logLevel: 'info' });
      
      // Options for home page without login config (since we're already authenticated)
      const homeOptions = {
        framework: 'playwright',
        language: 'typescript',
        browser: { 
          name: 'chrome', 
          headless: false,
          viewport: { width: 1920, height: 1080 }
        },
        includeTests: true,
        includeComments: true,
        includeWaitStrategies: true,
        includeErrorHandling: true,
        // Add custom wait strategy for home page
        customWaitStrategy: {
          type: 'networkidle',
          timeout: 10000
        },
        mcpIntegration: {
          serverUrl: 'https://mcp-server.example.com',
          tools: ['generate_pom_with_ai'],
          aiConfig: {
            provider: 'openai',
            apiKey: process.env.OPENAI_API_KEY || 'test-api-key',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 3000
          }
        }
      };
      
      console.log('⏳ Waiting for home page to load completely...');
      
      // Generate POM for the home page with proper wait
      const homeResult = await homeGenerator.generatePOM(targetUrl, homeOptions);
      
      if (homeResult.success) {
        const generationTime = Date.now() - startTime;
        
        console.log('✅ Home Page POM Generation Successful!');
        console.log(`⏱️  Total Generation Time: ${generationTime}ms`);
        console.log(`📄 Home Page Class: ${homeResult.pom.className}`);
        console.log(`📦 Elements Detected: ${homeResult.pom.elements.length}`);
        console.log(`⚙️  Methods Generated: ${homeResult.pom.methods.length}`);
        console.log(`📚 Import Statements: ${homeResult.pom.imports.length}`);
        
        // Show AI-generated code
        console.log('\n📝 AI-Generated Home Page Code:');
        console.log('='.repeat(60));
        console.log(homeResult.pom.generatedCode);
        console.log('='.repeat(60));
        
        // Show method details
        console.log('\n🔍 Generated Home Page Methods:');
        homeResult.pom.methods.forEach((method, index) => {
          console.log(`  ${index + 1}. ${method.name}() - ${method.description}`);
          console.log(`     Return Type: ${method.returnType}`);
          console.log(`     Element ID: ${method.elementId || 'N/A'}`);
        });
        
        // Show metadata
        console.log('\n📊 AI Metadata:');
        console.log(`  AI Enhanced: ${homeResult.pom.metadata.llmEnhanced}`);
        console.log(`  AI Provider: ${homeResult.pom.metadata.llmProvider}`);
        console.log(`  AI Model: ${homeResult.pom.metadata.llmModel}`);
        console.log(`  Framework: ${homeResult.pom.framework}`);
        console.log(`  Language: ${homeResult.pom.language}`);
        console.log(`  Login Required: ${homeResult.pom.metadata.loginRequired}`);
        console.log(`  Authentication Method: ${homeResult.pom.metadata.authenticationMethod}`);
        console.log(`  Page Title: ${homeResult.pom.metadata.pageTitle}`);
        
        // Generate files
        console.log('\n📁 Generating Home Page files...');
        const fileGenerator = new FileGenerator();
        await fileGenerator.generateFiles(homeResult);
        console.log('✅ Home Page files generated successfully!');
        
        // Show file locations
        console.log('\n📂 Generated Home Page Files:');
        console.log(`  POM Class: ${homeResult.pom.className}.ts`);
        console.log(`  Test File: ${homeResult.pom.className}.test.ts`);
        console.log(`  Metadata: ${homeResult.pom.className}.metadata.json`);
        
        console.log('\n🎉 Successfully generated Home Page POM for Toca Football!');
        console.log('\n💡 Home Page POM Features:');
        console.log('  • Proper page load waiting');
        console.log('  • Home page specific elements');
        console.log('  • User profile information');
        console.log('  • Navigation elements');
        console.log('  • Interactive components');
        
      } else {
        console.log('❌ Home Page POM Generation Failed!');
        console.log('📋 Errors:');
        homeResult.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
    } else {
      console.log('❌ Login Failed!');
      console.log('📋 Errors:');
      profilesResult.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testTocaFootballHomePage().catch(console.error);
}

module.exports = { testTocaFootballHomePage }; 