const { UniversalPOMGenerator } = require('./dist/index');

// 🎯 TEST CLI FUNCTIONALITY
// This simulates the CLI with predefined inputs

async function testCLI() {
  console.log('🎯 Testing CLI Functionality');
  console.log('📝 Simulating CLI with predefined inputs\n');

  // Simulate CLI inputs
  const targetUrl = 'https://example.com';
  const needsLogin = 'no';
  const framework = 'playwright';
  const language = 'typescript';

  console.log('🌐 Target URL:', targetUrl);
  console.log('🔐 Needs Login:', needsLogin);
  console.log('🛠️ Framework:', framework);
  console.log('💻 Language:', language);

  try {
    // 🎯 Generate POM
    console.log('\n🚀 Generating POM... Please wait...\n');
    
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const options = {
      framework,
      language,
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    const result = await generator.generatePOM(targetUrl, options);
    
    // 🎉 Show results
    console.log('\n🎉 SUCCESS! POM Generated!');
    console.log(`📊 Found ${result.elements.length} elements`);
    console.log(`📁 Generated files:`);
    console.log(`   - POM Class: ${result.pomClass ? 'Generated' : 'Not generated'}`);
    console.log(`   - Test File: ${result.testFile ? 'Generated' : 'Not generated'}`);
    console.log(`   - Metadata: ${result.metadata ? 'Generated' : 'Not generated'}`);
    
    if (result.pomClass) {
      console.log('\n📝 Generated POM Class Preview:');
      console.log('='.repeat(50));
      console.log(result.pomClass.substring(0, 500) + '...');
      console.log('='.repeat(50));
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Test with login flow
async function testCLIWithLogin() {
  console.log('\n🎯 Testing CLI with Login Flow');
  console.log('📝 Simulating complex multi-step flow\n');

  // Simulate CLI inputs for Toca Football
  const targetUrl = 'https://staging.my.tocafootball.com/home';
  const needsLogin = 'yes';
  const loginUrl = 'https://staging.my.tocafootball.com/auth/signin/email';
  const username = 'forkrrish@gmail.com';
  const password = 'Toca123!';
  const hasRedirect = 'yes';
  const waitForUrl = 'profiles';
  const framework = 'playwright';
  const language = 'typescript';

  console.log('🌐 Target URL:', targetUrl);
  console.log('🔐 Needs Login:', needsLogin);
  console.log('🔑 Login URL:', loginUrl);
  console.log('👤 Username:', username);
  console.log('🔄 Has Redirect:', hasRedirect);
  console.log('🎯 Wait For URL:', waitForUrl);
  console.log('🛠️ Framework:', framework);
  console.log('💻 Language:', language);

  try {
    // 🎯 Generate POM
    console.log('\n🚀 Generating POM... Please wait...\n');
    
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const options = {
      framework,
      language,
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
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
    };
    
    const result = await generator.generatePOM(targetUrl, options);
    
    // 🎉 Show results
    console.log('\n🎉 SUCCESS! POM Generated!');
    console.log(`📊 Found ${result.elements.length} elements`);
    console.log(`📁 Generated files:`);
    console.log(`   - POM Class: ${result.pomClass ? 'Generated' : 'Not generated'}`);
    console.log(`   - Test File: ${result.testFile ? 'Generated' : 'Not generated'}`);
    console.log(`   - Metadata: ${result.metadata ? 'Generated' : 'Not generated'}`);
    
    if (result.pomClass) {
      console.log('\n📝 Generated POM Class Preview:');
      console.log('='.repeat(50));
      console.log(result.pomClass.substring(0, 500) + '...');
      console.log('='.repeat(50));
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// 🚀 RUN THE TESTS
if (require.main === module) {
  testCLI()
    .then(() => testCLIWithLogin())
    .catch(console.error);
}

module.exports = { testCLI, testCLIWithLogin }; 