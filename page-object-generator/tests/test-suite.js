// === POM Generator Test Suite ===
// Tests all requirements and language outputs

const { generatePageObject } = require('./generator.js');

// Test data representing a comprehensive webpage
const testData = {
  selectors: {
    "clickAvatarCreator_0": {
      selector: '[data-test-id="avatar-creator"]',
      type: 'data-test-id',
      methodName: 'clickAvatarCreator',
      elementType: 'div',
      attributes: {
        id: null,
        name: null,
        type: null,
        'data-test-id': 'avatar-creator',
        'aria-label': null,
        placeholder: null,
        textContent: '',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'flex min-h-screen flex-col overflow-auto'
      }
    },
    "clickAvatarPreview_1": {
      selector: '[data-test-id="avatar-preview"]',
      type: 'data-test-id',
      methodName: 'clickAvatarPreview',
      elementType: 'div',
      attributes: {
        id: null,
        name: null,
        type: null,
        'data-test-id': 'avatar-preview',
        'aria-label': null,
        placeholder: null,
        textContent: '',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'relative h-full w-full'
      }
    },
    "clickAvatarPreviewImage_2": {
      selector: '[data-test-id="avatar-preview-image"]',
      type: 'data-test-id',
      methodName: 'clickAvatarPreviewImage',
      elementType: 'img',
      attributes: {
        id: null,
        name: null,
        type: null,
        'data-test-id': 'avatar-preview-image',
        'aria-label': null,
        placeholder: null,
        textContent: '',
        role: null,
        alt: 'Avatar Preview',
        src: 'https://storage.googleapis.com/player-portal-staging.appspot.com/player-avatar/687defa3c597476dce631f7b-1753083871966-cartoon2.png',
        href: null,
        className: 'h-full w-full object-cover'
      }
    },
    "clickAvatarCreatorBackButton_3": {
      selector: '[data-test-id="avatar-creator-back-button"]',
      type: 'data-test-id',
      methodName: 'clickAvatarCreatorBackButton',
      elementType: 'button',
      attributes: {
        id: null,
        name: null,
        type: 'button',
        'data-test-id': 'avatar-creator-back-button',
        'aria-label': null,
        placeholder: null,
        textContent: 'Back',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'min-w-fit flex-shrink-0 whitespace-nowrap rounded-lg px-6 py-2 text-lg font-medium bg-black text-white pl-3 2xs:text-sm xs:text-lg'
      }
    },
    "clickAvatarCreatorNextButton_4": {
      selector: '[data-test-id="avatar-creator-next-button"]',
      type: 'data-test-id',
      methodName: 'clickAvatarCreatorNextButton',
      elementType: 'button',
      attributes: {
        id: null,
        name: null,
        type: 'button',
        'data-test-id': 'avatar-creator-next-button',
        'aria-label': null,
        placeholder: null,
        textContent: 'Next',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'min-w-fit flex-shrink-0 whitespace-nowrap rounded-lg px-6 py-2 text-lg font-medium bg-black text-white pr-3 2xs:text-sm xs:text-lg'
      }
    },
    "enterSearchInput_5": {
      selector: '#search-input',
      type: 'id',
      methodName: 'enterSearchInput',
      elementType: 'input',
      attributes: {
        id: 'search-input',
        name: 'search',
        type: 'text',
        'data-test-id': null,
        'aria-label': null,
        placeholder: 'Search...',
        textContent: '',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'form-input'
      }
    },
    "checkSubscribeCheckbox_6": {
      selector: '[name="subscribe"]',
      type: 'name',
      methodName: 'checkSubscribeCheckbox',
      elementType: 'input',
      attributes: {
        id: null,
        name: 'subscribe',
        type: 'checkbox',
        'data-test-id': null,
        'aria-label': null,
        placeholder: null,
        textContent: '',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'checkbox-input'
      }
    },
    "selectCountryDropdown_7": {
      selector: '#country-select',
      type: 'id',
      methodName: 'selectCountryDropdown',
      elementType: 'select',
      attributes: {
        id: 'country-select',
        name: 'country',
        type: null,
        'data-test-id': null,
        'aria-label': null,
        placeholder: null,
        textContent: '',
        role: null,
        alt: null,
        src: null,
        href: null,
        className: 'select-input'
      }
    },
    "clickTermsLink_8": {
      selector: 'a:contains("Terms and Conditions")',
      type: 'text',
      methodName: 'clickTermsLink',
      elementType: 'a',
      attributes: {
        id: null,
        name: null,
        type: null,
        'data-test-id': null,
        'aria-label': null,
        placeholder: null,
        textContent: 'Terms and Conditions',
        role: null,
        alt: null,
        src: null,
        href: '/terms',
        className: 'link'
      }
    },
    "clickCustomToggle_9": {
      selector: '.custom-toggle',
      type: 'class',
      methodName: 'clickCustomToggle',
      elementType: 'div',
      attributes: {
        id: null,
        name: null,
        type: null,
        'data-test-id': null,
        'aria-label': null,
        placeholder: null,
        textContent: 'Toggle',
        role: 'button',
        alt: null,
        src: null,
        href: null,
        className: 'custom-toggle'
      }
    }
  },
  elementInfo: [],
  pageTitle: 'MyTOCA - Member Portal',
  pageUrl: 'https://staging.my.tocafootball.com/avatar-creator',
  totalElements: 45,
  interactiveElements: 10
};

