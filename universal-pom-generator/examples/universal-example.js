/**
 * Universal POM Generator Example
 * 
 * This example demonstrates how the CodeGenerator can handle ANY webpage
 * in the world, automatically detecting elements and generating appropriate code.
 */

const { CodeGenerator } = require('../dist/core/CodeGenerator');

// Example 1: E-commerce Website
async function generateEcommercePOM() {
  console.log('🛍️ Generating POM for E-commerce Website...');
  
  const generator = new CodeGenerator();
  
  // Sample e-commerce elements (would be auto-detected in real usage)
  const ecommerceElements = [
    {
      id: 'search-input',
      tagName: 'input',
      type: 'text',
      placeholder: 'Search products...',
      cssSelector: 'input[placeholder="Search products..."]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { type: 'text', placeholder: 'Search products...' },
      position: { x: 100, y: 50, width: 300, height: 40 }
    },
    {
      id: 'add-to-cart-btn',
      tagName: 'button',
      text: 'Add to Cart',
      cssSelector: 'button[data-testid="add-to-cart"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { 'data-testid': 'add-to-cart' },
      position: { x: 200, y: 400, width: 120, height: 45 }
    },
    {
      id: 'shopping-cart',
      tagName: 'div',
      cssSelector: '.shopping-cart',
      isInteractive: false,
      isVisible: true,
      children: [],
      attributes: { class: 'shopping-cart' },
      position: { x: 800, y: 50, width: 200, height: 300 }
    },
    {
      id: 'product-title',
      tagName: 'h1',
      text: 'Premium Wireless Headphones',
      cssSelector: 'h1.product-title',
      isInteractive: false,
      isVisible: true,
      children: [],
      attributes: { class: 'product-title' },
      position: { x: 100, y: 150, width: 400, height: 40 }
    }
  ];

  const options = {
    framework: 'playwright',
    language: 'typescript',
    url: 'https://shop.example.com/products/headphones',
    elements: ecommerceElements
  };

  const result = await generator.generateCode(ecommerceElements, [], options);
  
  console.log('✅ E-commerce POM Generated Successfully!');
  console.log(`📊 Elements detected: ${result.metadata.statistics.totalElements}`);
  console.log(`🏷️ Element breakdown:`, result.metadata.statistics.elementBreakdown);
  
  return result;
}

// Example 2: Social Media Platform
async function generateSocialMediaPOM() {
  console.log('📱 Generating POM for Social Media Platform...');
  
  const generator = new CodeGenerator();
  
  const socialMediaElements = [
    {
      id: 'post-input',
      tagName: 'textarea',
      placeholder: 'What\'s on your mind?',
      cssSelector: 'textarea[placeholder="What\'s on your mind?"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { placeholder: 'What\'s on your mind?' },
      position: { x: 100, y: 100, width: 500, height: 100 }
    },
    {
      id: 'post-button',
      tagName: 'button',
      text: 'Post',
      cssSelector: 'button[data-testid="post-button"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { 'data-testid': 'post-button' },
      position: { x: 500, y: 220, width: 80, height: 40 }
    },
    {
      id: 'profile-avatar',
      tagName: 'img',
      alt: 'Profile Picture',
      src: '/avatars/user123.jpg',
      cssSelector: 'img[alt="Profile Picture"]',
      isInteractive: false,
      isVisible: true,
      children: [],
      attributes: { alt: 'Profile Picture', src: '/avatars/user123.jpg' },
      position: { x: 50, y: 50, width: 50, height: 50 }
    },
    {
      id: 'notifications-bell',
      tagName: 'button',
      cssSelector: 'button[aria-label="Notifications"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { 'aria-label': 'Notifications' },
      position: { x: 750, y: 50, width: 40, height: 40 }
    }
  ];

  const options = {
    framework: 'cypress',
    language: 'typescript',
    url: 'https://social.example.com/feed',
    elements: socialMediaElements
  };

  const result = await generator.generateCode(socialMediaElements, [], options);
  
  console.log('✅ Social Media POM Generated Successfully!');
  console.log(`📊 Elements detected: ${result.metadata.statistics.totalElements}`);
  console.log(`🏷️ Element breakdown:`, result.metadata.statistics.elementBreakdown);
  
  return result;
}

