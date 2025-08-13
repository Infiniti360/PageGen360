#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const { UniversalPOMGenerator } = require('../dist/index');
const path = require('path');
const fs = require('fs');

// 🌐 Universal POM Generator CLI
// Usage: node cli-universal.js [options]
// This tool can generate POMs for any website with AI enhancement

function showHelp() {
  console.log(`
🌐 Universal POM Generator CLI

Generate Page Object Models for any website with AI enhancement and industrial standards.

Usage: node cli-universal.js [options]

Options:
  --url <url>                    Target URL (required)
  --login-url <url>              Login URL (if authentication required)
  --username <email>             Username/Email (if authentication required)
  --password <password>          Password (if authentication required)
  --framework <framework>        Framework: playwright, selenium, cypress, puppeteer, testcafe (default: playwright)
  --language <language>          Language: typescript, javascript, python, java, csharp (default: typescript)
  --browser <browser>            Browser: chrome, firefox, safari, edge (default: chrome)
  --headless                     Run in headless mode
  --no-tests                     Skip test generation
  --no-interfaces                Skip interface generation
  --no-performance               Skip performance tests
  --output <directory>           Output directory (default: ./generated-pom)
  --api-key <key>                OpenAI API Key (or set OPENAI_API_KEY env var)
  --project-name <name>          Custom project name (default: auto-generated from URL)
  --help                         Show this help message

Examples:
  # Basic usage for any website
  node cli-universal.js --url https://example.com

  # TOCA Football example
  node cli-universal.js --url https://staging.my.tocafootball.com/home \
    --login-url https://staging.my.tocafootball.com/auth/signin/email \
    --username forkrrish@gmail.com --password Toca123!

  # E-commerce example
  node cli-universal.js --url https://shop.example.com \
    --login-url https://shop.example.com/login \
    --username user@example.com --password mypass

  # Public website (no login)
  node cli-universal.js --url https://news.example.com --framework cypress

  # Different framework and language
  node cli-universal.js --url https://app.example.com \
    --framework selenium --language java

  # Headless mode with custom output
  node cli-universal.js --url https://dashboard.example.com \
    --headless --output ./my-pom --project-name DashboardApp

  # With OpenAI API key
  node cli-universal.js --url https://example.com \
    --api-key sk-your-openai-api-key-here
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: null, // Required
    loginUrl: null,
    username: null,
    password: null,
    framework: 'playwright',
    language: 'typescript',
    browser: 'chrome',
    headless: false,
    generateTests: true,
    generateInterfaces: true,
    includePerformanceTests: true,
    output: './generated-pom',
    apiKey: process.env.OPENAI_API_KEY,
    projectName: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
        
      case '--url':
        options.url = args[++i];
        break;
        
      case '--login-url':
        options.loginUrl = args[++i];
        break;
        
      case '--username':
        options.username = args[++i];
        break;
        
      case '--password':
        options.password = args[++i];
        break;
        
      case '--framework':
        options.framework = args[++i];
        break;
        
      case '--language':
        options.language = args[++i];
        break;
        
      case '--browser':
        options.browser = args[++i];
        break;
        
      case '--headless':
        options.headless = true;
        break;
        
      case '--no-tests':
        options.generateTests = false;
        break;
        
      case '--no-interfaces':
        options.generateInterfaces = false;
        break;
        
      case '--no-performance':
        options.includePerformanceTests = false;
        break;
        
      case '--output':
        options.output = args[++i];
        break;
        
      case '--api-key':
        options.apiKey = args[++i];
        break;
        
      case '--project-name':
        options.projectName = args[++i];
        break;
        
      default:
        console.log(`⚠️  Unknown option: ${arg}`);
        console.log('Use --help for usage information');
        process.exit(1);
    }
  }

  // Validate required URL
  if (!options.url) {
    console.log('❌ Target URL is required!');
    console.log('Use --url <url> to specify the target website');
    console.log('Example: node cli-universal.js --url https://example.com');
    process.exit(1);
  }

  return options;
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

function generateLoginConfig(options) {
  if (!options.loginUrl) {
    return null;
  }

  return {
    loginUrl: options.loginUrl,
    type: 'basic',
    credentials: {
      username: options.username,
      password: options.password
    },
    selectors: {
      usernameField: "input[type='email'], input[type='text'], input[name='username'], input[name='email']",
      passwordField: "input[type='password']",
      loginButton: "button[type='submit'], input[type='submit'], button:contains('Login'), button:contains('Sign In')"
    }
  };
}

async function generateUniversalPOM(options) {
  try {
    console.log('🌐 Universal POM Generator CLI');
    console.log('🎯 Industrial Standards + OpenAI Integration\n');

    // Validate OpenAI API Key
    if (!options.apiKey) {
      console.log('❌ OpenAI API Key is required for enhanced generation!');
      console.log('💡 Set OPENAI_API_KEY environment variable or use --api-key option');
      console.log('Example: export OPENAI_API_KEY="sk-your-api-key-here"');
      process.exit(1);
    }

    // Generate project name
    const projectName = generateProjectName(options.url, options.projectName);

    console.log('📋 Configuration:');
    console.log(`   🌐 Target URL: ${options.url}`);
    if (options.loginUrl) {
      console.log(`   🔗 Login URL: ${options.loginUrl}`);
      console.log(`   👤 Username: ${options.username}`);
    } else {
      console.log(`   🔐 Authentication: Not required`);
    }
    console.log(`   🛠️ Framework: ${options.framework}`);
    console.log(`   💻 Language: ${options.language}`);
    console.log(`   🌐 Browser: ${options.browser} (${options.headless ? 'headless' : 'headed'})`);
    console.log(`   🧪 Generate Tests: ${options.generateTests ? 'Yes' : 'No'}`);
    console.log(`   📋 Generate Interfaces: ${options.generateInterfaces ? 'Yes' : 'No'}`);
    console.log(`   ⚡ Performance Tests: ${options.includePerformanceTests ? 'Yes' : 'No'}`);
    console.log(`   📁 Output Directory: ${options.output}`);
    console.log(`   📝 Project Name: ${projectName}`);

    console.log('\n🚀 Starting POM Generation...');
    console.log('⏳ This may take a few minutes...\n');

    // Initialize the enhanced POM generator
    const generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    // Configure login if provided
    const loginConfig = generateLoginConfig(options);

    // Configure generation options
    const generationOptions = {
      framework: options.framework,
      language: options.language,
      browser: {
        name: options.browser,
        headless: options.headless,
        viewport: { width: 1920, height: 1080 }
      },
      ...(loginConfig && { loginConfig: loginConfig }),
      llmIntegration: {
        provider: 'openai',
        apiKey: options.apiKey,
        model: 'gpt-4-turbo',
        temperature: 0.7,
        maxTokens: 4000
      },
      codeGeneration: {
        generateTests: options.generateTests,
        generateInterfaces: options.generateInterfaces,
        generateDocumentation: true,
        includePerformanceTests: options.includePerformanceTests,
        includeVisualTests: true
      },
      namingConventions: {
        useDescriptiveNames: true,
        removePersonalData: true,
        useCamelCase: true,
        useSemanticNames: true
      }
    };

    // Generate POM
    const result = await generator.generatePOM(options.url, generationOptions);

    if (result.success) {
      console.log('\n✅ POM Generation Successful!');
      console.log(`📊 Generated Class: ${result.pom.className}`);
      console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
      console.log(`⏱️  Generation Time: ${result.metadata.generationTime}ms`);
      
      if (result.pom.metadata.qualityMetrics) {
        console.log(`📈 Quality Metrics:`, result.pom.metadata.qualityMetrics);
      }

      // Create output directory
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }

      // Save main POM file
      const pomFileName = `${result.pom.className}.ts`;
      const pomFilePath = path.join(options.output, pomFileName);
      fs.writeFileSync(pomFilePath, result.pom.generatedCode);
      console.log(`💾 Saved: ${pomFilePath}`);

      // Save test file if generated
      if (options.generateTests && result.pom.metadata.testCode) {
        const testFileName = `${result.pom.className}.test.ts`;
        const testFilePath = path.join(options.output, testFileName);
        fs.writeFileSync(testFilePath, result.pom.metadata.testCode);
        console.log(`🧪 Saved: ${testFilePath}`);
      }

      // Save interfaces if generated
      if (options.generateInterfaces && result.pom.metadata.interfaces) {
        const interfacesFileName = `${result.pom.className}.interfaces.ts`;
        const interfacesFilePath = path.join(options.output, interfacesFileName);
        fs.writeFileSync(interfacesFilePath, result.pom.metadata.interfaces.join('\n\n'));
        console.log(`📋 Saved: ${interfacesFilePath}`);
      }

      // Save metadata
      const metadataFileName = `${result.pom.className}.metadata.json`;
      const metadataFilePath = path.join(options.output, metadataFileName);
      fs.writeFileSync(metadataFilePath, JSON.stringify(result.pom.metadata, null, 2));
      console.log(`📊 Saved: ${metadataFilePath}`);

      // Save README
      const readmeContent = generateReadme(result.pom, options.url, loginConfig, options);
      const readmeFilePath = path.join(options.output, 'README.md');
      fs.writeFileSync(readmeFilePath, readmeContent);
      console.log(`📖 Saved: ${readmeFilePath}`);

      console.log('\n🎉 POM Generation Complete!');
      console.log(`📁 Files saved to: ${options.output}`);
      console.log('\n🚀 Next Steps:');
      console.log(`   1. Review the generated files in ${options.output}`);
      console.log(`   2. Install dependencies: npm install @playwright/test`);
      console.log(`   3. Run tests: npx playwright test ${options.output}/${result.pom.className}.test.ts`);
      console.log(`   4. Use the POM in your test automation projects`);

    } else {
      console.log('\n❌ POM Generation Failed!');
      console.error('Errors:', result.errors);
      console.log('\n💡 Troubleshooting Tips:');
      console.log('   - Check your internet connection');
      console.log('   - Verify the target URL is accessible');
      console.log('   - Ensure your OpenAI API key is valid');
      console.log('   - Try running without --headless for debugging');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Error during POM generation:', error);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('   - Check your OpenAI API key');
    console.log('   - Verify the target URL is accessible');
    console.log('   - Try running with different browser settings');
    process.exit(1);
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
  const options = parseArgs();
  generateUniversalPOM(options);
}

module.exports = { generateUniversalPOM, parseArgs }; 