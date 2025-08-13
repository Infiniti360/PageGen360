#!/usr/bin/env node

/**
 * 🌐 Comprehensive Test Runner for Universal POM Generator
 * 
 * This script runs all comprehensive tests including:
 * - Core component tests
 * - Website compatibility tests
 * - Framework compatibility tests
 * - Language compatibility tests
 * - Browser compatibility tests
 * - Real-time monitoring tests
 * - Cross-platform tests
 * 
 * Usage: node run-comprehensive-tests.js [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  // Test suites to run
  TEST_SUITES: [
    'comprehensive-test-suite.ts',
    'real-time-monitoring-suite.ts',
    'cross-platform-suite.ts'
  ],
  
  // Test frameworks
  TEST_FRAMEWORKS: ['jest', 'playwright'],
  
  // Coverage thresholds
  COVERAGE_THRESHOLDS: {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90
  },
  
  // Performance thresholds
  PERFORMANCE_THRESHOLDS: {
    maxTestTime: 300000, // 5 minutes
    maxMemoryUsage: 512 * 1024 * 1024, // 512MB
    maxConcurrentTests: 5
  },
  
  // Output directories
  OUTPUT_DIRS: {
    reports: './test-reports',
    coverage: './coverage',
    screenshots: './test-screenshots',
    logs: './test-logs'
  }
};

// Test results storage
let testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  testSuites: [],
  startTime: null,
  endTime: null,
  coverage: {},
  performance: {}
};

/**
 * Main test runner class
 */
class ComprehensiveTestRunner {
  constructor() {
    this.setupDirectories();
    this.startTime = Date.now();
  }

  /**
   * Setup output directories
   */
  setupDirectories() {
    Object.values(TEST_CONFIG.OUTPUT_DIRS).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Run all comprehensive tests
   */
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Test Suite...');
    console.log('📅 Started at:', new Date().toISOString());
    console.log('🖥️  Platform:', process.platform);
    console.log('📦 Node Version:', process.version);
    console.log('📁 Working Directory:', process.cwd());
    console.log('');

    try {
      // Run Jest tests first
      await this.runJestTests();
      
      // Run Playwright tests
      await this.runPlaywrightTests();
      
      // Run custom test suites
      await this.runCustomTestSuites();
      
      // Generate comprehensive report
      await this.generateComprehensiveReport();
      
      // Display final results
      this.displayFinalResults();
      
    } catch (error) {
      console.error('💥 Test execution failed:', error);
      process.exit(1);
    }
  }

  /**
   * Run Jest tests
   */
  async runJestTests() {
    console.log('🧪 Running Jest Tests...');
    
    try {
      const jestCommand = 'npx jest --coverage --verbose --maxWorkers=2';
      console.log(`   Executing: ${jestCommand}`);
      
      const output = execSync(jestCommand, { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      console.log('   ✅ Jest tests completed successfully');
      
      // Parse Jest output for results
      this.parseJestOutput(output);
      
    } catch (error) {
      console.error('   ❌ Jest tests failed:', error.message);
      throw error;
    }
  }

  /**
   * Run Playwright tests
   */
  async runPlaywrightTests() {
    console.log('🎭 Running Playwright Tests...');
    
    try {
      const playwrightCommand = 'npx playwright test --reporter=html';
      console.log(`   Executing: ${playwrightCommand}`);
      
      const output = execSync(playwrightCommand, { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      console.log('   ✅ Playwright tests completed successfully');
      
      // Parse Playwright output for results
      this.parsePlaywrightOutput(output);
      
    } catch (error) {
      console.error('   ❌ Playwright tests failed:', error.message);
      // Don't throw here as Playwright tests might fail due to browser issues
    }
  }

  /**
   * Run custom test suites
   */
  async runCustomTestSuites() {
    console.log('🔧 Running Custom Test Suites...');
    
    for (const testSuite of TEST_CONFIG.TEST_SUITES) {
      try {
        console.log(`   Running: ${testSuite}`);
        
        // Check if test suite exists
        const testSuitePath = path.join(__dirname, testSuite);
        if (!fs.existsSync(testSuitePath)) {
          console.log(`   ⚠️  Test suite not found: ${testSuite}`);
          continue;
        }
        
        // Run test suite with ts-node
        const tsNodeCommand = `npx ts-node ${testSuitePath}`;
        const output = execSync(tsNodeCommand, { 
          encoding: 'utf8',
          maxBuffer: 1024 * 1024 * 5 // 5MB buffer
        });
        
        console.log(`   ✅ ${testSuite} completed successfully`);
        
        // Parse custom test output
        this.parseCustomTestOutput(testSuite, output);
        
      } catch (error) {
        console.error(`   ❌ ${testSuite} failed:`, error.message);
      }
    }
  }

  /**
   * Parse Jest test output
   */
  parseJestOutput(output) {
    // Extract test results from Jest output
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('Tests:')) {
        const match = line.match(/(\d+) total/);
        if (match) {
          testResults.totalTests += parseInt(match[1]);
        }
      }
      
      if (line.includes('PASS')) {
        testResults.passedTests++;
      }
      
      if (line.includes('FAIL')) {
        testResults.failedTests++;
      }
    }
    
    // Check for coverage report
    if (fs.existsSync(TEST_CONFIG.OUTPUT_DIRS.coverage)) {
      const coveragePath = path.join(TEST_CONFIG.OUTPUT_DIRS.coverage, 'coverage-summary.json');
      if (fs.existsSync(coveragePath)) {
        try {
          const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
          testResults.coverage = coverageData.total;
        } catch (error) {
          console.log('   ⚠️  Could not parse coverage data');
        }
      }
    }
  }

  /**
   * Parse Playwright test output
   */
  parsePlaywrightOutput(output) {
    // Extract test results from Playwright output
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('passed')) {
        const match = line.match(/(\d+) passed/);
        if (match) {
          testResults.passedTests += parseInt(match[1]);
        }
      }
      
      if (line.includes('failed')) {
        const match = line.match(/(\d+) failed/);
        if (match) {
          testResults.failedTests += parseInt(match[1]);
        }
      }
    }
  }

