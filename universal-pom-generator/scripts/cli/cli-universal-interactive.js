#!/usr/bin/env node

const { UniversalPOMGenerator } = require('../dist/index');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// 🌐 Universal POM Generator - Interactive CLI
// This CLI can generate POMs for any website with AI enhancement

console.log('🌐 Universal POM Generator - Interactive CLI');
console.log('🎯 Industrial Standards + OpenAI Integration');
console.log('📝 Generate POMs for any website with AI enhancement\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function validateFramework(input) {
  const normalized = input.toLowerCase();
  if (normalized.includes('playwright')) return 'playwright';
  if (normalized.includes('selenium')) return 'selenium';
  if (normalized.includes('cypress')) return 'cypress';
  if (normalized.includes('puppeteer')) return 'puppeteer';
  if (normalized.includes('testcafe')) return 'testcafe';
  return 'playwright'; // default
}

function validateLanguage(input) {
  const normalized = input.toLowerCase();
  if (normalized.includes('typescript') || normalized.includes('ts')) return 'typescript';
  if (normalized.includes('javascript') || normalized.includes('js')) return 'javascript';
  if (normalized.includes('python') || normalized.includes('py')) return 'python';
  if (normalized.includes('java')) return 'java';
  if (normalized.includes('csharp') || normalized.includes('c#')) return 'csharp';
  return 'typescript'; // default
}

function validateYesNo(input) {
  const normalized = input.toLowerCase();
  return normalized === 'y' || normalized === 'yes' || normalized === 'true';
}

function validateBrowser(input) {
  const normalized = input.toLowerCase();
  if (normalized.includes('chrome')) return 'chrome';
  if (normalized.includes('firefox')) return 'firefox';
  if (normalized.includes('safari')) return 'safari';
  if (normalized.includes('edge')) return 'edge';
  return 'chrome'; // default
}

function generateProjectName(url, customName) {
  if (customName) {
    return customName;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '');
    const pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '');
    
    let projectName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    if (pathname) {
      projectName += pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
    
    return projectName + 'Page';
  } catch (error) {
    return 'GeneratedPage';
  }
}

function generateLoginConfig(loginUrl, username, password) {
  if (!loginUrl) {
    return null;
  }

  return {
    loginUrl: loginUrl,
    type: 'basic',
    credentials: {
      username: username,
      password: password
    },
    selectors: {
      usernameField: "input[type='email'], input[type='text'], input[name='username'], input[name='email']",
      passwordField: "input[type='password']",
      loginButton: "button[type='submit'], input[type='submit'], button:contains('Login'), button:contains('Sign In')"
    }
  };
}

