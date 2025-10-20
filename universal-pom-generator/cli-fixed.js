const readline = require('readline');
const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');
const path = require('path');
const fs = require('fs');

// 🎯 FIXED CLI - Better Input Handling
// This version handles input properly and avoids browser session issues

function askQuestion(rl, question) {
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

async function fixedPOMGenerator() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log('🎯 Universal POM Generator - Fixed CLI');
    console.log('📝 Just answer a few questions, we handle the rest!\n');

    // 🎯 STEP 1: Get target URL
    const targetUrl = await askQuestion(rl, '🌐 What page do you want POM for? (e.g., https://example.com): ');
    if (!targetUrl) {
      console.log('❌ URL is required!');
      return;
    }

    // 🎯 STEP 2: Check if login is needed
    const needsLogin = await askQuestion(rl, '🔐 Does this page require login? (y/n) [n]: ');
    const hasLogin = validateYesNo(needsLogin);

    let loginConfig = null;
    if (hasLogin) {
      console.log('\n🔐 Login Configuration:');
      
      const loginUrl = await askQuestion(rl, '🔗 Login URL: ');
      const username = await askQuestion(rl, '👤 Username/Email: ');
      const password = await askQuestion(rl, '🔒 Password: ');
      
      const waitForLogin = await askQuestion(rl, '🎯 What URL should we wait for after login? (e.g., profiles, dashboard): ');
      
      loginConfig = {
        type: 'basic',
        credentials: {
          username: username,
          password: password
        },
        loginUrl: loginUrl,
        selectors: {
          usernameField: 'input[type="email"], input[name="email"], input[type="text"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"], input[type="submit"]'
        },
        waitForLogin: {
          type: 'url',
          value: waitForLogin
        }
      };
    }

    // 🎯 STEP 3: Get framework
    const frameworkInput = await askQuestion(rl, '🛠️ What framework? (playwright/selenium/cypress) [playwright]: ');
    const framework = validateFramework(frameworkInput);

    // 🎯 STEP 4: Get language
    const languageInput = await askQuestion(rl, '💻 What language? (typescript/javascript/python) [typescript]: ');
    const language = validateLanguage(languageInput);

    console.log('\n🚀 Generating POM... Please wait...\n');

    // 🎯 STEP 5: Generate POM
    const generator = new UniversalPOMGenerator({ 
      logLevel: 'info',
      browser: { 
        name: 'chrome', 
        headless: true // Use headless to avoid browser issues
      }
    });

    const options = {
      framework: framework,
      language: language,
      browser: { name: 'chrome', headless: true },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true,
      loginConfig: loginConfig
    };

    const result = await generator.generatePOM(targetUrl, options);

    // Debug logging
    console.log(`\n🔍 DEBUG: result.success = ${result.success}`);
    console.log(`🔍 DEBUG: result.pom = ${!!result.pom}`);
    if (result.pom) {
      console.log(`🔍 DEBUG: result.pom.elements = ${!!result.pom.elements}`);
      console.log(`🔍 DEBUG: result.pom.methods = ${!!result.pom.methods}`);
    }

    // 🎯 STEP 6: Check if generation was successful
    if (!result.success) {
      console.log('\n❌ POM Generation Failed!');
      console.log('📋 Error Details:');
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      console.log('\n💡 Troubleshooting Tips:');
      console.log('   - Check if the URL is accessible');
      console.log('   - Verify login credentials if authentication is required');
      console.log('   - Try a different framework or language');
      console.log('   - For complex flows, use: npm run cli-ultimate');
      console.log('\n🔍 DEBUG: Returning early due to failed generation');
      return;
    }

    // 🎯 STEP 7: Generate files
    console.log('\n📁 Generating files...');
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);

    // 📍 STEP 8: Show results
    console.log('\n🎉 SUCCESS! POM Generated and Files Created!');
    console.log(`📊 Found ${result.pom?.elements?.length || 0} elements`);
    console.log(`📝 Generated ${result.pom?.methods?.length || 0} methods`);

    console.log('\n📍 EXACT FILE LOCATIONS:');
    console.log('='.repeat(60));
    console.log('📄 POM Class File:');
    console.log(`   Absolute Path: ${path.resolve(files.pomClassFile)}`);
    console.log(`   Relative Path: ${files.pomClassFile}`);
    console.log('');
    console.log('🧪 Test File:');
    console.log(`   Absolute Path: ${path.resolve(files.testFile)}`);
    console.log(`   Relative Path: ${files.testFile}`);
    console.log('');
    console.log('📊 Metadata File:');
    console.log(`   Absolute Path: ${path.resolve(files.metadataFile)}`);
    console.log(`   Relative Path: ${files.metadataFile}`);
    console.log('='.repeat(60));

    // 🔍 STEP 9: Verify files exist
    console.log('\n🔍 File Verification:');
    console.log(`POM Class exists: ${fs.existsSync(files.pomClassFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Test File exists: ${fs.existsSync(files.testFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Metadata exists: ${fs.existsSync(files.metadataFile) ? '✅ YES' : '❌ NO'}`);

    // 📏 STEP 10: Show file sizes
    console.log('\n📏 File Sizes:');
    if (fs.existsSync(files.pomClassFile)) {
      const stats = fs.statSync(files.pomClassFile);
      console.log(`POM Class: ${stats.size} bytes`);
    }
    if (fs.existsSync(files.testFile)) {
      const stats = fs.statSync(files.testFile);
      console.log(`Test File: ${stats.size} bytes`);
    }
    if (fs.existsSync(files.metadataFile)) {
      const stats = fs.statSync(files.metadataFile);
      console.log(`Metadata: ${stats.size} bytes`);
    }

    console.log('\n🎯 SUMMARY:');
    console.log('✅ POM files have been generated successfully!');
    console.log('✅ Files are ready to use in your automation projects');
    console.log('✅ You can copy these files to your test project');
    console.log('✅ The files are located in the paths shown above');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  } finally {
    // 🧹 STEP 11: Cleanup
    console.log('\n🧹 Cleaning up resources...');

    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('✅ Garbage collection completed');
      }

      // Additional cleanup for Node.js
      process.removeAllListeners();

    } catch (cleanupError) {
      console.log('⚠️  Cleanup warning:', cleanupError.message);
    }

    rl.close();

    // Force exit after cleanup
    setTimeout(() => {
      console.log('✅ CLI completed successfully');
      process.exit(0);
    }, 1000);
  }
}

// 🚀 RUN THE CLI
if (require.main === module) {
  // Enable garbage collection if available
  if (process.argv.includes('--expose-gc')) {
    console.log('🔄 Garbage collection enabled');
  }

  fixedPOMGenerator().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { fixedPOMGenerator }; 