# 📁 Project Structure

This document provides a comprehensive overview of the Universal POM Generator project structure.

## 🏗️ Directory Structure

```
universal-pom-generator/
├── 📁 src/                          # Source code
│   ├── 📁 core/                     # Core POM generation logic
│   │   ├── UniversalPOMGenerator.ts # Main orchestrator class
│   │   ├── ElementDetector.ts       # Element detection logic
│   │   ├── POMMethodGenerator.ts    # Method generation logic
│   │   └── CodeGenerator.ts         # Code generation logic
│   ├── 📁 llm/                      # AI/LLM integration
│   │   └── LLMManager.ts           # OpenAI and other LLM integrations
│   ├── 📁 browser/                  # Browser management
│   │   └── BrowserManager.ts       # Browser automation handling
│   ├── 📁 auth/                     # Authentication handling
│   │   └── AuthenticationHandler.ts # Login and auth logic
│   ├── 📁 utils/                    # Utility functions
│   │   ├── Logger.ts               # Logging utilities
│   │   ├── FileGenerator.ts        # File generation utilities
│   │   └── VersionManager.ts       # Version management
│   ├── 📁 types/                    # TypeScript type definitions
│   │   └── index.ts                # Main type exports
│   └── index.ts                     # Main entry point
├── 📁 scripts/                      # CLI and generator scripts
│   ├── 📁 cli/                     # Command-line interfaces
│   │   ├── cli-universal.js       # Basic CLI
│   │   ├── cli-universal-enhanced.js # Enhanced CLI
│   │   └── cli-universal-interactive.js # Interactive CLI
│   └── 📁 generators/              # POM generators
│       ├── generate-toca-pom.js    # TOCA-specific generator
│       └── generate-toca-pom-enhanced.js # Enhanced TOCA generator
├── 📁 tests/                        # Test files
│   ├── 📁 unit/                    # Unit tests
│   │   ├── core/                   # Core module tests
│   │   ├── llm/                    # LLM module tests
│   │   └── browser/                # Browser module tests
│   ├── 📁 integration/             # Integration tests
│   │   ├── test-*.js              # Various integration tests
│   │   └── debug-*.js             # Debug and troubleshooting tests
│   ├── 📁 e2e/                    # End-to-end tests
│   │   └── e2e-*.js               # End-to-end test scenarios
│   └── setup.ts                    # Test setup configuration
├── 📁 docs/                         # Documentation
│   ├── 📁 guides/                  # User guides
│   │   ├── getting-started.md     # Getting started guide
│   │   ├── authentication.md       # Authentication setup
│   │   ├── frameworks.md           # Framework configuration
│   │   └── ai-enhancement.md       # AI enhancement guide
│   ├── 📁 examples/                # Usage examples
│   │   ├── basic-usage.md         # Basic usage examples
│   │   ├── advanced-config.md     # Advanced configuration
│   │   └── authentication.md       # Authentication examples
│   └── 📁 api/                     # API documentation
│       ├── core.md                 # Core API reference
│       ├── llm.md                  # LLM integration API
│       └── browser.md              # Browser management API
├── 📁 examples/                     # Example implementations
│   ├── 📁 basic/                   # Basic examples
│   │   ├── simple-example.js      # Simple POM generation
│   │   └── universal-examples.js  # Universal usage examples
│   ├── 📁 advanced/                # Advanced examples
│   │   ├── ai-enhanced-example.js # AI-enhanced generation
│   │   ├── playwright-example.js  # Playwright examples
│   │   └── selenium-example.js    # Selenium examples
│   └── 📁 authentication/          # Authentication examples
│       ├── basic-auth-example.js  # Basic authentication
│       ├── oauth-example.js       # OAuth2 examples
│       └── saml-example.js        # SAML examples
├── 📁 generated-pom/               # Generated POM files (basic)
│   ├── *.ts                        # Generated POM classes
│   ├── *.test.ts                   # Generated test files
│   ├── *.metadata.json             # Generation metadata
│   └── README.md                   # Generated documentation
├── 📁 generated-pom-enhanced/      # Generated POM files (enhanced)
│   ├── *.ts                        # Enhanced POM classes
│   ├── *.test.ts                   # Enhanced test files
│   ├── *.metadata.json             # Enhanced metadata
│   └── README.md                   # Enhanced documentation
├── 📁 dist/                        # Compiled JavaScript files
│   ├── core/                       # Compiled core modules
│   ├── llm/                        # Compiled LLM modules
│   ├── browser/                    # Compiled browser modules
│   ├── auth/                       # Compiled auth modules
│   ├── utils/                      # Compiled utility modules
│   └── index.js                    # Compiled main entry point
├── 📄 README.md                    # Main project README
├── 📄 package.json                 # Project configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 jest.config.js               # Jest test configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env                         # Environment variables
└── 📄 PROJECT_STRUCTURE.md         # This file
```

