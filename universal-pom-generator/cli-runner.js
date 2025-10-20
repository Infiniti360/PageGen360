#!/usr/bin/env node

// Non-interactive CLI runner for Universal POM Generator
// Accepts flags and generates files to the specified output directory

const path = require('path');
const fs = require('fs');

// Prefer compiled distribution to avoid requiring a TS build step
const { UniversalPOMGenerator } = require('./dist/index');
const { FileGenerator } = require('./dist/utils/FileGenerator');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const eq = token.indexOf('=');
    const key = token.slice(2, eq > -1 ? eq : undefined);
    let value = '';
    if (eq > -1) {
      value = token.slice(eq + 1);
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      value = argv[++i];
    } else {
      value = 'true';
    }
    args[key] = value;
  }
  return args;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toBoolean(val, def = false) {
  if (val === undefined) return def;
  const v = String(val).toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'y';
}

async function main() {
  const args = parseArgs(process.argv);

  const url = args.url;
  const framework = (args.framework || 'playwright').toLowerCase();
  const language = (args.language || 'typescript').toLowerCase();
  const outputDir = args.output || './generated-pom';

  if (!url) {
    console.error('❌ Missing required flag: --url');
    process.exit(1);
  }

  // Login configuration (optional)
  const loginUrl = args['login-url'];
  const username = args.username;
  const password = args.password;
  const waitForUrl = args['wait-for-url'];

  // MCP/LLM configuration (optional)
  const mcpServer = args['mcp-server'];
  const mcpTools = args['mcp-tools'];
  const mcpAiProvider = args['mcp-ai-provider'];
  const mcpAiModel = args['mcp-ai-model'];

  // LLM API key handling (flag or environment variables)
  const llmApiKey =
    args['llm-api-key'] ||
    process.env.LLM_API_KEY ||
    (mcpAiProvider === 'openai' ? process.env.OPENAI_API_KEY : undefined) ||
    (mcpAiProvider === 'claude' ? process.env.ANTHROPIC_API_KEY : undefined);

  // Browser options
  const headless = toBoolean(args.headless, true);

  console.log('🎯 Universal POM Generator - Non-Interactive Runner');
  console.log(`🌐 URL: ${url}`);
  console.log(`🛠️ Framework: ${framework}`);
  console.log(`💻 Language: ${language}`);
  console.log(`📦 Output: ${path.resolve(outputDir)}`);
  if (loginUrl) {
    console.log('🔐 Login: enabled');
    console.log(`   Login URL: ${loginUrl}`);
    console.log(`   Username: ${username ? '[provided]' : '[missing]'}`);
  } else {
    console.log('🔐 Login: disabled');
  }
  if (mcpServer) {
    console.log('🧩 MCP: enabled');
    console.log(`   Server: ${mcpServer}`);
    console.log(`   Tools: ${mcpTools || ''}`);
    console.log(`   AI: ${mcpAiProvider || ''} ${mcpAiModel || ''}`);
  } else {
    console.log('🧩 MCP: disabled');
  }
  if (mcpAiProvider || mcpAiModel) {
    console.log(`🤖 LLM: ${mcpAiProvider || 'custom'} ${mcpAiModel || ''} ${llmApiKey ? '(api key detected)' : '(no api key)'}`);
  }

  const generator = new UniversalPOMGenerator({
    logLevel: 'info'
  });

  const chromeArgs = headless ? [] : [
    '--start-maximized',
    '--window-size=1280,900',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--remote-allow-origins=*'
  ];

  const options = {
    framework,
    language,
    includeTests: true,
    includeComments: true,
    includeWaitStrategies: true,
    includeErrorHandling: true,
    browser: { name: 'chrome', headless, args: chromeArgs }
  };

  if (loginUrl && username && password) {
    options.loginConfig = {
      type: 'basic',
      loginUrl,
      credentials: { username, password },
      selectors: {
        usernameField: 'input[type="email"], input[name="email"], input[type="text"]',
        passwordField: 'input[type="password"]',
        submitButton: 'button[type="submit"], input[type="submit"]'
      },
      ...(waitForUrl ? { waitForLogin: { type: 'url', value: waitForUrl } } : {})
    };
  }

  if (mcpServer) {
    options.mcpIntegration = {
      serverUrl: mcpServer,
      tools: typeof mcpTools === 'string' ? mcpTools.split(',').map(t => t.trim()).filter(Boolean) : [],
      contextManagement: true
    };
  }

  // Only enable LLM integration when an API key is available to satisfy schema
  if (llmApiKey) {
    options.llmIntegration = {
      provider: mcpAiProvider || 'openai',
      model: mcpAiModel || 'gpt-4',
      temperature: 0.2,
      apiKey: llmApiKey
    };
  } else if (mcpAiProvider || mcpAiModel) {
    console.warn('⚠️  LLM API key not provided. Skipping LLM integration to avoid validation errors.');
  }

  console.log('\n🚀 Generating POM...');
  const result = await generator.generatePOM(url, options);

  if (!result || !result.success) {
    console.error('❌ POM generation failed.');
    if (result && Array.isArray(result.errors)) {
      result.errors.forEach((e, i) => console.error(`   ${i + 1}. ${e}`));
    }
    process.exit(1);
  }

  ensureDir(outputDir);
  const fileGen = new FileGenerator();
  const files = await fileGen.generateFiles(result, outputDir);

  console.log('\n🎉 SUCCESS! POM Generated and Files Created!');
  console.log(`📄 POM Class: ${path.resolve(files.pomClassFile)}`);
  console.log(`🧪 Test File: ${path.resolve(files.testFile)}`);
  console.log(`📊 Metadata: ${path.resolve(files.metadataFile)}`);
}

main().catch((err) => {
  console.error('💥 Fatal error:', err && err.message ? err.message : err);
  process.exit(1);
});



