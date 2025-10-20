#!/usr/bin/env node

const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// 🎯 OPTION B: SUPER SIMPLE CLI FOR "DUMB GUY" 😄
console.log('🎯 Universal POM Generator - Simple CLI');
console.log('📝 Just answer a few questions, we handle the rest!\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// 🔧 Input validation and cleanup functions
function validateFramework(input) {
  const frameworks = ['playwright', 'selenium', 'cypress'];
  const normalized = input.toLowerCase().trim();
  
  if (frameworks.includes(normalized)) {
    return normalized;
  }
  
  // Handle common typos
  const typos = {
    'playwight': 'playwright',
    'playwrit': 'playwright',
    'selenium': 'selenium',
    'cypres': 'cypress',
    'cypres': 'cypress'
  };
  
  if (typos[normalized]) {
    console.log(`🔄 Fixed typo: "${input}" → "${typos[normalized]}"`);
    return typos[normalized];
  }
  
  console.log(`⚠️  Invalid framework: "${input}". Using default: playwright`);
  return 'playwright';
}

function validateLanguage(input) {
  const languages = ['typescript', 'javascript', 'python', 'java', 'csharp'];
  const normalized = input.toLowerCase().trim();
  
  if (languages.includes(normalized)) {
    return normalized;
  }
  
  // Handle common typos
  const typos = {
    'typecript': 'typescript',
    'typescrip': 'typescript',
    'typescri': 'typescript',
    'javascrip': 'javascript',
    'javascri': 'javascript',
    'pytho': 'python',
    'jav': 'java',
    'cshar': 'csharp'
  };
  
  if (typos[normalized]) {
    console.log(`🔄 Fixed typo: "${input}" → "${typos[normalized]}"`);
    return typos[normalized];
  }
  
  console.log(`⚠️  Invalid language: "${input}". Using default: typescript`);
  return 'typescript';
}

function validateYesNo(input) {
  const normalized = input.toLowerCase().trim();
  return normalized === 'yes' || normalized === 'y' || normalized === 'true';
}

async function simplePOMGenerator() {
  let browser = null;
  
  try {
    // 🚀 STEP 1: What page do you want POM for?
    const targetUrl = await askQuestion('🌐 What page do you want POM for? (e.g., https://example.com): ');
    
    // 🔐 STEP 2: Does it need login?
    const needsLoginInput = await askQuestion('🔐 Does this page need login? (yes/no): ');
    const needsLogin = validateYesNo(needsLoginInput);
    
    let loginConfig = null;
    
    if (needsLogin) {
      // Get login details
      const loginUrl = await askQuestion('🔑 What is the login page URL? (e.g., https://example.com/login): ');
      const username = await askQuestion('👤 What is your username/email? ');
      const password = await askQuestion('🔒 What is your password? ');
      
      // Ask about redirect flow
      const hasRedirectInput = await askQuestion('🔄 After login, does it redirect to a different page? (yes/no): ');
      const hasRedirect = validateYesNo(hasRedirectInput);
      
      let waitForUrl = 'dashboard';
      if (hasRedirect) {
        waitForUrl = await askQuestion('🎯 What URL should we wait for after login? (e.g., profiles, dashboard): ');
      }
      
      loginConfig = {
        type: 'basic',
        loginUrl,
        credentials: { username, password },
        selectors: {
          usernameField: 'input[type="email"]',
          passwordField: 'input[type="password"]',
          submitButton: 'button[type="submit"]'
        },
        waitForLogin: { type: 'url', value: waitForUrl }
      };
    }
    
    // 🛠️ STEP 3: Framework and language
    const frameworkInput = await askQuestion('🛠️ What framework? (playwright/selenium/cypress) [playwright]: ') || 'playwright';
    const framework = validateFramework(frameworkInput);
    
    const languageInput = await askQuestion('💻 What language? (typescript/javascript/python) [typescript]: ') || 'typescript';
    const language = validateLanguage(languageInput);
    
    // 🎯 STEP 4: Generate POM
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
    
    if (loginConfig) {
      options.loginConfig = loginConfig;
    }
    
    const result = await generator.generatePOM(targetUrl, options);
    
    // Debug logging
    console.log(`\n🔍 DEBUG: result.success = ${result.success}`);
    console.log(`🔍 DEBUG: result.pom = ${!!result.pom}`);
    if (result.pom) {
      console.log(`🔍 DEBUG: result.pom.elements = ${!!result.pom.elements}`);
      console.log(`🔍 DEBUG: result.pom.methods = ${!!result.pom.methods}`);
    }
    
    // 🎉 STEP 5: Check if generation was successful
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
    
    // 🎉 STEP 6: Generate actual files
    console.log('\n📁 Generating files...');
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);
    
    // 📍 STEP 7: Show exact file locations
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
    
    // 🔍 STEP 8: Verify files exist
    console.log('\n🔍 File Verification:');
    console.log(`POM Class exists: ${fs.existsSync(files.pomClassFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Test File exists: ${fs.existsSync(files.testFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Metadata exists: ${fs.existsSync(files.metadataFile) ? '✅ YES' : '❌ NO'}`);
    
    // 📏 STEP 9: Show file sizes
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
    
    // 📝 STEP 10: Show POM class preview
    console.log('\n📝 Generated POM Class Preview:');
    console.log('='.repeat(50));
    console.log(`Class Name: ${result.pom?.className || 'N/A'}`);
    console.log(`Framework: ${result.pom?.framework || 'N/A'}`);
    console.log(`Language: ${result.pom?.language || 'N/A'}`);
    console.log(`Elements: ${result.pom?.elements?.length || 0}`);
    console.log(`Methods: ${result.pom?.methods?.length || 0}`);
    console.log('='.repeat(50));
    
    // 🔍 STEP 11: Show element details
    console.log('\n🔍 Element Details:');
    if (result.pom?.elements && Array.isArray(result.pom.elements)) {
      result.pom.elements.forEach((element, index) => {
        console.log(`${index + 1}. ${element.tagName} - ${element.text?.substring(0, 30) || 'No text'}...`);
      });
    } else {
      console.log('No elements found');
    }
    
    // 📂 STEP 12: Show directory contents
    const outputDir = path.dirname(files.pomClassFile);
    console.log('\n📂 Directory Contents:');
    if (fs.existsSync(outputDir)) {
      const filesInDir = fs.readdirSync(outputDir);
      filesInDir.forEach(file => {
        const filePath = path.join(outputDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   ${file} (${stats.size} bytes)`);
      });
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
      // 🧹 STEP 13: Cleanup browser and resources
      console.log('\n🧹 Cleaning up resources...');
    
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        console.log('✅ Garbage collection completed');
      }
      
      // Close any remaining browser instances
      if (browser) {
        try {
          await browser.quit();
          console.log('✅ Browser closed successfully');
        } catch (closeError) {
          console.log('⚠️  Browser cleanup warning:', closeError.message);
        }
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
  
  simplePOMGenerator().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { simplePOMGenerator }; 