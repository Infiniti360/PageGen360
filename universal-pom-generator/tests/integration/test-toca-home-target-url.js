const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

async function testTargetUrlNavigation() {
  console.log('🚀 Testing Enhanced Target URL Navigation for Toca Football...');
  
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  // Target URL configuration
  const targetUrl = 'https://staging.my.tocafootball.com/home';
  const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
  
  // Enhanced options with target URL navigation
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
    // Complete wait strategy for target page
    customWaitStrategy: {
      type: 'networkidle',
      timeout: 30000,
      additionalWait: 20000,
      waitForElements: true,
      waitForNetworkIdle: true,
      waitForDOMStable: true
    },
    // Enhanced login configuration with target URL
    loginConfig: {
      type: 'basic',
      loginUrl: loginUrl,
      targetUrl: targetUrl, // Explicitly specify target URL
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
        value: 'profiles' // Wait for redirect to profiles page
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
        maxTokens: 4000
      }
    }
  };

  try {
    console.log('\n🎯 Step 1: Login with target URL navigation...');
    console.log(`📍 Login URL: ${loginUrl}`);
    console.log(`🎯 Target URL: ${targetUrl}`);
    console.log('⏳ This will login, wait for redirect, then navigate to target page...');
    
    const startTime = Date.now();
    
    // Generate POM with enhanced target URL navigation
    const result = await generator.generatePOM(targetUrl, options);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
          if (result.success) {
        console.log('\n✅ Success! Enhanced Target URL Navigation completed');
        console.log(`⏱️  Total time: ${duration.toFixed(2)} seconds`);
        console.log(`📄 Generated POM: ${result.pom.className}`);
        console.log(`🔗 Target URL: ${result.pom.url}`);
        console.log(`🧩 Elements detected: ${result.pom.elements.length}`);
        console.log(`⚙️  Methods generated: ${result.pom.methods.length}`);
        
        // Generate files
        console.log('\n📁 Generating POM files...');
        const fileGenerator = new FileGenerator();
        const files = await fileGenerator.generateFiles(result);
        console.log(`✅ Generated files:`);
        console.log(`  - POM Class: ${files.pomClassFile}`);
        console.log(`  - Test File: ${files.testFile}`);
        console.log(`  - Metadata: ${files.metadataFile}`);
      
      // Check if we got home page elements
      const homePageElements = result.pom.elements.filter(el => 
        el.id.includes('home') || 
        el.id.includes('dashboard') || 
        el.id.includes('main') ||
        el.text?.toLowerCase().includes('home') ||
        el.text?.toLowerCase().includes('dashboard')
      );
      
      console.log(`🏠 Home page elements detected: ${homePageElements.length}`);
      
      if (homePageElements.length > 0) {
        console.log('✅ Successfully detected home page elements!');
        homePageElements.slice(0, 5).forEach(el => {
          console.log(`  - ${el.id}: ${el.text || el.tagName}`);
        });
      } else {
        console.log('⚠️  No clear home page elements detected');
        console.log('📋 First 5 elements found:');
        result.pom.elements.slice(0, 5).forEach(el => {
          console.log(`  - ${el.id}: ${el.text || el.tagName}`);
        });
      }
      
      // Show generated methods
      console.log('\n🔧 Generated Methods:');
      result.pom.methods.slice(0, 10).forEach(method => {
        console.log(`  - ${method.name}(): ${method.description}`);
      });
      
      if (result.pom.methods.length > 10) {
        console.log(`  ... and ${result.pom.methods.length - 10} more methods`);
      }
      
    } else {
      console.log('\n❌ Failed to generate POM with target URL navigation');
      console.log('📋 Errors:', result.errors);
      console.log('⚠️  Warnings:', result.warnings);
    }
    
  } catch (error) {
    console.error('\n💥 Error during target URL navigation test:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testTargetUrlNavigation().catch(console.error); 