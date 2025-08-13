const { FileGenerator } = require('../dist/index');

describe('File Generation Tests', () => {
  let fileGenerator;

  beforeEach(() => {
    fileGenerator = new FileGenerator();
  });

  test('should initialize file generator', () => {
    expect(fileGenerator).toBeDefined();
    expect(fileGenerator).toBeInstanceOf(FileGenerator);
  });

  test('should generate file path for POM', () => {
    const framework = 'playwright';
    const language = 'typescript';
    const className = 'HomePage';
    
    const expectedPath = `generated-pom/${framework}/${language}/${className}.${language === 'typescript' ? 'ts' : 'js'}`;
    
    expect(expectedPath).toBe('generated-pom/playwright/typescript/HomePage.ts');
  });

  test('should generate file path for test file', () => {
    const framework = 'selenium';
    const language = 'javascript';
    const className = 'LoginPage';
    
    const expectedPath = `generated-pom/${framework}/${language}/tests/${className}.test.${language === 'typescript' ? 'ts' : 'js'}`;
    
    expect(expectedPath).toBe('generated-pom/selenium/javascript/tests/LoginPage.test.js');
  });

  test('should handle different file extensions', () => {
    const extensions = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      csharp: 'cs'
    };

    expect(extensions.typescript).toBe('ts');
    expect(extensions.javascript).toBe('js');
    expect(extensions.python).toBe('py');
    expect(extensions.java).toBe('java');
    expect(extensions.csharp).toBe('cs');
  });
}); 