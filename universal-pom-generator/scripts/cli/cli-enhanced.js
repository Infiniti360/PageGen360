#!/usr/bin/env node

/**
 * Enhanced CLI for Universal POM Generator
 * Demonstrates the new enhanced architecture with method chaining and framework-specific optimizations
 */

const { EnhancedUniversalPOMGenerator } = require('../../dist/core/EnhancedUniversalPOMGenerator');
const path = require('path');

async function main() {
  console.log('🚀 Enhanced Universal POM Generator CLI');
  console.log('=====================================\n');

  try {
    // Initialize enhanced generator
    const generator = new EnhancedUniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    // Display supported features
    const stats = generator.getGenerationStatistics();
    console.log('📋 Supported Features:');
    console.log(`   Frameworks: ${stats.supportedFrameworks.join(', ')}`);
    console.log(`   Languages: ${stats.supportedLanguages.join(', ')}`);
    console.log(`   Enhanced Features: ${stats.enhancedFeatures.length} total\n`);

    // Example usage
    console.log('💡 Example Usage:\n');

    // Example 1: Generate comprehensive Cypress POM
    console.log('1. Generate Comprehensive Cypress POM:');
    console.log('   - Method chaining support');
    console.log('   - Comprehensive assertions');
    console.log('   - Utility methods');
    console.log('   - Validation methods');
    console.log('   - Accessibility checks');
    console.log('   - Responsive validation\n');

    // Example 2: Generate multi-framework POMs
    console.log('2. Generate Multi-Framework POMs:');
    console.log('   - Same page for multiple automation tools');
    console.log('   - Framework-specific optimizations');
    console.log('   - Consistent API across tools\n');

    // Example 3: Generate multi-language POMs
    console.log('3. Generate Multi-Language POMs:');
    console.log('   - Same functionality in different languages');
    console.log('   - Python, Java, C# support');
    console.log('   - Language-specific best practices\n');

    // Interactive demo
    console.log('🎯 Interactive Demo:');
    console.log('   Enter a URL to generate an enhanced POM, or press Enter to use demo URL\n');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('URL (or press Enter for demo): ', async (url) => {
      const targetUrl = url.trim() || 'https://example.com';
      
      console.log(`\n🔗 Generating enhanced POM for: ${targetUrl}\n`);

      try {
        // Generate comprehensive POM with all enhanced features
        const result = await generator.generateComprehensivePOM(targetUrl, {
          framework: 'cypress',
          language: 'typescript',
          includeMethodChaining: true,
          includeComprehensiveAssertions: true,
          includeUtilityMethods: true,
          includeValidationMethods: true,
          includeAccessibilityChecks: true,
          includeResponsiveValidation: true
        });

        if (result.success) {
          console.log('✅ Enhanced POM generated successfully!');
          console.log(`   Framework: ${result.metadata.framework}`);
          console.log(`   Language: ${result.metadata.language}`);
          console.log(`   Enhanced: ${result.metadata.enhanced}`);
          console.log(`   Features: ${result.metadata.features.join(', ')}`);
          console.log(`   Generation time: ${result.metadata.generationTime}ms`);
          
          if (result.pom) {
            console.log(`   Total elements: ${result.pom.metadata.qualityMetrics.totalElements}`);
            console.log(`   Total methods: ${result.pom.metadata.qualityMetrics.totalMethods}`);
            console.log(`   Assertion methods: ${result.pom.metadata.qualityMetrics.assertionMethods}`);
            console.log(`   Action methods: ${result.pom.metadata.qualityMetrics.actionMethods}`);
            console.log(`   Utility methods: ${result.pom.metadata.qualityMetrics.utilityMethods}`);
            console.log(`   Validation methods: ${result.pom.metadata.qualityMetrics.validationMethods}`);
            console.log(`   Chaining support: ${result.pom.metadata.qualityMetrics.chainingSupport}`);
          }
        } else {
          console.log('❌ POM generation failed:', result.error);
        }

      } catch (error) {
        console.log('❌ Error during POM generation:', error.message);
      }

      rl.close();
    });

  } catch (error) {
    console.error('❌ CLI initialization failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Enhanced Universal POM Generator CLI

Usage:
  node cli-enhanced.js [options]

Options:
  --help, -h          Show this help message
  --demo              Run demo with example URL
  --url <url>         Generate POM for specific URL
  --framework <fw>    Specify framework (cypress, playwright, selenium, puppeteer, testcafe)
  --language <lang>   Specify language (typescript, javascript, python, java, csharp)
  --comprehensive     Enable all enhanced features
  --chaining          Enable method chaining
  --assertions        Enable comprehensive assertions
  --utilities         Enable utility methods
  --validation        Enable validation methods
  --accessibility     Enable accessibility checks
  --responsive        Enable responsive validation

Examples:
  node cli-enhanced.js --url https://example.com --framework cypress --comprehensive
  node cli-enhanced.js --demo
  node cli-enhanced.js --framework playwright --language python
    `);
    process.exit(0);
  }

  if (args.includes('--demo')) {
    // Run demo mode
    main();
  } else {
    // Parse arguments and run with specific options
    const options = parseArguments(args);
    if (options.url) {
      runWithOptions(options);
    } else {
      main();
    }
  }
}

function parseArguments(args) {
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--url':
        options.url = args[++i];
        break;
      case '--framework':
        options.framework = args[++i];
        break;
      case '--language':
        options.language = args[++i];
        break;
      case '--comprehensive':
        options.comprehensive = true;
        break;
      case '--chaining':
        options.chaining = true;
        break;
      case '--assertions':
        options.assertions = true;
        break;
      case '--utilities':
        options.utilities = true;
        break;
      case '--validation':
        options.validation = true;
        break;
      case '--accessibility':
        options.accessibility = true;
        break;
      case '--responsive':
        options.responsive = true;
        break;
    }
  }
  
  return options;
}

async function runWithOptions(options) {
  console.log('🚀 Enhanced Universal POM Generator CLI');
  console.log('=====================================\n');

  try {
    const generator = new EnhancedUniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true
    });

    console.log(`🔗 Generating enhanced POM for: ${options.url}\n`);

    const generationOptions = {
      framework: options.framework || 'cypress',
      language: options.language || 'typescript',
      includeMethodChaining: options.comprehensive || options.chaining || true,
      includeComprehensiveAssertions: options.comprehensive || options.assertions || true,
      includeUtilityMethods: options.comprehensive || options.utilities || true,
      includeValidationMethods: options.comprehensive || options.validation || true,
      includeAccessibilityChecks: options.comprehensive || options.accessibility || false,
      includeResponsiveValidation: options.comprehensive || options.responsive || false
    };

    const result = await generator.generateEnhancedPOM(options.url, generationOptions);

    if (result.success) {
      console.log('✅ Enhanced POM generated successfully!');
      console.log(`   Framework: ${result.metadata.framework}`);
      console.log(`   Language: ${result.metadata.language}`);
      console.log(`   Enhanced: ${result.metadata.enhanced}`);
      console.log(`   Features: ${result.metadata.features.join(', ')}`);
      console.log(`   Generation time: ${result.metadata.generationTime}ms`);
      
      if (result.pom) {
        console.log(`   Total elements: ${result.pom.metadata.qualityMetrics.totalElements}`);
        console.log(`   Total methods: ${result.pom.metadata.qualityMetrics.totalMethods}`);
        console.log(`   Assertion methods: ${result.pom.metadata.qualityMetrics.assertionMethods}`);
        console.log(`   Action methods: ${result.pom.metadata.qualityMetrics.actionMethods}`);
        console.log(`   Utility methods: ${result.pom.metadata.qualityMetrics.utilityMethods}`);
        console.log(`   Validation methods: ${result.pom.metadata.qualityMetrics.validationMethods}`);
        console.log(`   Chaining support: ${result.pom.metadata.qualityMetrics.chainingSupport}`);
      }
    } else {
      console.log('❌ POM generation failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Error during POM generation:', error.message);
    process.exit(1);
  }
}

module.exports = { main, runWithOptions };
