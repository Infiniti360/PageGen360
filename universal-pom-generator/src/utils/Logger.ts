/**
 * Universal Logger Utility
 * 
 * Provides consistent logging across the entire application
 * with configurable log levels and formatting.
 */
export class Logger {
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  constructor(logLevel?: 'debug' | 'info' | 'warn' | 'error') {
    if (logLevel) {
      this.logLevel = logLevel;
    }
  }

  /**
   * Set the log level
   */
  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }

  /**
   * Check if a log level should be displayed
   */
  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * Debug logging
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  /**
   * Info logging
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  /**
   * Warning logging
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  /**
   * Error logging
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  /**
   * Log with custom level
   */
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    switch (level) {
      case 'debug':
        this.debug(message, ...args);
        break;
      case 'info':
        this.info(message, ...args);
        break;
      case 'warn':
        this.warn(message, ...args);
        break;
      case 'error':
        this.error(message, ...args);
        break;
    }
  }

  /**
   * Create a child logger with specific context
   */
  child(context: string): Logger {
    const childLogger = new Logger(this.logLevel);
    const originalMethods = {
      debug: childLogger.debug.bind(childLogger),
      info: childLogger.info.bind(childLogger),
      warn: childLogger.warn.bind(childLogger),
      error: childLogger.error.bind(childLogger)
    };

    // Override methods to include context
    childLogger.debug = (message: string, ...args: any[]) => {
      originalMethods.debug(`[${context}] ${message}`, ...args);
    };
    childLogger.info = (message: string, ...args: any[]) => {
      originalMethods.info(`[${context}] ${message}`, ...args);
    };
    childLogger.warn = (message: string, ...args: any[]) => {
      originalMethods.warn(`[${context}] ${message}`, ...args);
    };
    childLogger.error = (message: string, ...args: any[]) => {
      originalMethods.error(`[${context}] ${message}`, ...args);
    };

    return childLogger;
  }
} 