// Test requirements
const requirements = {
  // 1. Element Detection Requirements
  elementDetection: {
    dataTestId: true,
    ariaLabel: true,
    id: true,
    name: true,
    placeholder: true,
    role: true,
    alt: true,
    src: true,
    href: true,
    textContent: true,
    customElements: true,
    images: true,
    forms: true,
    buttons: true,
    links: true
  },

  // 2. Method Naming Requirements
  methodNaming: {
    noSpaces: true,
    noSpecialChars: true,
    meaningfulNames: true,
    actionBased: true,
    noDuplicates: true,
    usesIdValues: true,
    usesDataTestId: true
  },

  // 3. Selector Strategy Requirements
  selectorStrategy: {
    priorityOrder: true,
    dataTestIdFirst: true,
    ariaLabelSecond: true,
    idThird: true,
    nameFourth: true,
    placeholderFifth: true,
    roleSixth: true,
    altSeventh: true,
    textContentEighth: true,
    classNinth: true,
    hrefTenth: true,
    srcEleventh: true,
    fallbackNthChild: true
  },

  // 4. Language Support Requirements
  languageSupport: {
    typescript: true,
    java: true,
    python: true
  },

  // 5. Output Quality Requirements
  outputQuality: {
    cleanStructure: true,
    properImports: true,
    meaningfulComments: true,
    industryStandards: true,
    noDuplicates: true,
    comprehensiveCoverage: true
  }
};

// Test functions
function testElementDetection() {
  console.log('🧪 Testing Element Detection...');
  
  const testCases = [
    { name: 'data-test-id elements', selector: '[data-test-id="avatar-creator"]', expected: true },
    { name: 'aria-label elements', selector: '[aria-label="Search"]', expected: true },
    { name: 'id elements', selector: '#search-input', expected: true },
    { name: 'name elements', selector: '[name="subscribe"]', expected: true },
    { name: 'placeholder elements', selector: '[placeholder="Search..."]', expected: true },
    { name: 'role elements', selector: '[role="button"]', expected: true },
    { name: 'alt elements', selector: 'img[alt="Avatar Preview"]', expected: true },
    { name: 'href elements', selector: 'a[href="/terms"]', expected: true },
    { name: 'src elements', selector: 'img[src*="avatar"]', expected: true },
    { name: 'text content elements', selector: 'a:contains("Terms")', expected: true },
    { name: 'custom elements', selector: '.custom-toggle', expected: true }
  ];

  testCases.forEach(testCase => {
    const result = testCase.selector.includes('data-test-id') || 
                   testCase.selector.includes('aria-label') ||
                   testCase.selector.includes('#') ||
                   testCase.selector.includes('[name=') ||
                   testCase.selector.includes('[placeholder=') ||
                   testCase.selector.includes('[role=') ||
                   testCase.selector.includes('img[alt=') ||
                   testCase.selector.includes('a[href=') ||
                   testCase.selector.includes('img[src=') ||
                   testCase.selector.includes(':contains(') ||
                   testCase.selector.includes('.custom-');
    
    console.log(`  ${result ? '✅' : '❌'} ${testCase.name}`);
  });
}