async function universalPOMGenerator() {
  try {
    console.log('🚀 Starting Universal POM Generation...\n');

    // 🎯 STEP 1: Get OpenAI API Key
    console.log('🔑 OpenAI Configuration:');
    let openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      openaiApiKey = await askQuestion('🔑 Enter your OpenAI API Key: ');
      if (!openaiApiKey) {
        console.log('❌ OpenAI API Key is required for enhanced generation!');
        console.log('💡 Set OPENAI_API_KEY environment variable or enter it now.');
        return;
      }
    } else {
      console.log('✅ OpenAI API Key found in environment variables');
    }

    // 🎯 STEP 2: Get target URL
    console.log('\n🌐 Website Configuration:');
    const targetUrl = await askQuestion('🌐 What website do you want to generate POM for? (e.g., https://example.com): ');
    if (!targetUrl) {
      console.log('❌ Target URL is required!');
      return;
    }

    // 🎯 STEP 3: Get project name
    const customProjectName = await askQuestion('📝 Custom project name (optional, will auto-generate from URL): ');
    const projectName = generateProjectName(targetUrl, customProjectName);

    // 🎯 STEP 4: Get authentication configuration
    console.log('\n🔐 Authentication Configuration:');
    const needsLogin = await askQuestion('🔐 Does this website require login? (y/n): ');
    const useLogin = validateYesNo(needsLogin);

    let loginConfig = null;
    if (useLogin) {
      const loginUrl = await askQuestion('🔗 Login page URL: ');
      const username = await askQuestion('👤 Username/Email: ');
      const password = await askQuestion('🔒 Password: ');
      
      if (loginUrl && username && password) {
        loginConfig = generateLoginConfig(loginUrl, username, password);
      }
    }

    // 🎯 STEP 5: Get framework and language
    console.log('\n🛠️ Framework Configuration:');
    const frameworkInput = await askQuestion('🛠️ Framework (playwright/selenium/cypress/puppeteer/testcafe) [playwright]: ');
    const framework = validateFramework(frameworkInput);

    const languageInput = await askQuestion('💻 Language (typescript/javascript/python/java/csharp) [typescript]: ');
    const language = validateLanguage(languageInput);

    // 🎯 STEP 6: Get browser configuration
    console.log('\n🌐 Browser Configuration:');
    const browserInput = await askQuestion('🌐 Browser (chrome/firefox/safari/edge) [chrome]: ');
    const browser = validateBrowser(browserInput);

    const headlessInput = await askQuestion('👻 Run in headless mode? (y/n) [n]: ');
    const headless = headlessInput === '' || validateYesNo(headlessInput);

    // 🎯 STEP 7: Get generation options
    console.log('\n⚙️ Generation Options:');
    const generateTestsInput = await askQuestion('🧪 Generate test files? (y/n) [y]: ');
    const generateTests = generateTestsInput === '' || validateYesNo(generateTestsInput);

    const generateInterfacesInput = await askQuestion('📋 Generate TypeScript interfaces? (y/n) [y]: ');
    const generateInterfaces = generateInterfacesInput === '' || validateYesNo(generateInterfacesInput);

    const includePerformanceTestsInput = await askQuestion('⚡ Include performance tests? (y/n) [y]: ');
    const includePerformanceTests = includePerformanceTestsInput === '' || validateYesNo(includePerformanceTestsInput);

    // 🎯 STEP 8: Get output directory
    const outputDir = await askQuestion('\n📁 Output directory [./generated-pom]: ');
    const finalOutputDir = outputDir || './generated-pom';

    // 🎯 STEP 9: Confirm configuration
    console.log('\n📋 Configuration Summary:');
    console.log(`   🌐 Target URL: ${targetUrl}`);
    console.log(`   📝 Project Name: ${projectName}`);
    console.log(`   🔐 Login Required: ${useLogin ? 'Yes' : 'No'}`);
    if (useLogin && loginConfig) {
      console.log(`   🔗 Login URL: ${loginConfig.loginUrl}`);
      console.log(`   👤 Username: ${loginConfig.credentials.username}`);
    }
    console.log(`   🛠️ Framework: ${framework}`);
    console.log(`   💻 Language: ${language}`);
    console.log(`   🌐 Browser: ${browser} (${headless ? 'headless' : 'headed'})`);
    console.log(`   🧪 Generate Tests: ${generateTests ? 'Yes' : 'No'}`);
    console.log(`   📋 Generate Interfaces: ${generateInterfaces ? 'Yes' : 'No'}`);
    console.log(`   ⚡ Performance Tests: ${includePerformanceTests ? 'Yes' : 'No'}`);
    console.log(`   📁 Output Directory: ${finalOutputDir}`);

    const confirmInput = await askQuestion('\n✅ Proceed with generation? (y/n) [y]: ');
    const confirm = confirmInput === '' || validateYesNo(confirmInput);

    if (!confirm) {
      console.log('❌ Generation cancelled.');
      return;
    }

    // 🚀 STEP 10: Generate POM
    console.log('\n🚀 Starting POM Generation...');
    console.log('⏳ This may take a few minutes...\n');

    const generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    const generationOptions = {
      framework: framework,
      language: language,
      browser: {
        name: browser,
        headless: headless,
        viewport: { width: 1920, height: 1080 }
      },
      loginConfig: loginConfig,
      mcpIntegration: {
        serverUrl: 'http://localhost:3000',
        tools: ['enhanced_pom_generation'],
        aiConfig: {
          provider: 'openai',
          model: 'gpt-4-turbo',
          apiKey: openaiApiKey,
          temperature: 0.7,
          maxTokens: 4000
        },
        industrialStandards: {
          properNamingConventions: true,
          comprehensiveDocumentation: true,
          typeSafety: true,
          errorHandling: true,
          modularDesign: true
        }
      },
      codeGeneration: {
        generateTests: generateTests,
        generateInterfaces: generateInterfaces,
        generateDocumentation: true,
        includePerformanceTests: includePerformanceTests,
        includeVisualTests: true
      }
    };

    const result = await generator.generatePOM(targetUrl, generationOptions);

    if (result.success) {
      console.log('\n✅ POM Generation Successful!');
      console.log(`📊 Generated Class: ${result.pom.className}`);
      console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
      console.log(`⏱️  Generation Time: ${result.metadata.generationTime}ms`);
      console.log(`📈 Quality Metrics:`, result.pom.metadata.qualityMetrics);

      // 📁 STEP 11: Save generated files
      if (!fs.existsSync(finalOutputDir)) {
        fs.mkdirSync(finalOutputDir, { recursive: true });
      }

      // Save main POM file
      const pomFileName = `${result.pom.className}.ts`;
      fs.writeFileSync(
        path.join(finalOutputDir, pomFileName),
        result.pom.generatedCode
      );

      // Save test file if generated
      if (generateTests && result.pom.metadata.testCode) {
        const testFileName = `${result.pom.className}.test.ts`;
        fs.writeFileSync(
          path.join(finalOutputDir, testFileName),
          result.pom.metadata.testCode
        );
      }

      // Save interfaces if generated
      if (generateInterfaces && result.pom.metadata.interfaces) {
        const interfacesFileName = `${result.pom.className}.interfaces.ts`;
        fs.writeFileSync(
          path.join(finalOutputDir, interfacesFileName),
          result.pom.metadata.interfaces.join('\n\n')
        );
      }

      // Save metadata
      const metadataFileName = `${result.pom.className}.metadata.json`;
      fs.writeFileSync(
        path.join(finalOutputDir, metadataFileName),
        JSON.stringify(result.pom.metadata, null, 2)
      );

      // Save README
      const readmeContent = generateReadme(result.pom, targetUrl, loginConfig, {
        framework,
        language,
        browser,
        headless,
        generateTests,
        generateInterfaces,
        includePerformanceTests
      });
      fs.writeFileSync(
        path.join(finalOutputDir, 'README.md'),
        readmeContent
      );

      console.log('\n💾 Files saved successfully!');
      console.log(`📁 Output Directory: ${finalOutputDir}`);
      console.log('\n📄 Generated Files:');
      console.log(`   📄 ${pomFileName}`);
      if (generateTests) console.log(`   🧪 ${result.pom.className}.test.ts`);
      if (generateInterfaces) console.log(`   📋 ${result.pom.className}.interfaces.ts`);
      console.log(`   📊 ${metadataFileName}`);
      console.log(`   📖 README.md`);

      // 🧪 STEP 12: Run tests if requested
      if (generateTests) {
        const runTestsInput = await askQuestion('\n🧪 Run generated tests? (y/n) [n]: ');
        const runTests = validateYesNo(runTestsInput);

        if (runTests) {
          console.log('\n🧪 Running tests...');
          try {
            const { execSync } = require('child_process');
            execSync(`npx playwright test ${path.join(finalOutputDir, `${result.pom.className}.test.ts`)}`, {
              stdio: 'inherit'
            });
            console.log('✅ Tests completed successfully!');
          } catch (error) {
            console.log('⚠️  Tests failed or Playwright not installed. You can run them manually later.');
          }
        }
      }

      console.log('\n🎉 POM Generation Complete!');
      console.log('📚 Check the generated files in the output directory.');
      console.log('🚀 You can now use the generated POM in your test automation projects.');

    } else {
      console.log('\n❌ POM Generation Failed!');
      console.error('Errors:', result.errors);
      console.log('\n💡 Troubleshooting Tips:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the target URL is accessible');
      console.log('   - Ensure your OpenAI API key is valid');
      console.log('   - Try running in headed mode for debugging');
    }

  } catch (error) {
    console.error('\n💥 Error during POM generation:', error);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   - Check your OpenAI API key');
    console.log('   - Verify the target URL is accessible');
    console.log('   - Try running with different browser settings');
  } finally {
    rl.close();
  }
}

