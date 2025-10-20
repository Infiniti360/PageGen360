# Universal POM Generator

A comprehensive, AI-enhanced Page Object Model (POM) generator that supports multiple testing frameworks and languages.

## 🚀 Features

### Core Functionality
- **Multi-Framework Support**: Selenium, Playwright, Cypress, Puppeteer, TestCafe
- **Multi-Language Support**: TypeScript, JavaScript, Python, Java, C#
- **Element Detection**: Automatic detection of interactive elements
- **Method Generation**: Generate getter, setter, action, and wait methods
- **Code Generation**: Framework-specific code generation with proper imports

### AI Enhancements
- **LLM Integration**: OpenAI, Claude, and custom LLM support
- **MCP Integration**: Model Context Protocol for enhanced tooling
- **Smart Method Naming**: AI-powered method name generation
- **Code Optimization**: AI-suggested improvements and best practices

### Advanced Features
- **Authentication Support**: OAuth2, SAML, Basic Auth, Token-based, SSO
- **Version Management**: Automatic versioning and migration scripts
- **Compatibility Checking**: Backward and forward compatibility analysis
- **Error Handling**: Comprehensive error handling and recovery
- **Wait Strategies**: Intelligent wait strategies for different frameworks

## 📦 Installation

```bash
npm install universal-pom-generator
```

## 🛠️ Usage

### Basic Usage (Public Pages - No Authentication)

```javascript
const { UniversalPOMGenerator } = require('universal-pom-generator');

const generator = new UniversalPOMGenerator({
  logLevel: 'info'
});

// Generate POM for a public page (no login required)
const result = await generator.generatePOM('https://example.com', {
  framework: 'playwright',
  language: 'typescript',
  includeTests: true,
  includeComments: true,
  includeWaitStrategies: true,
  includeErrorHandling: true,
  browser: {
    name: 'chrome',
    headless: true
  }
});

if (result.success) {
  console.log(`Generated ${result.metadata.methodCount} methods`);
  console.log(`Detected ${result.metadata.elementCount} elements`);
  console.log(`Login required: ${result.pom.metadata.loginRequired}`); // false
}
```

### Page Types

#### Public Pages (No Authentication)
```javascript
// Simple landing pages, documentation, news sites, etc.
const result = await generator.generatePOM('https://example.com', {
  framework: 'playwright',
  language: 'typescript',
  browser: { name: 'chrome', headless: true }
});
```

#### Pages with Authentication
```javascript
// Example: Toca Football Staging Site
const result = await generator.generatePOM('https://staging.my.tocafootball.com/home', {
  framework: 'playwright',
  language: 'typescript',
  loginConfig: {
    type: 'basic',
    loginUrl: 'https://staging.my.tocafootball.com/auth/signin/email',
    credentials: {
      username: 'forkrrish@gmail.com',
      password: 'Toca123!'
    },
    selectors: {
      usernameField: 'input[type="email"], input[name="email"]',
      passwordField: 'input[type="password"]',
      submitButton: 'button[type="submit"], input[type="submit"]'
    },
    waitForLogin: {
      type: 'url',
      value: 'home'
    }
  },
  browser: {
    name: 'chrome',
    headless: false
  }
});
```

### With AI Enhancement

```javascript
const result = await generator.generatePOM('https://example.com/dashboard', {
  framework: 'playwright',
  language: 'typescript',
  llmIntegration: {
    provider: 'openai',
    apiKey: 'your_openai_api_key',
    model: 'gpt-4',
    temperature: 0.7
  },
  mcpIntegration: {
    serverUrl: 'https://mcp-server.example.com',
    tools: ['pom_generation', 'element_detection'],
    contextManagement: true
  },
  browser: {
    name: 'chrome',
    headless: true
  }
});
```

## 📋 Examples

### Playwright Example

```javascript
// examples/playwright-example.js
const { UniversalPOMGenerator } = require('../dist/index');

async function playwrightExample() {
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  const result = await generator.generatePOM('https://example.com/dashboard', {
    framework: 'playwright',
    language: 'typescript',
    includeTests: true,
    includeComments: true,
    includeWaitStrategies: true,
    includeErrorHandling: true,
    loginConfig: {
      type: 'basic',
      credentials: { username: 'testuser', password: 'testpass' }
    },
    browser: { name: 'chrome', headless: true }
  });

  if (result.success) {
    console.log('✅ POM generated successfully!');
    console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
    console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
  }
}
```

### Selenium Example

```javascript
// examples/selenium-example.js
const { UniversalPOMGenerator } = require('../dist/index');

async function seleniumExample() {
  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  
  const result = await generator.generatePOM('https://example.com/login', {
    framework: 'selenium',
    language: 'typescript',
    includeTests: true,
    includeComments: true,
    includeWaitStrategies: true,
    includeErrorHandling: true,
    browser: { name: 'chrome', headless: true }
  });

  if (result.success) {
    console.log('✅ POM generated successfully!');
    console.log(`📊 Elements detected: ${result.metadata.elementCount}`);
    console.log(`🔧 Methods generated: ${result.metadata.methodCount}`);
  }
}
```

## 🏗️ Architecture

### Core Components

