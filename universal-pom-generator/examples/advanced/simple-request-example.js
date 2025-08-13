const { UniversalPOMGenerator } = require('../dist/index');

// 🎯 OPTION B: SUPER SIMPLE REQUEST SYSTEM
// Even a "dumb guy" can use this! 😄

async function simpleRequestExample() {
  console.log('🎯 Universal POM Generator - Simple Request System');
  console.log('📝 Just tell us what you want, we handle the rest!');

  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  // 🚀 SCENARIO 1: Simple Static Page (No Login)
  console.log('\n📄 SCENARIO 1: Simple Static Page');
  console.log('User says: "I want POM for https://example.com"');
  
  try {
    const staticPageResult = await generator.generatePOM('https://example.com', {
      framework: 'playwright',
      language: 'typescript'
    });
    
    console.log('✅ Generated POM for static page!');
    console.log(`📊 Found ${staticPageResult.elements.length} elements`);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 🔐 SCENARIO 2: Direct Login Flow
  console.log('\n🔐 SCENARIO 2: Direct Login Flow');
  console.log('User says: "I want POM for https://myapp.com/dashboard"');
  console.log('User says: "Login at https://myapp.com/login with admin@example.com / password123"');
  
  try {
    const loginResult = await generator.generatePOM('https://myapp.com/dashboard', {
      framework: 'playwright',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      loginConfig: {
        type: 'basic',
        loginUrl: 'https://myapp.com/login',
        credentials: {
          username: 'admin@example.com',
          password: 'password123'
        },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'dashboard'
        }
      }
    });
    
    console.log('✅ Generated POM for login-protected page!');
    console.log(`📊 Found ${loginResult.elements.length} elements`);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 🏠 SCENARIO 3: Complex Multi-Step Flow
  console.log('\n🏠 SCENARIO 3: Complex Multi-Step Flow');
  console.log('User says: "I want POM for https://staging.my.tocafootball.com/home"');
  console.log('User says: "It redirects to login, then profiles, then home"');
  console.log('User says: "Login with forkrrish@gmail.com / Toca123!"');
  
  try {
    const complexResult = await generator.generatePOM('https://staging.my.tocafootball.com/home', {
      framework: 'playwright',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
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
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    });
    
    console.log('✅ Generated POM for complex multi-step flow!');
    console.log(`📊 Found ${complexResult.elements.length} elements`);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// 🎯 SIMPLE REQUEST HELPER FUNCTIONS
class SimplePOMRequest {
  constructor() {
    this.generator = new UniversalPOMGenerator({ logLevel: 'info' });
  }

  // 📄 Simple Static Page
  async staticPage(url, framework = 'playwright', language = 'typescript') {
    console.log(`📄 Generating POM for static page: ${url}`);
    return await this.generator.generatePOM(url, { framework, language });
  }

  // 🔐 Direct Login Flow
  async loginPage(targetUrl, loginUrl, username, password, framework = 'playwright', language = 'typescript') {
    console.log(`🔐 Generating POM for login-protected page: ${targetUrl}`);
    return await this.generator.generatePOM(targetUrl, {
      framework,
      language,
      browser: { name: 'chrome', headless: false },
      loginConfig: {
        type: 'basic',
        loginUrl,
        credentials: { username, password },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { type: 'url', value: 'dashboard' }
      }
    });
  }

  // 🏠 Complex Multi-Step Flow
  async complexFlow(targetUrl, loginUrl, username, password, waitForUrl, framework = 'playwright', language = 'typescript') {
    console.log(`🏠 Generating POM for complex flow: ${targetUrl}`);
    return await this.generator.generatePOM(targetUrl, {
      framework,
      language,
      browser: { name: 'chrome', headless: false },
      loginConfig: {
        type: 'basic',
        loginUrl,
        credentials: { username, password },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { type: 'url', value: waitForUrl }
      }
    });
  }
}

// 🚀 USAGE EXAMPLES FOR "DUMB GUY" 😄
async function simpleUsageExamples() {
  console.log('\n🎯 SIMPLE USAGE EXAMPLES');
  console.log('Even a "dumb guy" can use these! 😄\n');

  const request = new SimplePOMRequest();

  // Example 1: Static page
  console.log('📄 Example 1: Static page');
  console.log('request.staticPage("https://example.com")');
  
  // Example 2: Login page
  console.log('\n🔐 Example 2: Login page');
  console.log('request.loginPage(');
  console.log('  "https://myapp.com/dashboard",');
  console.log('  "https://myapp.com/login",');
  console.log('  "admin@example.com",');
  console.log('  "password123"');
  console.log(')');
  
  // Example 3: Complex flow
  console.log('\n🏠 Example 3: Complex flow');
  console.log('request.complexFlow(');
  console.log('  "https://staging.my.tocafootball.com/home",');
  console.log('  "https://staging.my.tocafootball.com/auth/signin/email",');
  console.log('  "forkrrish@gmail.com",');
  console.log('  "Toca123!",');
  console.log('  "profiles"');
  console.log(')');
}

// 🎯 RUN THE EXAMPLES
if (require.main === module) {
  simpleRequestExample()
    .then(() => simpleUsageExamples())
    .catch(console.error);
}

module.exports = { SimplePOMRequest, simpleRequestExample, simpleUsageExamples }; 