// Test setup file for Jest
import { config } from 'dotenv';

// Load environment variables for tests
config({ path: '.env.test' });

// Global test configuration
beforeAll(() => {
  // Set up test environment
  process.env['NODE_ENV'] = 'test';
});

afterAll(() => {
  // Clean up test environment
  process.env['NODE_ENV'] = 'development';
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 