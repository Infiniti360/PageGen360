// Main exports
export { UniversalPOMGenerator } from './core/UniversalPOMGenerator';

// Core exports
export { ElementDetector } from './core/ElementDetector';
export { POMMethodGenerator } from './core/POMMethodGenerator';
export { CodeGenerator } from './core/CodeGenerator';

// Browser exports
export { BrowserManager } from './browser/BrowserManager';

// Authentication exports
export { AuthenticationHandler } from './auth/AuthenticationHandler';

// Integration exports
export { IntegrationManager } from './integration/IntegrationManager';

// MCP exports
export { MCPManagerEnhanced } from './mcp/MCPManagerEnhanced';

// Version exports
export { VersionManager } from './version/VersionManager';

// Type exports
export * from './types';

// Utility exports
export { Logger } from './utils/Logger';

// Default export
import { UniversalPOMGenerator } from './core/UniversalPOMGenerator';
export default UniversalPOMGenerator; 