- **UniversalPOMGenerator**: Main orchestrator class
- **ElementDetector**: Detects interactive elements on web pages
- **POMMethodGenerator**: Generates framework-specific methods
- **CodeGenerator**: Generates code in different languages
- **BrowserManager**: Manages browser automation
- **AuthenticationHandler**: Handles various authentication methods

### AI Components

- **LLMManager**: Manages LLM integrations (OpenAI, Claude, custom)
- **MCPManager**: Manages Model Context Protocol integrations
- **IntegrationManager**: Coordinates AI enhancements

### Utility Components

- **VersionManager**: Handles versioning and compatibility
- **Logger**: Comprehensive logging system

## 🔧 Configuration

### Generation Options

```typescript
interface GenerationOptions {
  framework: 'selenium' | 'playwright' | 'cypress' | 'puppeteer' | 'testcafe';
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'csharp';
  includeTests?: boolean;
  includeComments?: boolean;
  includeWaitStrategies?: boolean;
  includeErrorHandling?: boolean;
  loginConfig?: LoginConfig;
  llmIntegration?: LLMConfig;
  mcpIntegration?: MCPConfig;
  browser?: BrowserConfig;
  versionManagement?: VersionConfig;
}
```

### Browser Configuration

```typescript
interface BrowserConfig {
  name: 'chrome' | 'firefox' | 'safari' | 'edge';
  headless?: boolean;
  userAgent?: string;
  viewport?: { width: number; height: number };
  args?: string[];
  timeout?: number;
}
```

### Authentication Configuration

```typescript
interface LoginConfig {
  type: 'oauth2' | 'saml' | 'basic' | 'token' | 'sso' | 'custom';
  credentials?: Credentials;
  config?: Record<string, any>;
  customScript?: string;
}
```

## 🧪 Testing

Run the examples:

```bash
# Public pages (no authentication)
npm run example:simple
npm run example:public-pages

# Pages with authentication
npm run example:playwright
npm run example:selenium
npm run example:toca-football
npm run example:toca-football-usage

# AI-enhanced example
npm run example:ai-enhanced

# Simple test
node test-simple.js
```

## 📊 Generated Output

The generator creates comprehensive POM classes with:

- **Imports**: Framework-specific imports
- **Constructor**: Proper initialization
- **Getter Methods**: Element locators
- **Action Methods**: Click, type, submit actions
- **Wait Methods**: Explicit and implicit waits
- **Utility Methods**: Screenshots, page title, etc.

### Example Generated Code

```typescript
import { Page, Locator } from "playwright";

export class ExamplecomDashboardPage {
  constructor(private page: Page) {}

  getLoginButton(): WebElement {
    return page.locator("#login-button");
  }

  clickLoginButton(): void {
    page.locator("#login-button").click();
  }

  waitLoginButton(): void {
    page.locator("#login-button").waitFor({ timeout: timeout });
  }

  waitForPageLoad(): void {
    page.waitForLoadState('networkidle');
  }

  getPageTitle(): string {
    return page.title();
  }

  takeScreenshot(): string {
    const screenshotPath = filename || 'screenshot.png';
    await page.screenshot({ path: screenshotPath });
    return screenshotPath;
  }
}
```

## 🔄 Version Management

The generator supports automatic versioning and migration:

```javascript
// Update existing POM
const updateResult = await generator.updatePOM('https://example.com', existingPOM, options);

// Check compatibility
const compatibility = await generator.checkCompatibility(oldPOM, newPOM);

// Generate migration script
const migrationScript = await generator.generateMigrationScript(oldPOM, newPOM);
```

## 🤖 AI Enhancements

### LLM Integration

```javascript
const result = await generator.generatePOM(url, {
  // ... other options
  llmIntegration: {
    provider: 'openai',
    apiKey: 'your_api_key',
    model: 'gpt-4',
    temperature: 0.7
  }
});
```

### MCP Integration

```javascript
const result = await generator.generatePOM(url, {
  // ... other options
  mcpIntegration: {
    serverUrl: 'https://mcp-server.example.com',
    tools: ['pom_generation', 'element_detection'],
    contextManagement: true
  }
});
```

## 📈 Performance

- **Element Detection**: ~1-2 seconds per page
- **Method Generation**: ~500ms for typical pages
- **Code Generation**: ~200ms for TypeScript/JavaScript
- **AI Enhancement**: Varies by LLM provider (2-10 seconds)

## 🛡️ Error Handling

The generator includes comprehensive error handling:

- **Browser Errors**: Automatic retry and fallback
- **Authentication Errors**: Detailed error messages and recovery
- **Network Errors**: Timeout handling and retry logic
- **Validation Errors**: Schema validation with helpful messages

## 🔧 Development

### Building

```bash
# TypeScript compilation
npm run build

# Development build
npm run dev

# Webpack build (for browser usage)
npm run build:webpack
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Linting
npm run lint

# Formatting
npm run format
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: This README and inline code comments
- **Examples**: See the `examples/` directory

## 🎯 Roadmap

- [ ] Webpack browser build optimization
- [ ] Additional framework support (Appium, TestNG)
- [ ] Enhanced AI capabilities
- [ ] Plugin system for custom generators
- [ ] Cloud-based generation service
- [ ] Real-time collaboration features 