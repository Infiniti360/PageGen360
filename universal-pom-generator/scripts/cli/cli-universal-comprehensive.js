#!/usr/bin/env node

// Simple, friendly CLI for Universal POM Generator with login and MCP AI flags
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const distIndex = path.join(__dirname, '../../dist/index');
let UniversalPOMGenerator;
try {
  ({ UniversalPOMGenerator } = require(distIndex));
} catch (e) {
  console.error('Build artifacts not found. Please run: npm run build');
  process.exit(1);
}

function showHelp() {
  console.log(`\nUniversal POM Generator (with login + MCP AI flags)\n\nUsage:\n  node scripts/cli/cli-universal-comprehensive.js generate [options]\n  node scripts/cli/cli-universal-comprehensive.js interactive\n\nOptions:\n  --url <url>                 Target page URL\n  --framework <name>          Framework: cypress|playwright|selenium|puppeteer|testcafe (default: cypress)\n  --language <name>           Language: typescript|javascript (default: typescript)\n  --browser <name>            Browser: chrome|firefox|safari|edge (default: chrome)\n  --headless                  Run browser headless\n  --output <dir>              Output directory (default: ./generated-pom)\n\nLogin (optional):\n  --login-url <url>           Login page URL\n  --username <value>          Username/email\n  --password <value>          Password\n\nMCP AI (optional):\n  --mcp-server <url>          MCP server URL\n  --mcp-tools <a,b,c>         MCP tools list (comma-separated)\n  --mcp-ai-provider <name>    AI provider: openai|claude|custom\n  --mcp-ai-model <name>       AI model identifier\n\nExamples:\n  node scripts/cli/cli-universal-comprehensive.js generate \\\n    --url https://example.com --framework cypress --language typescript\n\n  node scripts/cli/cli-universal-comprehensive.js generate \\\n    --url https://staging.example.com/app \\\n    --login-url https://staging.example.com/login \\\n    --username user@example.com --password secret\n\n  node scripts/cli/cli-universal-comprehensive.js generate \\\n    --url https://example.com \\\n    --mcp-server http://localhost:3000 \\\n    --mcp-tools pom_generation,element_detection \\\n    --mcp-ai-provider openai --mcp-ai-model gpt-4o\n`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const config = {
    mode: 'generate',
    url: null,
    framework: 'cypress',
    language: 'typescript',
    browser: 'chrome',
    headless: false,
    output: './generated-pom',
    loginUrl: null,
    username: null,
    password: null,
    mcpServer: null,
    mcpTools: null,
    mcpAiProvider: null,
    mcpAiModel: null,
    waitForSelector: null,
    interactive: false,
  };

  if (args.length > 0 && !args[0].startsWith('--')) {
    config.mode = args[0];
    args.shift();
  }

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      case '--url':
        config.url = args[++i];
        break;
      case '--framework':
        config.framework = args[++i];
        break;
      case '--language':
        config.language = args[++i];
        break;
      case '--browser':
        config.browser = args[++i];
        break;
      case '--headless':
        config.headless = true;
        break;
      case '--output':
        config.output = args[++i];
        break;
      case '--login-url':
        config.loginUrl = args[++i];
        break;
      case '--username':
        config.username = args[++i];
        break;
      case '--password':
        config.password = args[++i];
        break;
      case '--wait-for-selector':
        config.waitForSelector = args[++i];
        break;
      case '--mcp-server':
        config.mcpServer = args[++i];
        break;
      case '--mcp-tools':
        config.mcpTools = args[++i];
        break;
      case '--mcp-ai-provider':
        config.mcpAiProvider = args[++i];
        break;
      case '--mcp-ai-model':
        config.mcpAiModel = args[++i];
        break;
      case '--interactive':
        config.interactive = true;
        break;
      default:
        console.log(`Unknown option: ${a}`);
        showHelp();
        process.exit(1);
    }
  }
  return config;
}

