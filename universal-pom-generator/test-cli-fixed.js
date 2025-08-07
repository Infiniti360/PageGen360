const { fixedPOMGenerator } = require('./cli-fixed');

// 🎯 TEST FIXED CLI
// This tests the fixed CLI with predefined inputs

async function testFixedCLI() {
  console.log('🎯 Testing Fixed CLI');
  console.log('📝 This tests the fixed CLI with predefined inputs\n');

  try {
    // Mock the readline interface
    const originalReadline = require('readline');
    const mockReadline = {
      createInterface: () => ({
        question: (prompt, callback) => {
          // Provide predefined answers
          const answers = [
            'https://example.com', // target URL
            'n', // no login
            'cypress', // framework
            'typescript' // language
          ];
          const answer = answers.shift() || '';
          setTimeout(() => callback(answer), 100);
        },
        close: () => {}
      })
    };

    // Temporarily replace readline
    require.cache[require.resolve('readline')] = {
      exports: mockReadline
    };

    console.log('🚀 Running fixed CLI with predefined inputs...\n');
    
    // Run the fixed CLI
    await fixedPOMGenerator();
    
    console.log('\n🎉 Fixed CLI test completed!');
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// 🚀 RUN THE TEST
if (require.main === module) {
  testFixedCLI().catch(console.error);
}

module.exports = { testFixedCLI }; 