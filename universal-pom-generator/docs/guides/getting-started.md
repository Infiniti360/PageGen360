# 🚀 Getting Started

Welcome to the Universal POM Generator! This guide will help you get up and running quickly.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **OpenAI API Key**: For AI-enhanced generation (optional but recommended)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd universal-pom-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=your-api-key-here
   ```

## 🎯 Quick Start

### **Basic Generation (No Authentication)**

Generate a POM for a public website:

```bash
npm run generate -- --url https://example.com
```

### **Enhanced Generation (Recommended)**

Generate a POM with proper naming conventions:

```bash
npm run generate-enhanced -- --url https://example.com
```

### **With Authentication**

Generate a POM for a website that requires login:

```bash
npm run generate-enhanced -- --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass
```

## 📁 Generated Files

After running the generator, you'll find these files in the output directory:

```
./generated-pom/
├── ExamplecomPage.ts          # Main POM class
├── ExamplecomPage.test.ts     # Test suite
├── ExamplecomPage.metadata.json # Generation metadata
├── interfaces.ts              # TypeScript interfaces
├── README.md                 # Usage documentation
└── package.json              # Dependencies
```

## 🧪 Running Tests

Test the generated POM:

```bash
# Install Playwright (if using Playwright)
npm install @playwright/test

# Run the generated tests
npx playwright test ./generated-pom/ExamplecomPage.test.ts
```

## 🔧 Configuration Options

### **Basic Options**
- `--url`: Target URL (required)
- `--framework`: Testing framework (playwright, selenium, cypress, etc.)
- `--language`: Programming language (typescript, javascript, python, etc.)
- `--browser`: Browser to use (chrome, firefox, safari, edge)
- `--headless`: Run in headless mode

### **Authentication Options**
- `--login-url`: Login page URL
- `--username`: Username/email
- `--password`: Password

### **Generation Options**
- `--no-tests`: Skip test generation
- `--no-interfaces`: Skip interface generation
- `--output`: Custom output directory
- `--project-name`: Custom project name

## 🎯 Examples

### **E-commerce Website**
```bash
npm run generate-enhanced -- --url https://shop.example.com \
  --login-url https://shop.example.com/login \
  --username customer@example.com --password mypass \
  --framework playwright --language typescript
```

### **Web Application**
```bash
npm run generate-enhanced -- --url https://dashboard.example.com \
  --login-url https://dashboard.example.com/auth \
  --username admin@example.com --password admin123 \
  --framework selenium --language java
```

### **Public Website**
```bash
npm run generate-enhanced -- --url https://news.example.com \
  --framework cypress --language javascript
```

## 🚨 Troubleshooting

### **Common Issues**

1. **OpenAI API Key Required**
   ```
   ❌ OpenAI API Key is required for enhanced generation!
   ```
   **Solution**: Set your OpenAI API key in the `.env` file or use `--api-key` option.

2. **Browser Not Found**
   ```
   ❌ Browser not found: chrome
   ```
   **Solution**: Install the required browser or use a different browser option.

3. **Authentication Failed**
   ```
   ❌ Login failed: Invalid credentials
   ```
   **Solution**: Verify your username and password are correct.

4. **Network Timeout**
   ```
   ❌ Page load timeout
   ```
   **Solution**: Check your internet connection and try again.

### **Getting Help**

- 📖 **Documentation**: Check the [docs/](./docs/) directory
- 🐛 **Issues**: Report bugs on GitHub Issues
- 💬 **Discussions**: Ask questions on GitHub Discussions

## 🎉 Next Steps

1. **Explore Examples**: Check the [examples/](./examples/) directory
2. **Read Documentation**: Browse the [docs/](./docs/) directory
3. **Run Tests**: Test your generated POMs
4. **Customize**: Modify the generated code to fit your needs

---

**Happy POM Generation! 🚀** 