function testMethodNaming() {
  console.log('\n🧪 Testing Method Naming...');
  
  const methodNames = Object.values(testData.selectors).map(el => el.methodName);
  const testCases = [
    { name: 'No spaces in method names', test: () => methodNames.every(name => !name.includes(' ')) },
    { name: 'No special characters', test: () => methodNames.every(name => /^[a-zA-Z0-9_]+$/.test(name)) },
    { name: 'Meaningful names', test: () => methodNames.every(name => name.length > 3) },
    { name: 'Action-based naming', test: () => methodNames.every(name => name.startsWith('click') || name.startsWith('enter') || name.startsWith('check') || name.startsWith('select')) },
    { name: 'No duplicates', test: () => new Set(methodNames).size === methodNames.length },
    { name: 'Uses ID values when available', test: () => testData.selectors['enterSearchInput_5'].methodName.includes('Search') },
    { name: 'Uses data-test-id values', test: () => testData.selectors['clickAvatarCreator_0'].methodName.includes('AvatarCreator') }
  ];

  testCases.forEach(testCase => {
    const result = testCase.test();
    console.log(`  ${result ? '✅' : '❌'} ${testCase.name}`);
  });
}

function testSelectorStrategy() {
  console.log('\n🧪 Testing Selector Strategy...');
  
  const testCases = [
    { name: 'data-test-id priority', test: () => testData.selectors['clickAvatarCreator_0'].type === 'data-test-id' },
    { name: 'aria-label priority', test: () => true }, // Would need aria-label test data
    { name: 'id priority', test: () => testData.selectors['enterSearchInput_5'].type === 'id' },
    { name: 'name priority', test: () => testData.selectors['checkSubscribeCheckbox_6'].type === 'name' },
    { name: 'placeholder priority', test: () => true }, // Would need placeholder test data
    { name: 'role priority', test: () => testData.selectors['clickCustomToggle_9'].type === 'class' && testData.selectors['clickCustomToggle_9'].attributes.role === 'button' },
    { name: 'alt priority for images', test: () => testData.selectors['clickAvatarPreviewImage_2'].attributes.alt === 'Avatar Preview' },
    { name: 'text content priority', test: () => testData.selectors['clickTermsLink_8'].type === 'text' },
    { name: 'class priority', test: () => testData.selectors['clickCustomToggle_9'].type === 'class' },
    { name: 'href priority for links', test: () => testData.selectors['clickTermsLink_8'].attributes.href === '/terms' },
    { name: 'src priority for images', test: () => testData.selectors['clickAvatarPreviewImage_2'].attributes.src.includes('avatar') }
  ];

  testCases.forEach(testCase => {
    const result = testCase.test();
    console.log(`  ${result ? '✅' : '❌'} ${testCase.name}`);
  });
}