// Example 3: Business Dashboard
async function generateDashboardPOM() {
  console.log('📊 Generating POM for Business Dashboard...');
  
  const generator = new CodeGenerator();
  
  const dashboardElements = [
    {
      id: 'revenue-chart',
      tagName: 'canvas',
      cssSelector: 'canvas[data-testid="revenue-chart"]',
      isInteractive: false,
      isVisible: true,
      children: [],
      attributes: { 'data-testid': 'revenue-chart' },
      position: { x: 100, y: 200, width: 400, height: 300 }
    },
    {
      id: 'date-picker',
      tagName: 'input',
      type: 'date',
      cssSelector: 'input[type="date"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { type: 'date' },
      position: { x: 600, y: 100, width: 150, height: 40 }
    },
    {
      id: 'export-button',
      tagName: 'button',
      text: 'Export Report',
      cssSelector: 'button[data-testid="export-report"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { 'data-testid': 'export-report' },
      position: { x: 600, y: 150, width: 120, height: 40 }
    },
    {
      id: 'metrics-summary',
      tagName: 'div',
      cssSelector: '.metrics-summary',
      isInteractive: false,
      isVisible: true,
      children: [],
      attributes: { class: 'metrics-summary' },
      position: { x: 100, y: 100, width: 300, height: 80 }
    }
  ];

  const options = {
    framework: 'selenium',
    language: 'java',
    url: 'https://dashboard.example.com/analytics',
    elements: dashboardElements
  };

  const result = await generator.generateCode(dashboardElements, [], options);
  
  console.log('✅ Dashboard POM Generated Successfully!');
  console.log(`📊 Elements detected: ${result.metadata.statistics.totalElements}`);
  console.log(`🏷️ Element breakdown:`, result.metadata.statistics.elementBreakdown);
  
  return result;
}

// Example 4: Content Management System
async function generateCMSPOM() {
  console.log('📝 Generating POM for Content Management System...');
  
  const generator = new CodeGenerator();
  
  const cmsElements = [
    {
      id: 'title-input',
      tagName: 'input',
      type: 'text',
      placeholder: 'Enter article title...',
      cssSelector: 'input[placeholder="Enter article title..."]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { type: 'text', placeholder: 'Enter article title...' },
      position: { x: 100, y: 100, width: 400, height: 40 }
    },
    {
      id: 'content-editor',
      tagName: 'div',
      cssSelector: '[contenteditable="true"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { contenteditable: 'true' },
      position: { x: 100, y: 160, width: 600, height: 400 }
    },
    {
      id: 'publish-button',
      tagName: 'button',
      text: 'Publish',
      cssSelector: 'button[data-testid="publish-button"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { 'data-testid': 'publish-button' },
      position: { x: 100, y: 580, width: 100, height: 40 }
    },
    {
      id: 'media-upload',
      tagName: 'input',
      type: 'file',
      accept: 'image/*',
      cssSelector: 'input[type="file"]',
      isInteractive: true,
      isVisible: true,
      children: [],
      attributes: { type: 'file', accept: 'image/*' },
      position: { x: 220, y: 580, width: 200, height: 40 }
    }
  ];

  const options = {
    framework: 'puppeteer',
    language: 'javascript',
    url: 'https://cms.example.com/articles/new',
    elements: cmsElements
  };

  const result = await generator.generateCode(cmsElements, [], options);
  
  console.log('✅ CMS POM Generated Successfully!');
  console.log(`📊 Elements detected: ${result.metadata.statistics.totalElements}`);
  console.log(`🏷️ Element breakdown:`, result.metadata.statistics.elementBreakdown);
  
  return result;
}

// Example 5: Universal Element Detection (No Elements Provided)
async function generateUniversalPOM() {
  console.log('🌍 Generating Universal POM (Auto-detection)...');
  
  const generator = new CodeGenerator();
  
  const options = {
    framework: 'playwright',
    language: 'typescript',
    url: 'https://any-website-in-the-world.com'
    // No elements provided - will use universal fallback elements
  };

  const result = await generator.generateCode([], [], options);
  
  console.log('✅ Universal POM Generated Successfully!');
  console.log(`📊 Elements detected: ${result.metadata.statistics.totalElements}`);
  console.log(`🏷️ Element breakdown:`, result.metadata.statistics.elementBreakdown);
  console.log(`🌟 Universality: ${result.metadata.qualityMetrics.universality}`);
  
  return result;
}

// Main execution function
async function runAllExamples() {
  console.log('🚀 Universal POM Generator Examples');
  console.log('=====================================\n');
  
  try {
    // Run all examples
    await generateEcommercePOM();
    console.log('');
    
    await generateSocialMediaPOM();
    console.log('');
    
    await generateDashboardPOM();
    console.log('');
    
    await generateCMSPOM();
    console.log('');
    
    await generateUniversalPOM();
    console.log('');
    
    console.log('🎉 All examples completed successfully!');
    console.log('\n✨ The Universal POM Generator can handle ANY webpage in the world!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export functions for use in other modules
module.exports = {
  generateEcommercePOM,
  generateSocialMediaPOM,
  generateDashboardPOM,
  generateCMSPOM,
  generateUniversalPOM,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
} 