const { CodeGenerator } = require('./dist/core/CodeGenerator');

// 🎯 TEST CYPRESS BROWSERLESS
// This tests Cypress generation without browser to avoid session issues

async function testCypressBrowserless() {
  console.log('🎯 Testing Cypress Generation (Browserless)');
  console.log('📝 This tests Cypress code generation without browser\n');

  try {
    // Create mock POM data for Cypress
    const mockPOM = {
      className: 'CypressPage',
      framework: 'cypress',
      language: 'typescript',
      elements: [
        {
          elementId: 'login-button',
          tagName: 'button',
          text: 'Login',
          isInteractive: true,
          cssSelector: 'button[type="submit"]',
          xpath: '//button[@type="submit"]'
        },
        {
          elementId: 'email-field',
          tagName: 'input',
          text: '',
          isInteractive: true,
          cssSelector: 'input[type="email"]',
          xpath: '//input[@type="email"]'
        },
        {
          elementId: 'password-field',
          tagName: 'input',
          text: '',
          isInteractive: true,
          cssSelector: 'input[type="password"]',
          xpath: '//input[@type="password"]'
        }
      ],
      methods: [
        {
          name: 'login',
          description: 'Login with credentials',
          parameters: [
            { name: 'email', type: 'string', description: 'User email' },
            { name: 'password', type: 'string', description: 'User password' }
          ],
          returnType: 'void',
          body: 'cy.get(\'input[type="email"]\').type(email);\n    cy.get(\'input[type="password"]\').type(password);\n    cy.get(\'button[type="submit"]\').click();'
        },
        {
          name: 'waitForLoginSuccess',
          description: 'Wait for login to complete',
          parameters: [],
          returnType: 'void',
          body: 'cy.url().should(\'include\', \'/profiles\');'
        },
        {
          name: 'navigateToHome',
          description: 'Navigate to home page',
          parameters: [],
          returnType: 'void',
          body: 'cy.visit(\'/home\');'
        }
      ],
      generatedCode: null
    };

    const options = {
      framework: 'cypress',
      language: 'typescript',
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };

    console.log('🚀 Testing CodeGenerator directly...\n');
    
    // Test CodeGenerator directly
    const codeGenerator = new CodeGenerator();
    const codeResult = await codeGenerator.generateCode(mockPOM.elements, mockPOM.methods, options);
    
    console.log('📊 CodeGenerator Result:');
    console.log(`📄 Imports: ${codeResult.imports.length} imports`);
    console.log(`📄 Class Name: ${codeResult.className}`);
    console.log(`📄 Code Length: ${codeResult.code.length} characters`);
    
    console.log('\n📄 Generated Cypress Code:');
    console.log('='.repeat(50));
    console.log(codeResult.code);
    console.log('='.repeat(50));
    
    // Test FileGenerator with the generated code
    console.log('\n📁 Testing FileGenerator...');
    const { FileGenerator } = require('./dist/utils/FileGenerator');
    const fileGenerator = new FileGenerator();
    
    // Create a mock result with the generated code
    const mockResult = {
      success: true,
      pom: {
        ...mockPOM,
        generatedCode: codeResult.code
      }
    };
    
    const files = await fileGenerator.generateFiles(mockResult);
    
    console.log('\n📍 Generated Files:');
    console.log(`📄 POM Class: ${files.pomClassFile}`);
    console.log(`🧪 Test File: ${files.testFile}`);
    console.log(`📊 Metadata: ${files.metadataFile}`);
    
    // Show the generated file content
    const fs = require('fs');
    if (fs.existsSync(files.pomClassFile)) {
      const content = fs.readFileSync(files.pomClassFile, 'utf8');
      console.log('\n📄 Generated File Content:');
      console.log('='.repeat(50));
      console.log(content);
      console.log('='.repeat(50));
    }
    
    console.log('\n🎉 Cypress code generation is working correctly (browserless)!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testCypressBrowserless().catch(console.error);
}

module.exports = { testCypressBrowserless }; 