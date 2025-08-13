const { UniversalPOMGenerator } = require('./dist/index');

/**
 * 🎯 SIMPLE TOCA FOOTBALL POM TEST
 * 
 * This test generates POM for the Toca Football staging site
 * with proper login handling and navigation to home page.
 */

async function testTocaFootballSimple() {
  console.log('🎯 Testing Toca Football POM Generation (Simple)');
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
    console.log(`  Expected redirect: profiles page`);
    
    const options = {
      framework: 'playwright',
      language: 'typescript',
      browser: { 
        name: 'chrome', 
        headless: false, // Set to false to see the browser
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
          value: 'profiles' // Login redirects to profiles page
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
    
    console.log('\n🤖 Step 1: Login and navigate to profiles page...');
    const startTime = Date.now();
    
    // First, login and get to the profiles page
    const profilesResult = await generator.generatePOM('https://staging.my.tocafootball.com/profiles', options);
    
    if (profilesResult.success) {
      console.log('✅ Login successful! Redirected to profiles page.');
      console.log(`📄 Profiles Page Class: ${profilesResult.pom.className}`);
      console.log(`📦 Elements Detected: ${profilesResult.pom.elements.length}`);
      console.log(`⚙️  Methods Generated: ${profilesResult.pom.methods.length}`);
      
      console.log('\n🤖 Step 2: Navigate to home page and generate POM...');
      
      // Now navigate to home page with authenticated session
      const homeOptions = {
        ...options,
        loginConfig: undefined // Remove login config since we're already authenticated
      };
      
      const homeResult = await generator.generatePOM(targetUrl, homeOptions);
      
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
        console.log('\n🔍 Generated Methods:');
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
        
        console.log('\n🎉 Successfully generated POM for Toca Football home page!');
        console.log('\n💡 Generated POM Features:');
        console.log('  • Login authentication handling');
        console.log('  • Navigation between pages');
        console.log('  • Element interaction methods');
        console.log('  • Wait strategies for dynamic content');
        console.log('  • Error handling and assertions');
        
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
  testTocaFootballSimple().catch(console.error);
}

module.exports = { testTocaFootballSimple }; 