const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

/**
 * 🎯 TOCA FOOTBALL POM GENERATION TEST
 * 
 * This test generates POM files for the Toca Football staging site
 * with login authentication and AI-powered code generation.
 */

async function testTocaFootballPOM() {
  console.log('🎯 Testing Toca Football POM Generation');
  console.log('📝 Generating POM for https://staging.my.tocafootball.com/home\n');

  try {
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    // Toca Football URLs
    const targetUrl = 'https://staging.my.tocafootball.com/home';
    const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
    
    // Test different frameworks and languages
    const testConfigs = [
      {
        name: 'Selenium Java',
        framework: 'selenium',
        language: 'java',
        description: 'Testing Selenium with Java for Toca Football'
      },
      {
        name: 'Playwright TypeScript',
        framework: 'playwright',
        language: 'typescript',
        description: 'Testing Playwright with TypeScript for Toca Football'
      },
      {
        name: 'Cypress JavaScript',
        framework: 'cypress',
        language: 'javascript',
        description: 'Testing Cypress with JavaScript for Toca Football'
      },
      {
        name: 'Puppeteer JavaScript',
        framework: 'puppeteer',
        language: 'javascript',
        description: 'Testing Puppeteer with JavaScript for Toca Football'
      },
      {
        name: 'TestCafe JavaScript',
        framework: 'testcafe',
        language: 'javascript',
        description: 'Testing TestCafe with JavaScript for Toca Football'
      }
    ];

    for (const config of testConfigs) {
      console.log(`\n🚀 Testing ${config.name}...`);
      console.log(`📋 ${config.description}\n`);
      
      const options = {
        framework: config.framework,
        language: config.language,
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
            value: 'profiles' 
          }
        },
        mcpIntegration: {
          serverUrl: 'https://mcp-server.example.com',
          tools: ['generate_pom_with_ai', 'detect_page_elements'],
          contextManagement: true,
          aiConfig: {
            provider: 'openai',
            apiKey: process.env.OPENAI_API_KEY || 'test-api-key',
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 3000
          }
        }
      };
      
      console.log('🔐 Login Configuration:');
      console.log(`  Login URL: ${loginUrl}`);
      console.log(`  Username: ${options.loginConfig.credentials.username}`);
      console.log(`  Target URL: ${targetUrl}`);
      
      console.log('\n🤖 Sending DOM to AI for code generation...');
      
      const startTime = Date.now();
      // First, let's test the login and navigation
      console.log('🔐 Testing login and navigation...');
      
      // Generate POM for the profiles page first (where login redirects)
      const profilesResult = await generator.generatePOM('https://staging.my.tocafootball.com/profiles', options);
      
      if (profilesResult.success) {
        console.log('✅ Login successful! Now generating POM for home page...');
        
        // Now generate POM for the home page
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
        console.log('='.repeat(60));
        console.log(result.pom.generatedCode);
        console.log('='.repeat(60));
        
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
        console.log(`  Login Required: ${result.pom.metadata.loginRequired}`);
        console.log(`  Authentication Method: ${result.pom.metadata.authenticationMethod}`);
        
        // Generate files
        console.log('\n📁 Generating files...');
        const fileGenerator = new FileGenerator();
        await fileGenerator.generateFiles(result);
        console.log('✅ Files generated successfully!');
        
        // Show file locations
        console.log('\n📂 Generated Files:');
        console.log(`  POM Class: ${result.pom.className}.${getFileExtension(config.language)}`);
        console.log(`  Test File: ${result.pom.className}.test.${getFileExtension(config.language)}`);
        console.log(`  Metadata: ${result.pom.className}.metadata.json`);
        
      } else {
        console.log('❌ AI Generation Failed!');
        console.log('📋 Errors:');
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
        
        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          console.log('\n⚠️  Warnings:');
          result.warnings.forEach((warning, index) => {
            console.log(`   ${index + 1}. ${warning}`);
          });
        }
      }
      
      console.log('\n' + '─'.repeat(80));
    }
    
    console.log('\n🎉 Toca Football POM Generation Test Completed!');
    console.log('\n💡 Key Features for Toca Football:');
    console.log('  • Login authentication with provided credentials');
    console.log('  • DOM extraction from authenticated pages');
    console.log('  • AI-generated POM code for each framework');
    console.log('  • Framework-specific patterns and best practices');
    console.log('  • Comprehensive error handling and wait strategies');
    console.log('  • Test methods with proper assertions');
    
    console.log('\n🔧 Generated POM Features:');
    console.log('  • Login methods and authentication handling');
    console.log('  • Navigation methods for different pages');
    console.log('  • Form interaction methods');
    console.log('  • Element wait strategies');
    console.log('  • Error handling for dynamic content');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

/**
 * Get file extension based on language
 */
function getFileExtension(language) {
  switch (language) {
    case 'java':
      return 'java';
    case 'typescript':
      return 'ts';
    case 'javascript':
      return 'js';
    case 'python':
      return 'py';
    case 'csharp':
      return 'cs';
    default:
      return 'js';
  }
}

/**
 * Test specific framework
 */
async function testSpecificFramework(framework, language) {
  console.log(`\n🎯 Testing ${framework} with ${language} for Toca Football`);
  
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  const options = {
    framework: framework,
    language: language,
    browser: { name: 'chrome', headless: false },
    includeTests: true,
    includeComments: true,
    includeWaitStrategies: true,
    includeErrorHandling: true,
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
      credentials: { 
        username: 'forkrrish@gmail.com', 
        password: 'Toca123!' 
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      },
      waitForLogin: { type: 'url', value: 'profiles' }
    },
    mcpIntegration: {
      serverUrl: 'https://mcp-server.example.com',
      tools: ['generate_pom_with_ai'],
      aiConfig: {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY || 'test-api-key',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 2000
      }
    }
  };

          // First login to get authenticated session
        const loginOptions = {
          ...options,
          loginConfig: {
            ...options.loginConfig,
            waitForLogin: { type: 'url', value: 'profiles' }
          }
        };
        
        const loginResult = await generator.generatePOM('https://staging.my.tocafootball.com/profiles', loginOptions);
        
        if (loginResult.success) {
          console.log('✅ Login successful! Now generating POM for home page...');
          
          // Now generate POM for the home page with authenticated session
          const result = await generator.generatePOM('https://staging.my.tocafootball.com/home', options);
  
  if (result.success) {
    console.log('✅ POM Generated Successfully!');
    console.log('📝 Code Preview:');
    console.log(result.pom.generatedCode.substring(0, 800) + '...');
  } else {
    console.log('❌ Generation Failed:', result.errors);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testTocaFootballPOM()
    .then(() => {
      console.log('\n🔧 Testing specific framework (Playwright TypeScript)...');
      return testSpecificFramework('playwright', 'typescript');
    })
    .catch(console.error);
}

module.exports = { testTocaFootballPOM, testSpecificFramework }; 