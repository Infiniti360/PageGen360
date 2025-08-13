const { UniversalPOMGenerator } = require('../dist/index');

/**
 * Universal POM Generator Examples
 * 
 * This file demonstrates how to use the Universal POM Generator
 * for different types of websites and scenarios.
 */

// Initialize the universal generator
const generator = new UniversalPOMGenerator({
  logLevel: 'info',
  cacheEnabled: true
});

/**
 * Example 1: E-commerce Website
 * Generates POM for an online store with product catalog, cart, and checkout
 */
async function generateEcommercePOM() {
  console.log('🛒 Generating POM for E-commerce Website...');
  
  const result = await generator.generatePOM('https://shop.example.com', {
    framework: 'playwright',
    language: 'typescript',
    browser: {
      name: 'chrome',
      headless: false,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://shop.example.com/login',
      credentials: {
        username: 'customer@example.com',
        password: 'mypassword'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ E-commerce POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 2: Banking Application
 * Generates POM for a banking portal with account management and transactions
 */
async function generateBankingPOM() {
  console.log('🏦 Generating POM for Banking Application...');
  
  const result = await generator.generatePOM('https://bank.example.com', {
    framework: 'selenium',
    language: 'java',
    browser: {
      name: 'chrome',
      headless: true,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://bank.example.com/login',
      credentials: {
        username: 'account@example.com',
        password: 'securepass'
      },
      selectors: {
        usernameField: 'input[name="username"]',
        passwordField: 'input[name="password"]',
        submitButton: 'button[type="submit"]'
      },
      waitForLogin: {
        type: 'url',
        value: 'dashboard'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: false
    }
  });

  if (result.success) {
    console.log('✅ Banking POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 3: Social Media Platform
 * Generates POM for a social network with posts, messaging, and profiles
 */
async function generateSocialMediaPOM() {
  console.log('📱 Generating POM for Social Media Platform...');
  
  const result = await generator.generatePOM('https://social.example.com', {
    framework: 'cypress',
    language: 'javascript',
    browser: {
      name: 'chrome',
      headless: false,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://social.example.com/login',
      credentials: {
        username: 'user@example.com',
        password: 'mypass'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: false,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ Social Media POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 4: Public Documentation Site
 * Generates POM for a public website with no authentication
 */
async function generatePublicSitePOM() {
  console.log('📚 Generating POM for Public Documentation Site...');
  
  const result = await generator.generatePOM('https://docs.example.com', {
    framework: 'playwright',
    language: 'typescript',
    browser: {
      name: 'chrome',
      headless: true,
      viewport: { width: 1920, height: 1080 }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ Public Site POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 5: CRM Application
 * Generates POM for a customer relationship management system
 */
async function generateCRMPOM() {
  console.log('👥 Generating POM for CRM Application...');
  
  const result = await generator.generatePOM('https://crm.example.com', {
    framework: 'playwright',
    language: 'typescript',
    browser: {
      name: 'chrome',
      headless: false,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://crm.example.com/auth',
      credentials: {
        username: 'admin@example.com',
        password: 'admin123'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ CRM POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 6: Dashboard Application
 * Generates POM for a data dashboard with charts and analytics
 */
async function generateDashboardPOM() {
  console.log('📊 Generating POM for Dashboard Application...');
  
  const result = await generator.generatePOM('https://dashboard.example.com', {
    framework: 'selenium',
    language: 'python',
    browser: {
      name: 'chrome',
      headless: true,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://dashboard.example.com/login',
      credentials: {
        username: 'analyst@example.com',
        password: 'analytics123'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ Dashboard POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 7: Blog Platform
 * Generates POM for a blog with articles, comments, and user management
 */
async function generateBlogPOM() {
  console.log('📝 Generating POM for Blog Platform...');
  
  const result = await generator.generatePOM('https://blog.example.com', {
    framework: 'cypress',
    language: 'javascript',
    browser: {
      name: 'chrome',
      headless: false,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://blog.example.com/login',
      credentials: {
        username: 'author@example.com',
        password: 'authorpass'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: false,
      includeVisualTests: true
    }
  });

  if (result.success) {
    console.log('✅ Blog POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Example 8: Investment Platform
 * Generates POM for an investment/trading platform
 */
async function generateInvestmentPOM() {
  console.log('📈 Generating POM for Investment Platform...');
  
  const result = await generator.generatePOM('https://invest.example.com', {
    framework: 'selenium',
    language: 'java',
    browser: {
      name: 'chrome',
      headless: true,
      viewport: { width: 1920, height: 1080 }
    },
    loginConfig: {
      type: 'basic',
      loginUrl: 'https://invest.example.com/login',
      credentials: {
        username: 'investor@example.com',
        password: 'investpass'
      },
      selectors: {
        usernameField: 'input[type="email"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"]'
      }
    },
    codeGeneration: {
      generateTests: true,
      generateInterfaces: true,
      generateDocumentation: true,
      includePerformanceTests: true,
      includeVisualTests: false
    }
  });

  if (result.success) {
    console.log('✅ Investment POM generated successfully!');
    console.log(`📊 Generated Class: ${result.pom.className}`);
    console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('🌐 Universal POM Generator Examples');
  console.log('🎯 Demonstrating usage for different website types\n');

  try {
    // Run examples sequentially
    await generateEcommercePOM();
    console.log('');
    
    await generateBankingPOM();
    console.log('');
    
    await generateSocialMediaPOM();
    console.log('');
    
    await generatePublicSitePOM();
    console.log('');
    
    await generateCRMPOM();
    console.log('');
    
    await generateDashboardPOM();
    console.log('');
    
    await generateBlogPOM();
    console.log('');
    
    await generateInvestmentPOM();
    console.log('');

    console.log('🎉 All examples completed successfully!');
    console.log('📁 Check the generated-pom directory for output files.');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export functions for individual use
module.exports = {
  generateEcommercePOM,
  generateBankingPOM,
  generateSocialMediaPOM,
  generatePublicSitePOM,
  generateCRMPOM,
  generateDashboardPOM,
  generateBlogPOM,
  generateInvestmentPOM,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
} 