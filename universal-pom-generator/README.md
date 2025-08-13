# Universal POM Generator

A powerful, intelligent Page Object Model generator that can handle **any webpage in the world** with automatic element detection, semantic grouping, and multi-framework support.

## 🌟 Key Features

### 🚀 Universal Compatibility
- **Any Webpage**: Works with any website, application, or web portal
- **Multi-Framework**: Supports Playwright, Selenium, Cypress, Puppeteer, and TestCafe
- **Multi-Language**: Generates code in TypeScript, JavaScript, Python, Java, and C#
- **Cross-Platform**: Works on web, mobile, and desktop applications

### 🧠 Intelligent Element Detection
- **Semantic Grouping**: Automatically categorizes elements by function:
  - Navigation Elements (links, menus, breadcrumbs)
  - Form Elements (inputs, selects, textareas)
  - Interactive Elements (buttons, clickable items)
  - Content Elements (headings, paragraphs, text)
  - Media Elements (images, videos, audio)
  - Layout Elements (headers, footers, containers)
  - Utility Elements (loading states, modals)

### 🏗️ Industrial-Standard Code Generation
- **Proper Naming Conventions**: Follows industry best practices
- **Comprehensive Documentation**: Full JSDoc comments and inline documentation
- **Type Safety**: Full TypeScript support with interfaces
- **Error Handling**: Robust error handling and fallbacks
- **Modular Design**: Clean, maintainable code structure

### 🔧 Advanced Capabilities
- **Dynamic Method Generation**: Creates methods based on detected elements
- **Smart Selector Strategy**: Prioritizes data-test-id, ID, CSS, and XPath
- **Universal Test Generation**: Generates comprehensive test suites
- **Performance Optimization**: Built-in performance monitoring and optimization
- **Accessibility Support**: Handles ARIA labels and accessibility features

## 📋 Supported Frameworks

| Framework | Status | Features |
|-----------|--------|----------|
| **Playwright** | ✅ Full Support | Advanced locators, network handling, mobile support |
| **Selenium** | ✅ Full Support | WebDriver, wait strategies, cross-browser |
| **Cypress** | ✅ Full Support | Modern testing, real-time reload, debugging |
| **Puppeteer** | ✅ Full Support | Chrome DevTools, performance monitoring |
| **TestCafe** | ✅ Full Support | Cross-browser, no plugins required |

## 🌍 Universal Page Support

The generator automatically adapts to any type of webpage:

- **E-commerce Sites**: Product pages, shopping carts, checkout flows
- **Social Media**: User profiles, feeds, messaging interfaces
- **Business Applications**: Dashboards, CRUD operations, reporting
- **Content Sites**: Blogs, news, documentation, portfolios
- **Web Applications**: SaaS platforms, admin panels, user portals
- **Mobile Web**: Responsive designs, touch interfaces, mobile-first layouts

## 🚀 Quick Start

### Basic Usage

```typescript
import { CodeGenerator } from './src/core/CodeGenerator';

const generator = new CodeGenerator();

const options = {
  framework: 'playwright',
  language: 'typescript',
  url: 'https://any-website.com',
  elements: detectedElements // Optional: auto-detected if not provided
};

const result = await generator.generateCode(elements, methods, options);
console.log(result.code); // Universal POM code
```

### Generated Code Example

```typescript
/**
 * PlaywrightMainPage - Page Object Model
 * 
 * This class represents the playwright page object with industrial standards
 * and proper naming conventions. It provides methods to interact with all elements
 * on the page following best practices for test automation.
 */
export class PlaywrightMainPage {
  private readonly page: Page;

  // Navigation Elements
  public readonly navigationMenu: Locator;
  public readonly homeLink: Locator;
  public readonly aboutLink: Locator;

  // Form Elements
  public readonly searchInput: Locator;
  public readonly emailField: Locator;
  public readonly submitButton: Locator;

  // Content Elements
  public readonly mainHeading: Locator;
  public readonly descriptionText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize Navigation Elements
    this.navigationMenu = page.locator('nav');
    this.homeLink = page.locator('a[href="/"]');
    this.aboutLink = page.locator('a[href="/about"]');

    // Initialize Form Elements
    this.searchInput = page.locator('input[type="text"]');
    this.emailField = page.locator('input[type="email"]');
    this.submitButton = page.locator('button[type="submit"]');

    // Initialize Content Elements
    this.mainHeading = page.locator('h1');
    this.descriptionText = page.locator('p');
  }

  // Navigation Methods
  async navigateToPage(): Promise<void> {
    await this.page.goto('https://any-website.com');
    await this.waitForPageToLoad();
  }

  // Element Interaction Methods
  async clickHomeLink(): Promise<void> {
    await this.homeLink.click();
  }

  async fillSearchInput(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  // Verification Methods
  async verifyPageIsLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await expect(this.mainHeading).toBeVisible();
  }

  // Data Retrieval Methods
  async getNavigationData(): Promise<any> {
    const data: any = {};
    data.navigationMenu = await this.getElementText(this.navigationMenu);
    data.homeLink = await this.getElementAttribute(this.homeLink, 'href');
    data.aboutLink = await this.getElementAttribute(this.aboutLink, 'href');
    return data;
  }
}
```

