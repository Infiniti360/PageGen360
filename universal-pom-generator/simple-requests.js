const { UniversalPOMGenerator } = require('./dist/index');

// 🎯 OPTION B: SUPER SIMPLE REQUESTS FOR "DUMB GUY" 😄
// Just copy-paste these examples!

class SimpleRequests {
  constructor() {
    this.generator = new UniversalPOMGenerator({ logLevel: 'info' });
  }

  // 📄 TEMPLATE 1: Simple Static Page
  async staticPage(url) {
    console.log(`📄 Generating POM for: ${url}`);
    return await this.generator.generatePOM(url, {
      framework: 'playwright',
      language: 'typescript'
    });
  }

  // 🔐 TEMPLATE 2: Login Page
  async loginPage(targetUrl, loginUrl, username, password) {
    console.log(`🔐 Generating POM for login page: ${targetUrl}`);
    return await this.generator.generatePOM(targetUrl, {
      framework: 'playwright',
      language: 'typescript',
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

  // 🏠 TEMPLATE 3: Complex Multi-Step Flow
  async complexFlow(targetUrl, loginUrl, username, password, waitForUrl) {
    console.log(`🏠 Generating POM for complex flow: ${targetUrl}`);
    return await this.generator.generatePOM(targetUrl, {
      framework: 'playwright',
      language: 'typescript',
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

// 🚀 USAGE EXAMPLES - JUST COPY-PASTE! 😄

async function examples() {
  console.log('🎯 SUPER SIMPLE POM REQUESTS');
  console.log('📝 Just copy-paste these examples!\n');

  const requests = new SimpleRequests();

  // 📄 EXAMPLE 1: Static page
  console.log('📄 EXAMPLE 1: Static page');
  console.log('requests.staticPage("https://example.com")');
  try {
    await requests.staticPage('https://example.com');
    console.log('✅ Success!\n');
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }

  // 🔐 EXAMPLE 2: Login page
  console.log('🔐 EXAMPLE 2: Login page');
  console.log('requests.loginPage(');
  console.log('  "https://myapp.com/dashboard",');
  console.log('  "https://myapp.com/login",');
  console.log('  "admin@example.com",');
  console.log('  "password123"');
  console.log(')');
  // Note: This would fail with fake credentials, but shows the pattern

  // 🏠 EXAMPLE 3: Complex flow (Toca Football)
  console.log('\n🏠 EXAMPLE 3: Complex flow (Toca Football)');
  console.log('requests.complexFlow(');
  console.log('  "https://staging.my.tocafootball.com/home",');
  console.log('  "https://staging.my.tocafootball.com/auth/signin/email",');
  console.log('  "forkrrish@gmail.com",');
  console.log('  "Toca123!",');
  console.log('  "profiles"');
  console.log(')');
  try {
    await requests.complexFlow(
      'https://staging.my.tocafootball.com/home',
      'https://staging.my.tocafootball.com/auth/signin/email',
      'forkrrish@gmail.com',
      'Toca123!',
      'profiles'
    );
    console.log('✅ Success!\n');
  } catch (error) {
    console.log('❌ Error:', error.message, '\n');
  }
}

// 🎯 QUICK REFERENCE CARD
function showQuickReference() {
  console.log('\n🎯 QUICK REFERENCE CARD');
  console.log('='.repeat(50));
  console.log('📄 STATIC PAGE:');
  console.log('   requests.staticPage("https://example.com")');
  console.log('');
  console.log('🔐 LOGIN PAGE:');
  console.log('   requests.loginPage(targetUrl, loginUrl, username, password)');
  console.log('');
  console.log('🏠 COMPLEX FLOW:');
  console.log('   requests.complexFlow(targetUrl, loginUrl, username, password, waitForUrl)');
  console.log('='.repeat(50));
}

// 🚀 RUN EXAMPLES
if (require.main === module) {
  examples().then(showQuickReference).catch(console.error);
}

module.exports = { SimpleRequests, examples, showQuickReference }; 