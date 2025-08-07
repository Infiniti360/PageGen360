const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'universal-pom-generator.js',
    library: {
      name: 'UniversalPOMGenerator',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'puppeteer': 'puppeteer',
    'selenium-webdriver': 'selenium-webdriver',
    'playwright': 'playwright',
    'axios': 'axios',
    'ws': 'ws',
    'crypto': 'crypto',
    'uuid': 'uuid',
    'lodash': 'lodash',
    'cheerio': 'cheerio',
    'jsdom': 'jsdom',
    'openai': 'openai',
    '@anthropic-ai/sdk': '@anthropic-ai/sdk',
    'zod': 'zod',
    'dotenv': 'dotenv'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/core': path.resolve(__dirname, 'src/core'),
      '@/auth': path.resolve(__dirname, 'src/auth'),
      '@/version': path.resolve(__dirname, 'src/version'),
      '@/browser': path.resolve(__dirname, 'src/browser'),
      '@/mcp': path.resolve(__dirname, 'src/mcp'),
      '@/llm': path.resolve(__dirname, 'src/llm'),
      '@/integration': path.resolve(__dirname, 'src/integration'),
      '@/utils': path.resolve(__dirname, 'src/utils')
    },
    fallback: {
      'fs': false,
      'path': false,
      'os': false,
      'crypto': false,
      'stream': false,
      'util': false,
      'buffer': false,
      'events': false,
      'assert': false,
      'constants': false,
      'domain': false,
      'punycode': false,
      'querystring': false,
      'string_decoder': false,
      'sys': false,
      'timers': false,
      'tty': false,
      'url': false,
      'http': false,
      'https': false,
      'net': false,
      'child_process': false,
      'process': false
    }
  },
  devtool: 'source-map'
}; 