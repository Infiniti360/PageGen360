const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');
const path = require('path');
const fs = require('fs');

// 🎯 SHOW FILE LOCATION
// This script clearly shows where POM files are generated

async function showFileLocation() {
  console.log('🎯 POM File Generation Location');
  console.log('📝 This will show you exactly where files are saved\n');

  try {
    // Get current directory
    const currentDir = process.cwd();
    console.log('📍 Current Directory:', currentDir);
    
    // Show where files will be generated
    const outputDir = path.join(currentDir, 'generated-pom');
    console.log('📁 Output Directory:', outputDir);
    console.log('📁 Relative Path: ./generated-pom/\n');

    // Generate a simple POM to demonstrate
    console.log('🚀 Generating sample POM...');
    
    const generator = new UniversalPOMGenerator({ logLevel: 'info' });
    
    const options = {
      framework: 'playwright',
      language: 'typescript',
      browser: { name: 'chrome', headless: false },
      includeTests: true,
      includeComments: true,
      includeWaitStrategies: true,
      includeErrorHandling: true
    };
    
    const result = await generator.generatePOM('https://example.com', options);
    
    // Generate files
    const fileGenerator = new FileGenerator();
    const files = await fileGenerator.generateFiles(result);
    
    console.log('\n✅ FILES GENERATED!');
    console.log('='.repeat(60));
    console.log('📄 POM Class File:');
    console.log(`   Absolute: ${path.resolve(files.pomClassFile)}`);
    console.log(`   Relative: ${files.pomClassFile}`);
    console.log('');
    console.log('🧪 Test File:');
    console.log(`   Absolute: ${path.resolve(files.testFile)}`);
    console.log(`   Relative: ${files.testFile}`);
    console.log('');
    console.log('📊 Metadata File:');
    console.log(`   Absolute: ${path.resolve(files.metadataFile)}`);
    console.log(`   Relative: ${files.metadataFile}`);
    console.log('='.repeat(60));
    
    // Check if files exist
    console.log('\n🔍 File Existence Check:');
    console.log(`POM Class exists: ${fs.existsSync(files.pomClassFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Test File exists: ${fs.existsSync(files.testFile) ? '✅ YES' : '❌ NO'}`);
    console.log(`Metadata exists: ${fs.existsSync(files.metadataFile) ? '✅ YES' : '❌ NO'}`);
    
    // Show file sizes
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
    
    // Show directory contents
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
    console.log('✅ POM files are generated in: ./generated-pom/');
    console.log('✅ Files are ready to use in your automation projects');
    console.log('✅ You can find them in your file explorer at the path shown above');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// 🚀 RUN THE SCRIPT
if (require.main === module) {
  showFileLocation().catch(console.error);
}

module.exports = { showFileLocation }; 