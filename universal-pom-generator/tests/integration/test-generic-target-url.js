const { UniversalPOMGenerator } = require('./dist/index');

async function testGenericTargetUrlNavigation() {
  console.log('🚀 Testing Generic Target URL Navigation for Any Website...');
  
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  // Example configurations for different websites
  const testCases = [
    {
      name: 'Toca Football - Home Page',
      loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
      targetUrl: 'https://staging.my.tocafootball.com/home',
      credentials: {
        username: 'forkrrish@gmail.com',
        password: 'Toca123!'
      },
      waitForLogin: { type: 'url', value: 'profiles' }
    },
    {
      name: 'Toca Football - Dashboard Page',
      loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
      targetUrl: 'https://staging.my.tocafootball.com/dashboard',
      credentials: {
        username: 'forkrrish@gmail.com',
        password: 'Toca123!'
      },
      waitForLogin: { type: 'url', value: 'profiles' }
    },
    {
      name: 'Toca Football - Profile Page',
      loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
      targetUrl: 'https://staging.my.tocafootball.com/profile',
      credentials: {
        username: 'forkrrish@gmail.com',
        password: 'Toca123!'
      },
      waitForLogin: { type: 'url', value: 'profiles' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🎯 Testing: ${testCase.name}`);
    console.log(`📍 Login URL: ${testCase.loginUrl}`);
    console.log(`🎯 Target URL: ${testCase.targetUrl}`);
    
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
      // Enhanced wait strategy
      customWaitStrategy: {
        type: 'networkidle',
        timeout: 30000,
        additionalWait: 20000,
        waitForElements: true,
        waitForNetworkIdle: true,
        waitForDOMStable: true
      },
      // Generic login configuration with target URL
      loginConfig: {
        type: 'basic',
        loginUrl: testCase.loginUrl,
        targetUrl: testCase.targetUrl, // Dynamic target URL
        credentials: testCase.credentials,
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: testCase.waitForLogin
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
      const startTime = Date.now();
      
      console.log('⏳ Generating POM with target URL navigation...');
      const result = await generator.generatePOM(testCase.targetUrl, options);
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      if (result.success) {
        console.log(`✅ Success! Generated POM for ${testCase.name}`);
        console.log(`⏱️  Time: ${duration.toFixed(2)} seconds`);
        console.log(`📄 POM Class: ${result.pom.className}`);
        console.log(`🧩 Elements: ${result.pom.elements.length}`);
        console.log(`⚙️  Methods: ${result.pom.methods.length}`);
        
        // Check if target page elements are detected
        const targetPageElements = result.pom.elements.filter(el => 
          el.id.includes(testCase.targetUrl.split('/').pop() || '') ||
          el.text?.toLowerCase().includes(testCase.targetUrl.split('/').pop() || '') ||
          el.href?.includes(testCase.targetUrl.split('/').pop() || '')
        );
        
        console.log(`🎯 Target page elements: ${targetPageElements.length}`);
        
        if (targetPageElements.length > 0) {
          console.log('✅ Target page elements detected!');
          targetPageElements.slice(0, 3).forEach(el => {
            console.log(`  - ${el.id}: ${el.text || el.tagName}`);
          });
        }
        
      } else {
        console.log(`❌ Failed to generate POM for ${testCase.name}`);
        console.log('📋 Errors:', result.errors);
      }
      
    } catch (error) {
      console.error(`💥 Error for ${testCase.name}:`, error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Generic Target URL Navigation test completed!');
}

// Run the test
testGenericTargetUrlNavigation().catch(console.error); 