function generateReadme(pom, targetUrl, loginConfig, options) {
  return `# ${pom.className}

## Overview

This Page Object Model (POM) was generated for: **${targetUrl}**

## Generated Files

- \`${pom.className}.ts\` - Main POM class
${options.generateTests ? `- \`${pom.className}.test.ts\` - Test suite` : ''}
${options.generateInterfaces ? `- \`${pom.className}.interfaces.ts\` - TypeScript interfaces` : ''}
- \`${pom.className}.metadata.json\` - Generation metadata
- \`README.md\` - This file

## Usage

\`\`\`typescript
import { ${pom.className} } from './${pom.className}';

// Initialize the page object
const page = new ${pom.className}(browserPage);

// Navigate to the page
await page.navigateToPage();

// Use the generated methods
await page.verifyPageIsLoaded();
\`\`\`

## Authentication

${loginConfig ? `This POM includes authentication handling for:
- Login URL: ${loginConfig.loginUrl}
- Username: ${loginConfig.credentials.username}
- Password: [hidden]` : 'No authentication required for this page.'}

## Configuration Used

- **Framework**: ${options.framework}
- **Language**: ${options.language}
- **Browser**: ${options.browser} (${options.headless ? 'headless' : 'headed'})
- **Generate Tests**: ${options.generateTests ? 'Yes' : 'No'}
- **Generate Interfaces**: ${options.generateInterfaces ? 'Yes' : 'No'}
- **Performance Tests**: ${options.includePerformanceTests ? 'Yes' : 'No'}

## Quality Metrics

${pom.metadata.qualityMetrics ? `
- **Code Coverage**: ${pom.metadata.qualityMetrics.codeCoverage || 'N/A'}
- **Documentation Coverage**: ${pom.metadata.qualityMetrics.documentationCoverage || 'N/A'}
- **Type Safety**: ${pom.metadata.qualityMetrics.typeSafety || 'N/A'}
- **Error Handling**: ${pom.metadata.qualityMetrics.errorHandling || 'N/A'}
` : 'Quality metrics not available'}

## Generated At

${new Date().toISOString()}

## Framework

${pom.framework} / ${pom.language}
`;
}

// 🚀 Run the CLI
if (require.main === module) {
  universalPOMGenerator().catch(console.error);
}

module.exports = { universalPOMGenerator }; 