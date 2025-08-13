# 🔑 OpenAI API Key Setup Guide

## Overview

This guide explains how to set up and configure the OpenAI API key for the Universal POM Generator to enable AI-enhanced code generation.

## 🚀 **Quick Setup**

### **Method 1: Environment Variable (Recommended)**

```bash
# Set the API key for current session
export OPENAI_API_KEY="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"

# Make it permanent (add to shell profile)
echo 'export OPENAI_API_KEY="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"' >> ~/.zshrc
```

### **Method 2: .env File (Recommended)**

Create a `.env` file in the project root:

```bash
# Create .env file
cat > .env << 'EOF'
# OpenAI API Configuration
OPENAI_API_KEY=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

# AI Model Configuration
OPENAI_MODEL=gpt-4-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=4000

# MCP Server Configuration
MCP_SERVER_URL=http://localhost:3000

# Browser Configuration
DEFAULT_BROWSER=chrome
DEFAULT_HEADLESS=false

# Framework Configuration
DEFAULT_FRAMEWORK=playwright
DEFAULT_LANGUAGE=typescript
EOF
```

**Note:** The CLI automatically loads the `.env` file, so this is the easiest method!

### **Method 3: Command Line Parameter**

```bash
# Pass API key directly in command
node cli-universal.js --url https://example.com \
  --api-key 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
```

## 🔧 **Configuration Options**

### **AI Model Settings**

```bash
# Use different model
export OPENAI_MODEL=gpt-4

# Adjust creativity (0.0-1.0)
export OPENAI_TEMPERATURE=0.5

# Set maximum tokens
export OPENAI_MAX_TOKENS=2000
```

### **MCP Server Configuration**

```bash
# Set MCP server URL
export MCP_SERVER_URL=http://localhost:3000

# Enable MCP tools
export MCP_TOOLS=enhanced_pom_generation,element_detection
```

## 🧪 **Testing the API Key**

### **Test 1: Basic Website (No Authentication)**

```bash
node cli-universal.js --url https://example.com --headless
```

**Expected Output:**
```
✅ POM Generation Successful!
📊 Generated Class: ExamplecomPage
🔧 Methods Count: 10
⏱️  Generation Time: 1991ms
```

### **Test 2: Website with Authentication**

```bash
node cli-universal.js --url https://staging.my.tocafootball.com/home \
  --login-url https://staging.my.tocafootball.com/auth/signin/email \
  --username forkrrish@gmail.com --password Toca123! --headless
```

**Expected Output:**
```
✅ POM Generation Successful!
📊 Generated Class: StagingmytocafootballcomHomePage
🔧 Methods Count: 26
⏱️  Generation Time: 14598ms
```

## 🔒 **Security Best Practices**

### **1. Environment Variables (Recommended)**

```bash
# Set in your shell profile (~/.zshrc, ~/.bashrc, etc.)
export OPENAI_API_KEY="your-api-key-here"
```

### **2. .env File (Project-Specific)**

```bash
# Create .env file (already added to .gitignore)
echo ".env" >> .gitignore
```

### **3. CI/CD Integration**

```yaml
# GitHub Actions example
- name: Generate POM
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    node cli-universal.js --url ${{ secrets.TARGET_URL }}
```

## 🎯 **API Key Benefits**

### **Enhanced Code Generation**
- ✅ **Better Method Names**: AI generates semantic, descriptive method names
- ✅ **Comprehensive Documentation**: JSDoc comments for all methods
- ✅ **Error Handling**: Intelligent error handling and recovery
- ✅ **Type Safety**: Proper TypeScript interfaces and types
- ✅ **Best Practices**: Follows industry standards and patterns

### **Example Comparison**

**Without AI (Basic Generation):**
```typescript
getRoot_hibalakrishnanba(): WebElement {
  return page.locator("#root_hibalakrishnanba");
}
```

**With AI (Enhanced Generation):**
```typescript
/**
 * Get the player age element
 * @returns Locator for the player age display
 */
async getPlayerAge(): Promise<number> {
  const ageText = await this.playerAge.textContent();
  return parseInt(ageText?.replace(/\D/g, '') || '0');
}
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **API Key Not Set**
   ```
   ❌ OpenAI API Key is required for enhanced generation!
   💡 Set OPENAI_API_KEY environment variable or use --api-key option
   ```
   **Solution:** Set the environment variable or pass via command line

2. **Invalid API Key**
   ```
   ❌ OpenAI API Error: Invalid API key
   ```
   **Solution:** Check your API key format and validity

3. **Rate Limiting**
   ```
   ❌ OpenAI API Error: Rate limit exceeded
   ```
   **Solution:** Wait a moment and try again, or upgrade your OpenAI plan

4. **Network Issues**
   ```
   ❌ OpenAI API Error: Network error
   ```
   **Solution:** Check your internet connection and OpenAI service status

### **Verification Commands**

```bash
# Check if API key is set
echo $OPENAI_API_KEY

# Test API key with curl
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test POM generation
node cli-universal.js --url https://example.com --headless
```

## 📊 **Usage Examples**

### **Basic Usage**
```bash
# Generate POM for any website
node cli-universal.js --url https://example.com
```

### **With Authentication**
```bash
# Generate POM with login
node cli-universal.js --url https://app.example.com \
  --login-url https://app.example.com/login \
  --username user@example.com --password mypass
```

### **Different Framework**
```bash
# Generate Selenium POM
node cli-universal.js --url https://example.com \
  --framework selenium --language java
```

### **Custom Configuration**
```bash
# Generate with custom settings
node cli-universal.js --url https://example.com \
  --api-key your-custom-key \
  --output ./my-pom \
  --project-name MyCustomApp
```

## 🎉 **Success Indicators**

When the API key is working correctly, you should see:

1. **Successful Generation**
   ```
   ✅ POM Generation Successful!
   📊 Generated Class: [ClassName]
   🔧 Methods Count: [Number]
   ```

2. **AI-Enhanced Features**
   - Semantic method names
   - Comprehensive documentation
   - TypeScript interfaces
   - Error handling
   - Best practices

3. **Quality Output**
   - Clean, maintainable code
   - Proper naming conventions
   - Comprehensive test coverage
   - Professional documentation

## 🔄 **Migration from Non-AI Generation**

If you were previously using the tool without AI enhancement:

1. **Set the API key** using one of the methods above
2. **Test with a simple website** to verify it works
3. **Regenerate existing POMs** to get AI-enhanced versions
4. **Update your CI/CD pipelines** to include the API key

## 📈 **Performance Impact**

- **Generation Time**: AI-enhanced generation takes 2-3x longer but produces much better code
- **Code Quality**: Significantly improved naming, documentation, and structure
- **Maintainability**: AI-generated code is easier to understand and maintain
- **Test Coverage**: More comprehensive test scenarios and assertions

## 🎯 **Conclusion**

The OpenAI API key enables powerful AI-enhanced POM generation that produces professional-quality, maintainable code with proper naming conventions, comprehensive documentation, and industry best practices. The investment in setup time is well worth the quality improvements in the generated code. 