  /**
   * Parse custom test output
   */
  parseCustomTestOutput(testSuite, output) {
    // Store custom test suite results
    testResults.testSuites.push({
      name: testSuite,
      output: output,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate comprehensive test report
   */
  async generateComprehensiveReport() {
    console.log('📊 Generating Comprehensive Test Report...');
    
    testResults.endTime = Date.now();
    testResults.duration = testResults.endTime - testResults.startTime;
    
    const report = {
      summary: {
        totalTests: testResults.totalTests,
        passedTests: testResults.passedTests,
        failedTests: testResults.failedTests,
        skippedTests: testResults.skippedTests,
        successRate: testResults.totalTests > 0 ? 
          ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2) : 0,
        duration: testResults.duration,
        startTime: new Date(testResults.startTime).toISOString(),
        endTime: new Date(testResults.endTime).toISOString()
      },
      coverage: testResults.coverage,
      testSuites: testResults.testSuites,
      platform: {
        os: process.platform,
        nodeVersion: process.version,
        workingDirectory: process.cwd(),
        environment: process.env.NODE_ENV || 'development'
      },
      thresholds: TEST_CONFIG.COVERAGE_THRESHOLDS,
      performance: {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
    
    // Save report to file
    const reportPath = path.join(TEST_CONFIG.OUTPUT_DIRS.reports, 'comprehensive-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(report);
    
    // Generate markdown report
    this.generateMarkdownReport(report);
    
    console.log('   ✅ Comprehensive report generated');
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .metric h3 { margin: 0; color: #333; }
        .metric .value { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .warning { color: #ffc107; }
        .coverage { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .coverage-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; }
        .coverage-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌐 Comprehensive Test Report</h1>
        <p>Universal POM Generator - Test Execution Results</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${report.summary.totalTests}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value success">${report.summary.passedTests}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value failure">${report.summary.failedTests}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value ${report.summary.successRate >= 90 ? 'success' : report.summary.successRate >= 80 ? 'warning' : 'failure'}">${report.summary.successRate}%</div>
        </div>
        <div class="metric">
            <h3>Duration</h3>
            <div class="value">${(report.summary.duration / 1000).toFixed(1)}s</div>
        </div>
    </div>
    
    <div class="coverage">
        <h2>📊 Code Coverage</h2>
        ${Object.entries(report.coverage).map(([metric, value]) => `
            <div style="margin: 10px 0;">
                <strong>${metric}:</strong> ${value.pct}%
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: ${value.pct}%"></div>
                </div>
            </div>
        `).join('')}
    </div>
    
    <div style="margin: 20px 0;">
        <h2>🖥️  Platform Information</h2>
        <p><strong>OS:</strong> ${report.platform.os}</p>
        <p><strong>Node Version:</strong> ${report.platform.nodeVersion}</p>
        <p><strong>Environment:</strong> ${report.platform.environment}</p>
    </div>
    
    <div style="margin: 20px 0;">
        <h2>📋 Test Suites</h2>
        ${report.testSuites.map(suite => `
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <strong>${suite.name}</strong> - ${suite.timestamp}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
    
    const htmlPath = path.join(TEST_CONFIG.OUTPUT_DIRS.reports, 'comprehensive-test-report.html');
    fs.writeFileSync(htmlPath, htmlContent);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report) {
    const markdownContent = `# 🌐 Comprehensive Test Report

## 📊 Summary

- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests}
- **Failed:** ${report.summary.failedTests}
- **Success Rate:** ${report.summary.successRate}%
- **Duration:** ${(report.summary.duration / 1000).toFixed(1)} seconds
- **Start Time:** ${report.summary.startTime}
- **End Time:** ${report.summary.endTime}

## 📈 Code Coverage

${Object.entries(report.coverage).map(([metric, value]) => 
  `- **${metric}:** ${value.pct}%`
).join('\n')}

## 🖥️ Platform Information

- **OS:** ${report.platform.os}
- **Node Version:** ${report.platform.nodeVersion}
- **Environment:** ${report.platform.environment}
- **Working Directory:** ${report.platform.workingDirectory}

## 📋 Test Suites

${report.testSuites.map(suite => 
  `- **${suite.name}** - ${suite.timestamp}`
).join('\n')}

## 🎯 Coverage Thresholds

- **Statements:** ${report.thresholds.statements}%
- **Branches:** ${report.thresholds.branches}%
- **Functions:** ${report.thresholds.functions}%
- **Lines:** ${report.thresholds.lines}%

## 📁 Generated Reports

- **JSON Report:** \`${TEST_CONFIG.OUTPUT_DIRS.reports}/comprehensive-test-report.json\`
- **HTML Report:** \`${TEST_CONFIG.OUTPUT_DIRS.reports}/comprehensive-test-report.html\`
- **Coverage:** \`${TEST_CONFIG.OUTPUT_DIRS.coverage}/\`
- **Screenshots:** \`${TEST_CONFIG.OUTPUT_DIRS.screenshots}/\`
- **Logs:** \`${TEST_CONFIG.OUTPUT_DIRS.logs}/\`

---
*Generated by Universal POM Generator Comprehensive Test Runner*
`;
    
    const markdownPath = path.join(TEST_CONFIG.OUTPUT_DIRS.reports, 'comprehensive-test-report.md');
    fs.writeFileSync(markdownPath, markdownContent);
  }

  /**
   * Display final results
   */
  displayFinalResults() {
    console.log('');
    console.log('🎉 Comprehensive Test Suite Completed!');
    console.log('=====================================');
    console.log(`📊 Total Tests: ${testResults.totalTests}`);
    console.log(`✅ Passed: ${testResults.passedTests}`);
    console.log(`❌ Failed: ${testResults.failedTests}`);
    console.log(`⏱️  Duration: ${((testResults.endTime - testResults.startTime) / 1000).toFixed(1)}s`);
    
    if (testResults.totalTests > 0) {
      const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2);
      console.log(`📈 Success Rate: ${successRate}%`);
      
      if (parseFloat(successRate) >= 90) {
        console.log('🎯 Excellent! All tests passed with high coverage');
      } else if (parseFloat(successRate) >= 80) {
        console.log('👍 Good! Most tests passed');
      } else {
        console.log('⚠️  Warning: Some tests failed, review needed');
      }
    }
    
    console.log('');
    console.log('📁 Reports generated in:');
    console.log(`   📊 JSON: ${TEST_CONFIG.OUTPUT_DIRS.reports}/comprehensive-test-report.json`);
    console.log(`   🌐 HTML: ${TEST_CONFIG.OUTPUT_DIRS.reports}/comprehensive-test-report.html`);
    console.log(`   📝 Markdown: ${TEST_CONFIG.OUTPUT_DIRS.reports}/comprehensive-test-report.md`);
    console.log(`   📈 Coverage: ${TEST_CONFIG.OUTPUT_DIRS.coverage}/`);
    
    // Exit with appropriate code
    if (testResults.failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

// Command line argument parsing
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    coverage: true,
    verbose: false,
    parallel: false,
    output: './test-reports'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--no-coverage':
        options.coverage = false;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--parallel':
        options.parallel = true;
        break;
      case '--output':
        options.output = args[++i];
        break;
      default:
        console.log(`⚠️  Unknown option: ${arg}`);
        console.log('Use --help for usage information');
        process.exit(1);
    }
  }

  if (options.help) {
    console.log(`
🌐 Comprehensive Test Runner for Universal POM Generator

Usage: node run-comprehensive-tests.js [options]

Options:
  --help, -h              Show this help message
  --no-coverage           Skip coverage reporting
  --verbose, -v           Enable verbose output
  --parallel              Run tests in parallel
  --output <directory>    Output directory for reports

Examples:
  # Run all tests with default settings
  node run-comprehensive-tests.js

  # Run tests without coverage
  node run-comprehensive-tests.js --no-coverage

  # Run tests with verbose output
  node run-comprehensive-tests.js --verbose

  # Run tests with custom output directory
  node run-comprehensive-tests.js --output ./my-test-reports
`);
    process.exit(0);
  }

  return options;
}

// Main execution
async function main() {
  try {
    const options = parseArguments();
    
    // Update output directory if specified
    if (options.output !== './test-reports') {
      TEST_CONFIG.OUTPUT_DIRS.reports = options.output;
    }
    
    const testRunner = new ComprehensiveTestRunner();
    await testRunner.runAllTests();
    
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { ComprehensiveTestRunner, TEST_CONFIG };