## 🔍 Element Detection & Grouping

The generator automatically detects and groups elements by their semantic meaning:

### Navigation Elements
- Links (`<a>` tags)
- Navigation menus (`<nav>`)
- Breadcrumbs
- Pagination controls

### Form Elements
- Input fields (text, email, password)
- Select dropdowns
- Textareas
- Form containers

### Interactive Elements
- Buttons
- Clickable items
- Interactive widgets
- Toggle controls

### Content Elements
- Headings (H1-H6)
- Paragraphs
- Text content
- Rich text areas

### Media Elements
- Images
- Videos
- Audio players
- SVG graphics

### Layout Elements
- Headers and footers
- Main content areas
- Sidebars
- Containers and wrappers

## 🧪 Test Generation

Automatically generates comprehensive test suites for any webpage:

```typescript
test.describe('PlaywrightMainPage Page Tests', () => {
  test('should load page correctly', async () => {
    await page.verifyPageIsLoaded();
  });

  test('should display all required elements', async () => {
    await page.verifyAllRequiredElements();
  });

  test('should handle form interactions', async () => {
    await page.fillSearchInput('test query');
    await page.clickSubmitButton();
  });

  test('should handle navigation', async () => {
    await page.clickHomeLink();
    await page.verifyPageIsLoaded();
  });
});
```

## 🎯 Use Cases

### 1. **E-commerce Testing**
- Product catalog navigation
- Shopping cart management
- Checkout flow automation
- Payment form handling

### 2. **Social Media Applications**
- User profile management
- Content posting and editing
- Friend/follower interactions
- Messaging and notifications

### 3. **Business Applications**
- Dashboard data visualization
- Report generation
- User management
- Data entry forms

### 4. **Content Management**
- Article creation and editing
- Media upload and management
- User authentication
- Content publishing workflows

### 5. **Web Portals**
- Multi-step forms
- File uploads
- Data validation
- User registration flows

## 🔧 Configuration Options

```typescript
interface GenerationOptions {
  framework: 'playwright' | 'selenium' | 'cypress' | 'puppeteer' | 'testcafe';
  language: 'typescript' | 'javascript' | 'python' | 'java' | 'csharp';
  url?: string;
  elements?: Element[];
  includeTests?: boolean;
  includeComments?: boolean;
  includeWaitStrategies?: boolean;
  includeErrorHandling?: boolean;
}
```

## 🚀 Advanced Features

### AI-Enhanced Generation
- **LLM Integration**: OpenAI, Claude, and custom models
- **MCP Support**: Model Context Protocol integration
- **Smart Element Detection**: AI-powered element identification
- **Context-Aware Generation**: Understands page purpose and structure

### Performance Optimization
- **Lazy Loading**: Efficient element initialization
- **Smart Waiting**: Intelligent wait strategies
- **Performance Monitoring**: Built-in metrics collection
- **Resource Optimization**: Minimal memory footprint

### Quality Assurance
- **Code Coverage**: Comprehensive test coverage
- **Type Safety**: Full TypeScript support
- **Documentation**: Auto-generated documentation
- **Best Practices**: Industry-standard patterns

## 📊 Statistics & Metrics

The generator provides detailed analytics:

```typescript
{
  statistics: {
    totalElements: 25,
    interactiveElements: 8,
    formElements: 5,
    navigationElements: 6,
    elementBreakdown: {
      'Navigation Elements': 6,
      'Form Elements': 5,
      'Interactive Elements': 8,
      'Content Elements': 3,
      'Media Elements': 2,
      'Layout Elements': 1
    }
  },
  qualityMetrics: {
    codeCoverage: '95%',
    documentationCoverage: '100%',
    typeSafety: '100%',
    universality: '100%',
    semanticGrouping: 'Intelligent'
  }
}
```

## 🌟 Why Universal POM Generator?

1. **No More Manual Work**: Automatically generates POMs for any webpage
2. **Industry Standards**: Follows best practices and naming conventions
3. **Multi-Framework**: Generate code for your preferred testing framework
4. **Intelligent Detection**: Understands page structure and element relationships
5. **Future-Proof**: Adapts to new web technologies and patterns
6. **Time-Saving**: Reduces POM creation time from hours to minutes
7. **Quality Assurance**: Generates robust, maintainable code
8. **Universal Compatibility**: Works with any website or web application

## 🚀 Get Started Today

Transform your test automation workflow with the Universal POM Generator. Generate professional-grade Page Object Models for any webpage in minutes, not hours.

```bash
npm install universal-pom-generator
npm run build
npm test
```

---

**Built with ❤️ for the testing community** 