## 📋 File Descriptions

### **Source Code (`src/`)**

#### **Core Module (`src/core/`)**
- **UniversalPOMGenerator.ts**: Main orchestrator class that coordinates all POM generation
- **ElementDetector.ts**: Detects interactive elements on web pages
- **POMMethodGenerator.ts**: Generates framework-specific methods
- **CodeGenerator.ts**: Generates code in different languages

#### **LLM Module (`src/llm/`)**
- **LLMManager.ts**: Manages AI/LLM integrations (OpenAI, Claude, etc.)

#### **Browser Module (`src/browser/`)**
- **BrowserManager.ts**: Handles browser automation and management

#### **Auth Module (`src/auth/`)**
- **AuthenticationHandler.ts**: Manages login flows and authentication

#### **Utils Module (`src/utils/`)**
- **Logger.ts**: Comprehensive logging system
- **FileGenerator.ts**: File generation utilities
- **VersionManager.ts**: Version management and compatibility

### **Scripts (`scripts/`)**

#### **CLI Scripts (`scripts/cli/`)**
- **cli-universal.js**: Basic command-line interface
- **cli-universal-enhanced.js**: Enhanced CLI with better naming
- **cli-universal-interactive.js**: Interactive CLI with prompts

#### **Generator Scripts (`scripts/generators/`)**
- **generate-toca-pom.js**: TOCA-specific POM generator
- **generate-toca-pom-enhanced.js**: Enhanced TOCA generator

### **Tests (`tests/`)**

#### **Unit Tests (`tests/unit/`)**
- Tests for individual modules and functions
- Fast execution, isolated testing

#### **Integration Tests (`tests/integration/`)**
- Tests for module interactions
- End-to-end workflow testing

#### **E2E Tests (`tests/e2e/`)**
- Full system testing
- Real browser automation tests

### **Documentation (`docs/`)**

#### **Guides (`docs/guides/`)**
- User guides and tutorials
- Setup and configuration instructions

#### **Examples (`docs/examples/`)**
- Usage examples and patterns
- Best practices and recommendations

#### **API (`docs/api/`)**
- Technical API documentation
- Reference materials

### **Examples (`examples/`)**

#### **Basic Examples (`examples/basic/`)**
- Simple usage patterns
- Getting started examples

#### **Advanced Examples (`examples/advanced/`)**
- Complex scenarios
- Framework-specific examples

#### **Authentication Examples (`examples/authentication/`)**
- Login flow examples
- Different auth methods

## 🔧 Configuration Files

### **package.json**
- Project metadata and dependencies
- NPM scripts for common tasks
- Binary entry points for CLI tools

### **tsconfig.json**
- TypeScript compilation settings
- Module resolution configuration
- Output directory settings

### **jest.config.js**
- Test framework configuration
- Coverage settings
- Test environment setup

### **.gitignore**
- Files to exclude from version control
- Generated files and dependencies
- Environment-specific files

## 📊 Generated Output

### **Basic Generation (`generated-pom/`)**
- Standard POM classes
- Basic test files
- Simple metadata

### **Enhanced Generation (`generated-pom-enhanced/`)**
- Improved naming conventions
- Comprehensive test suites
- Detailed metadata and documentation

## 🚀 Key Features by Directory

| Directory | Purpose | Key Features |
|-----------|---------|--------------|
| `src/` | Core functionality | POM generation, AI integration, browser management |
| `scripts/` | User interfaces | CLI tools, generators, interactive prompts |
| `tests/` | Quality assurance | Unit, integration, and E2E testing |
| `docs/` | User guidance | Guides, examples, API reference |
| `examples/` | Learning resources | Basic, advanced, and auth examples |
| `generated-*/` | Output storage | Generated POM files and metadata |

## 🎯 Development Workflow

1. **Source Code**: Write/modify code in `src/`
2. **Tests**: Add tests in `tests/`
3. **Documentation**: Update docs in `docs/`
4. **Examples**: Create examples in `examples/`
5. **Build**: Compile with `npm run build`
6. **Test**: Run tests with `npm test`
7. **Generate**: Use CLI tools in `scripts/`

## 📈 Maintenance

### **Regular Tasks**
- Update dependencies in `package.json`
- Regenerate documentation with `npm run docs`
- Clean generated files with `npm run clean`
- Run full test suite with `npm test`

### **Quality Assurance**
- Lint code with `npm run lint`
- Format code with `npm run format`
- Check test coverage
- Validate generated output

---

**This structure ensures clean separation of concerns, easy maintenance, and comprehensive documentation for the Universal POM Generator project.** 