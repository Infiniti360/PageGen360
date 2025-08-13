/**
 * Base interface for all framework-specific page objects
 */
export interface IBasePage {
  // Navigation methods
  navigateToPage(url: string): Promise<void> | void;
  waitForPageLoad(): Promise<void> | void;
  
  // Utility methods
  takeScreenshot(filename?: string): Promise<string> | string;
  getPageTitle(): Promise<string> | string;
  getPageUrl(): Promise<string> | string;
  
  // Validation methods
  validatePageStructure(): Promise<void> | void;
  validateAccessibility(): Promise<void> | void;
  validateResponsiveDesign(): Promise<void> | void;
}

/**
 * Abstract base class that all framework-specific base classes should extend
 */
export abstract class BasePage implements IBasePage {
  protected pageUrl: string = '';
  
  constructor() {}
  
  // Abstract methods that must be implemented by subclasses
  abstract navigateToPage(url: string): Promise<void> | void;
  abstract waitForPageLoad(): Promise<void> | void;
  abstract takeScreenshot(filename?: string): Promise<string> | string;
  abstract getPageTitle(): Promise<string> | string;
  abstract getPageUrl(): Promise<string> | string;
  abstract validatePageStructure(): Promise<void> | void;
  abstract validateAccessibility(): Promise<void> | void;
  abstract validateResponsiveDesign(): Promise<void> | void;
  
  // Common utility methods
  protected generateScreenshotFilename(prefix: string = 'page'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.png`;
  }
  
  protected validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