async function promptInteractive(base) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((r) => rl.question(q, (ans) => r(ans.trim())));

  const url = base.url || (await ask('Enter the target URL: '));
  const framework = base.framework || (await ask('Framework (cypress/playwright/selenium/puppeteer/testcafe) [cypress]: ')) || 'cypress';
  const language = base.language || (await ask('Language (typescript/javascript) [typescript]: ')) || 'typescript';
  const browser = base.browser || (await ask('Browser (chrome/firefox/safari/edge) [chrome]: ')) || 'chrome';
  const headlessAns = await ask('Headless? (y/n) [n]: ');
  const headless = /^y(es)?$/i.test(headlessAns);
  const output = base.output || (await ask('Output directory [./generated-pom]: ')) || './generated-pom';

  const needsLogin = await ask('Does the page require login? (y/n) [n]: ');
  let loginUrl = null, username = null, password = null;
  if (/^y(es)?$/i.test(needsLogin)) {
    loginUrl = await ask('Login URL: ');
    username = await ask('Username/email: ');
    password = await ask('Password: ');
    const wfs = await ask('After login, wait for a selector on the target page? (css selector, optional): ');
    base.waitForSelector = base.waitForSelector || (wfs || null);
  }

  const useMcp = await ask('Use MCP AI? (y/n) [n]: ');
  let mcpServer = null, mcpTools = null, mcpAiProvider = null, mcpAiModel = null;
  if (/^y(es)?$/i.test(useMcp)) {
    mcpServer = await ask('MCP server URL (e.g., http://localhost:3000): ');
    mcpTools = await ask('MCP tools (comma-separated, e.g., pom_generation,element_detection): ');
    mcpAiProvider = await ask('MCP AI provider (openai/claude/custom) [openai]: ') || 'openai';
    mcpAiModel = await ask('MCP AI model (e.g., gpt-4o): ');
  }

  rl.close();
  return { url, framework, language, browser, headless, output, loginUrl, username, password, mcpServer, mcpTools, mcpAiProvider, mcpAiModel, waitForSelector: base.waitForSelector || null };
}

function toGenerationOptions(cfg) {
  const gen = {
    framework: cfg.framework,
    language: cfg.language,
    url: cfg.url,
    includeComments: true,
    includeWaitStrategies: true,
    includeErrorHandling: true,
    browser: {
      name: cfg.browser,
      headless: cfg.headless,
      viewport: { width: 1920, height: 1080 },
      timeout: 30000,
    },
  };
  if (cfg.waitForSelector) {
    gen.waitForSelector = cfg.waitForSelector;
  }
  if (cfg.loginUrl && cfg.username && cfg.password) {
    gen.loginConfig = {
      type: 'basic',
      loginUrl: cfg.loginUrl,
      credentials: { username: cfg.username, password: cfg.password },
      selectors: {
        usernameField: "input[type='email'], input[type='text'], input[name='username'], input[name='email']",
        passwordField: "input[type='password']",
        submitButton: "button[type='submit'], input[type='submit']",
      },
    };
  }
  if (cfg.mcpServer && cfg.mcpTools) {
    gen.mcpIntegration = {
      serverUrl: cfg.mcpServer,
      tools: cfg.mcpTools.split(',').map((s) => s.trim()).filter(Boolean),
      contextManagement: true,
      aiConfig: cfg.mcpAiProvider ? { provider: cfg.mcpAiProvider, model: cfg.mcpAiModel || undefined } : undefined,
    };
  }
  return gen;
}

async function run() {
  const cfg = parseArgs(process.argv);

  if (cfg.mode === 'interactive' || cfg.interactive) {
    const answers = await promptInteractive(cfg);
    Object.assign(cfg, answers);
  }

  if (cfg.mode !== 'generate' && cfg.mode !== 'interactive') {
    showHelp();
    process.exit(1);
  }

  if (!cfg.url) {
    console.error('Error: --url is required (or use interactive mode).');
    showHelp();
    process.exit(1);
  }

  if (!fs.existsSync(cfg.output)) {
    fs.mkdirSync(cfg.output, { recursive: true });
  }

  const generator = new UniversalPOMGenerator({ logLevel: 'info' });
  const generationOptions = toGenerationOptions(cfg);

  console.log('Configuration:');
  console.log(JSON.stringify({ ...cfg, password: cfg.password ? '***' : undefined }, null, 2));

  try {
    const result = await generator.generatePOM(cfg.url, generationOptions);
    if (!result.success) {
      console.error('Generation failed:', result.errors);
      process.exit(1);
    }

    try {
      const { FileGenerator } = require(path.join(__dirname, '../../dist/utils/FileGenerator'));
      const fileGen = new FileGenerator();
      await fileGen.generateFiles(result, cfg.output);
      console.log('Files written to', cfg.output);
    } catch (e) {
      console.warn('Could not auto-write files:', e?.message || e);
    }

    console.log('Done.');
  } catch (e) {
    console.error('Unexpected error:', e?.message || e);
    process.exit(1);
  }
}

if (require.main === module) {
  run();
}