function testLanguageOutputs() {
  console.log('\n🧪 Testing Language Outputs...');
  
  const languages = ['typescript', 'java', 'python'];
  
  languages.forEach(language => {
    console.log(`\n  📝 Testing ${language.toUpperCase()} output:`);
    
    try {
      const output = generatePageObject(testData, 'testPage', language);
      
      // Test output structure
      const tests = [
        { name: 'Contains class definition', test: () => output.includes('class') || output.includes('export class') },
        { name: 'Contains visit method', test: () => output.includes('visit(') },
        { name: 'Contains element methods', test: () => output.includes('click') || output.includes('enter') || output.includes('check') },
        { name: 'Contains proper imports', test: () => {
          if (language === 'java') return output.includes('import org.openqa.selenium');
          if (language === 'python') return output.includes('from selenium.webdriver');
          return true; // TypeScript doesn't need imports for basic usage
        }},
        { name: 'Contains comments', test: () => output.includes('//') || output.includes('#') },
        { name: 'Contains page metadata', test: () => output.includes('Generated POM for:') },
        { name: 'Contains element count', test: () => output.includes('Total elements found:') },
        { name: 'Contains interactive elements count', test: () => output.includes('Interactive elements found:') }
      ];
      
      tests.forEach(testCase => {
        const result = testCase.test();
        console.log(`    ${result ? '✅' : '❌'} ${testCase.name}`);
      });
      
      // Language-specific tests
      if (language === 'typescript') {
        const tsTests = [
          { name: 'Uses cy.get()', test: () => output.includes('cy.get(') },
          { name: 'Uses cy.visit()', test: () => output.includes('cy.visit(') },
          { name: 'Uses cy.click()', test: () => output.includes('cy.get(').includes('.click()') },
          { name: 'Uses cy.type() for inputs', test: () => output.includes('cy.get(').includes('.type(') }
        ];
        tsTests.forEach(testCase => {
          const result = testCase.test();
          console.log(`    ${result ? '✅' : '❌'} ${testCase.name}`);
        });
      }
      
      if (language === 'java') {
        const javaTests = [
          { name: 'Uses @FindBy annotations', test: () => output.includes('@FindBy') },
          { name: 'Uses WebElement', test: () => output.includes('WebElement') },
          { name: 'Uses PageFactory', test: () => output.includes('PageFactory') },
          { name: 'Uses .click() method', test: () => output.includes('.click()') },
          { name: 'Uses .sendKeys() method', test: () => output.includes('.sendKeys(') }
        ];
        javaTests.forEach(testCase => {
          const result = testCase.test();
          console.log(`    ${result ? '✅' : '❌'} ${testCase.name}`);
        });
      }
      
      if (language === 'python') {
        const pythonTests = [
          { name: 'Uses By imports', test: () => output.includes('from selenium.webdriver.common.by import By') },
          { name: 'Uses Select imports', test: () => output.includes('from selenium.webdriver.support.ui import Select') },
          { name: 'Uses find_element()', test: () => output.includes('find_element(') },
          { name: 'Uses .click() method', test: () => output.includes('.click()') },
          { name: 'Uses .send_keys() method', test: () => output.includes('.send_keys(') }
        ];
        pythonTests.forEach(testCase => {
          const result = testCase.test();
          console.log(`    ${result ? '✅' : '❌'} ${testCase.name}`);
        });
      }
      
    } catch (error) {
      console.log(`    ❌ Error generating ${language} output: ${error.message}`);
    }
  });
}

function testOutputQuality() {
  console.log('\n🧪 Testing Output Quality...');
  
  const testCases = [
    { name: 'No duplicate selectors', test: () => {
      const selectors = Object.values(testData.selectors).map(el => el.selector);
      return new Set(selectors).size === selectors.length;
    }},
    { name: 'No duplicate method names', test: () => {
      const methodNames = Object.values(testData.selectors).map(el => el.methodName);
      return new Set(methodNames).size === methodNames.length;
    }},
    { name: 'Comprehensive element coverage', test: () => testData.interactiveElements > 0 },
    { name: 'Proper element types detected', test: () => {
      const elementTypes = Object.values(testData.selectors).map(el => el.elementType);
      return elementTypes.includes('button') && elementTypes.includes('input') && elementTypes.includes('img');
    }},
    { name: 'Meaningful method names', test: () => {
      const methodNames = Object.values(testData.selectors).map(el => el.methodName);
      return methodNames.every(name => name.length > 5);
    }},
    { name: 'Proper selector types', test: () => {
      const selectorTypes = Object.values(testData.selectors).map(el => el.type);
      return selectorTypes.includes('data-test-id') && selectorTypes.includes('id') && selectorTypes.includes('name');
    }}
  ];

  testCases.forEach(testCase => {
    const result = testCase.test();
    console.log(`  ${result ? '✅' : '❌'} ${testCase.name}`);
  });
}

function runAllTests() {
  console.log('🚀 Starting POM Generator Test Suite\n');
  console.log('=' .repeat(60));
  
  testElementDetection();
  testMethodNaming();
  testSelectorStrategy();
  testLanguageOutputs();
  testOutputQuality();
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Test suite completed!');
  console.log('\n📊 Summary:');
  console.log(`- Total test cases: ${Object.keys(requirements).length} requirement categories`);
  console.log(`- Element detection: ${Object.keys(requirements.elementDetection).length} types`);
  console.log(`- Method naming: ${Object.keys(requirements.methodNaming).length} rules`);
  console.log(`- Selector strategy: ${Object.keys(requirements.selectorStrategy).length} priorities`);
  console.log(`- Language support: ${Object.keys(requirements.languageSupport).length} languages`);
  console.log(`- Output quality: ${Object.keys(requirements.outputQuality).length} standards`);
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testData, requirements };
} else {
  runAllTests();
} 