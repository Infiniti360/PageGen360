const { UniversalPOMGenerator } = require('../dist/index');
const { FileGenerator } = require('../dist/utils/FileGenerator');

// 🎯 COMPREHENSIVE EXAMPLES
// This demonstrates all scenarios and frameworks

async function runComprehensiveExamples() {
  console.log('🎯 Comprehensive POM Generator Examples');
  console.log('📝 Demonstrating all scenarios and frameworks\n');

  const examples = [
    // Static Page Examples
    {
      name: 'Static Page - Cypress TypeScript',
      url: 'https://example.com',
      framework: 'cypress',
      language: 'typescript',
      loginConfig: null
    },
    {
      name: 'Static Page - Playwright JavaScript',
      url: 'https://httpbin.org/',
      framework: 'playwright',
      language: 'javascript',
      loginConfig: null
    },
    {
      name: 'Static Page - Selenium Python',
      url: 'https://httpbin.org/',
      framework: 'selenium',
      language: 'python',
      loginConfig: null
    },
    {
      name: 'Static Page - TestCafe TypeScript',
      url: 'https://example.com',
      framework: 'testcafe',
      language: 'typescript',
      loginConfig: null
    },
    {
      name: 'Static Page - Puppeteer JavaScript',
      url: 'https://httpbin.org/',
      framework: 'puppeteer',
      language: 'javascript',
      loginConfig: null
    },

    // Login Page Examples
    {
      name: 'Login Page - Cypress TypeScript',
      url: 'https://staging.my.tocafootball.com/home',
      framework: 'cypress',
      language: 'typescript',
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    },
    {
      name: 'Login Page - Playwright TypeScript',
      url: 'https://staging.my.tocafootball.com/home',
      framework: 'playwright',
      language: 'typescript',
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    },

    // Multi-Page Flow Examples
    {
      name: 'Multi-Page Flow - Selenium Java',
      url: 'https://staging.my.tocafootball.com/home',
      framework: 'selenium',
      language: 'java',
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    },
    {
      name: 'Multi-Page Flow - TestCafe TypeScript',
      url: 'https://staging.my.tocafootball.com/home',
      framework: 'testcafe',
      language: 'typescript',
      loginConfig: {
        type: 'basic',
        credentials: {
          username: 'forkrrish@gmail.com',
          password: 'Toca123!'
        },
        loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
        selectors: {
          usernameField: 'input[name="email"][type="email"]',
          passwordField: 'input[name="password"][type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: 'profiles'
        }
      }
    }
  ];

  const generator = new UniversalPOMGenerator({ 
    logLevel: 'info',
    browser: { 
      name: 'chrome', 
      headless: true 
    }
  });

  const fileGenerator = new FileGenerator();

  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 Example ${i + 1}/${examples.length}: ${example.name}`);
    console.log(`${'='.repeat(60)}`);

    try {
      const options = {
        framework: example.framework,
        language: example.language,
        browser: { name: 'chrome', headless: true },
        includeTests: true,
        includeComments: true,
        includeWaitStrategies: true,
        includeErrorHandling: true,
        loginConfig: example.loginConfig
      };

      console.log(`\n🚀 Generating POM for: ${example.url}`);
      console.log(`🛠️ Framework: ${example.framework}`);
      console.log(`💻 Language: ${example.language}`);
      console.log(`🔐 Login Required: ${!!example.loginConfig}`);

      const result = await generator.generatePOM(example.url, options);

      if (result.success) {
        console.log(`\n✅ SUCCESS!`);
        console.log(`📊 Elements: ${result.pom.elements?.length || 0}`);
        console.log(`📝 Methods: ${result.pom.methods?.length || 0}`);

        // Generate files
        const files = await fileGenerator.generateFiles(result);
        
        console.log(`\n📁 Generated Files:`);
        console.log(`📄 POM Class: ${files.pomClassFile}`);
        console.log(`🧪 Test File: ${files.testFile}`);
        console.log(`📊 Metadata: ${files.metadataFile}`);

        // Show element details
        console.log(`\n📝 Element Details:`);
        if (result.pom.elements && Array.isArray(result.pom.elements)) {
          result.pom.elements.slice(0, 5).forEach((element, index) => {
            const elementType = element.isInteractive ? '🖱️' : '📄';
            const textPreview = element.text?.substring(0, 20) || 'No text';
            console.log(`   ${index + 1}. ${elementType} ${element.tagName} - ${textPreview}...`);
          });
          if (result.pom.elements.length > 5) {
            console.log(`   ... and ${result.pom.elements.length - 5} more elements`);
          }
        }

      } else {
        console.log(`\n❌ FAILED!`);
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
          });
        }
      }

    } catch (error) {
      console.log(`\n💥 ERROR: ${error.message}`);
    }

    // Add delay between examples
    if (i < examples.length - 1) {
      console.log(`\n⏳ Waiting 2 seconds before next example...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎉 Comprehensive Examples Completed!`);
  console.log(`📊 Total Examples: ${examples.length}`);
  console.log(`${'='.repeat(60)}`);
}

// 🚀 RUN THE EXAMPLES
if (require.main === module) {
  runComprehensiveExamples().catch(console.error);
}

module.exports = { runComprehensiveExamples }; 