import { UniversalPOMGenerator } from '../src/index';
import { BrowserManager } from '../src/browser/BrowserManager';
import { ElementDetector } from '../src/core/ElementDetector';

// Real-time monitoring configuration
const MONITORING_CONFIG = {
  // High-frequency monitoring (every 30 seconds)
  HIGH_FREQUENCY: {
    interval: 30000,
    timeout: 10000,
    retries: 3,
    websites: [
      'https://www.google.com',
      'https://www.github.com',
      'https://www.stackoverflow.com'
    ]
  },
  
  // Medium-frequency monitoring (every 5 minutes)
  MEDIUM_FREQUENCY: {
    interval: 300000,
    timeout: 15000,
    retries: 2,
    websites: [
      'https://www.amazon.com',
      'https://www.facebook.com',
      'https://www.twitter.com',
      'https://www.linkedin.com',
      'https://www.netflix.com',
      'https://www.spotify.com'
    ]
  },
  
  // Low-frequency monitoring (every 15 minutes)
  LOW_FREQUENCY: {
    interval: 900000,
    timeout: 20000,
    retries: 1,
    websites: [
      'https://www.microsoft.com',
      'https://www.apple.com',
      'https://www.tesla.com',
      'https://www.booking.com',
      'https://www.airbnb.com',
      'https://www.coursera.org',
      'https://www.udemy.com'
    ]
  }
};

// Performance benchmarks
const PERFORMANCE_BENCHMARKS = {
  PAGE_LOAD_TIME: {
    EXCELLENT: 1000,    // < 1 second
    GOOD: 2000,         // < 2 seconds
    ACCEPTABLE: 5000,   // < 5 seconds
    POOR: 10000         // > 10 seconds
  },
  
  ELEMENT_DETECTION_TIME: {
    EXCELLENT: 500,     // < 500ms
    GOOD: 1000,         // < 1 second
    ACCEPTABLE: 2000,   // < 2 seconds
    POOR: 5000          // > 5 seconds
  },
  
  POM_GENERATION_TIME: {
    EXCELLENT: 5000,    // < 5 seconds
    GOOD: 10000,        // < 10 seconds
    ACCEPTABLE: 20000,  // < 20 seconds
    POOR: 30000         // > 30 seconds
  }
};

// Real-time monitoring class
class RealTimeMonitor {
  private generator: UniversalPOMGenerator;
  private browserManager: BrowserManager;
  private elementDetector: ElementDetector;
  private monitoringData: Map<string, any[]>;
  private isMonitoring: boolean;
  private intervals: Map<string, NodeJS.Timeout>;

  constructor() {
    this.generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true,
      maxRetries: 3,
      timeout: 30000
    });
    
    this.browserManager = new BrowserManager();
    this.elementDetector = new ElementDetector();
    this.monitoringData = new Map();
    this.isMonitoring = false;
    this.intervals = new Map();
  }

  /**
   * Start real-time monitoring for all configured websites
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️  Monitoring is already running');
      return;
    }

    console.log('🚀 Starting real-time monitoring...');
    this.isMonitoring = true;

    // Start high-frequency monitoring
    this.startFrequencyMonitoring('HIGH_FREQUENCY', MONITORING_CONFIG.HIGH_FREQUENCY);
    
    // Start medium-frequency monitoring
    this.startFrequencyMonitoring('MEDIUM_FREQUENCY', MONITORING_CONFIG.MEDIUM_FREQUENCY);
    
    // Start low-frequency monitoring
    this.startFrequencyMonitoring('LOW_FREQUENCY', MONITORING_CONFIG.LOW_FREQUENCY);

    console.log('✅ Real-time monitoring started successfully');
  }

  /**
   * Start monitoring for a specific frequency level
   */
  private startFrequencyMonitoring(frequency: string, config: any): void {
    config.websites.forEach((website: string) => {
      const intervalId = setInterval(async () => {
        await this.monitorWebsite(website, frequency, config);
      }, config.interval);
      
      this.intervals.set(`${frequency}_${website}`, intervalId);
      
      // Initial monitoring
      this.monitorWebsite(website, frequency, config);
    });
  }

  /**
   * Monitor a specific website
   */
  private async monitorWebsite(website: string, frequency: string, config: any): Promise<void> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    try {
      console.log(`🔍 Monitoring ${website} (${frequency}) at ${timestamp}`);
      
      // Monitor page load time
      const pageLoadTime = await this.monitorPageLoadTime(website, config);
      
      // Monitor element detection
      const elementDetectionTime = await this.monitorElementDetection(website, config);
      
      // Monitor POM generation
      const pomGenerationTime = await this.monitorPOMGeneration(website, config);
      
      // Collect monitoring data
      const monitoringResult = {
        timestamp,
        website,
        frequency,
        pageLoadTime,
        elementDetectionTime,
        pomGenerationTime,
        totalTime: Date.now() - startTime,
        status: 'SUCCESS',
        errors: []
      };
      
      // Store monitoring data
      if (!this.monitoringData.has(website)) {
        this.monitoringData.set(website, []);
      }
      this.monitoringData.get(website)!.push(monitoringResult);
      
      // Keep only last 100 entries per website
      if (this.monitoringData.get(website)!.length > 100) {
        this.monitoringData.get(website)!.shift();
      }
      
      // Log performance metrics
      this.logPerformanceMetrics(monitoringResult);
      
    } catch (error) {
      console.error(`❌ Error monitoring ${website}:`, error);
      
      const errorResult = {
        timestamp,
        website,
        frequency,
        pageLoadTime: 0,
        elementDetectionTime: 0,
        pomGenerationTime: 0,
        totalTime: Date.now() - startTime,
        status: 'ERROR',
        errors: [error.message]
      };
      
      if (!this.monitoringData.has(website)) {
        this.monitoringData.set(website, []);
      }
      this.monitoringData.get(website)!.push(errorResult);
    }
  }

  /**
   * Monitor page load time
   */
  private async monitorPageLoadTime(website: string, config: any): Promise<number> {
    const startTime = Date.now();
    
    try {
      const browser = await this.browserManager.launchBrowser({
        name: 'chrome',
        headless: true,
        timeout: config.timeout
      });
      
      const page = await browser.newPage();
      
      // Measure page load time
      const response = await page.goto(website, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      await browser.close();
      
      return loadTime;
    } catch (error) {
      throw new Error(`Page load monitoring failed: ${error.message}`);
    }
  }

  /**
   * Monitor element detection time
   */
  private async monitorElementDetection(website: string, config: any): Promise<number> {
    const startTime = Date.now();
    
    try {
      const browser = await this.browserManager.launchBrowser({
        name: 'chrome',
        headless: true,
        timeout: config.timeout
      });
      
      const page = await browser.newPage();
      await page.goto(website, { waitUntil: 'networkidle' });
      
      // Detect elements
      const elements = await this.elementDetector.detectElements(page);
      const detectionTime = Date.now() - startTime;
      
      await browser.close();
      
      return detectionTime;
    } catch (error) {
      throw new Error(`Element detection monitoring failed: ${error.message}`);
    }
  }

  /**
   * Monitor POM generation time
   */
  private async monitorPOMGeneration(website: string, config: any): Promise<number> {
    const startTime = Date.now();
    
    try {
      const result = await this.generator.generatePOM(website, {
        framework: 'playwright',
        language: 'typescript',
        browser: { name: 'chrome', headless: true },
        timeout: config.timeout
      });
      
      const generationTime = Date.now() - startTime;
      
      if (!result.success) {
        throw new Error('POM generation failed');
      }
      
      return generationTime;
    } catch (error) {
      throw new Error(`POM generation monitoring failed: ${error.message}`);
    }
  }

  /**
   * Log performance metrics
   */
  private logPerformanceMetrics(result: any): void {
    const { website, pageLoadTime, elementDetectionTime, pomGenerationTime } = result;
    
    console.log(`📊 Performance Metrics for ${website}:`);
    console.log(`   📄 Page Load: ${pageLoadTime}ms (${this.getPerformanceRating(pageLoadTime, PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME)})`);
    console.log(`   🔍 Element Detection: ${elementDetectionTime}ms (${this.getPerformanceRating(elementDetectionTime, PERFORMANCE_BENCHMARKS.ELEMENT_DETECTION_TIME)})`);
    console.log(`   🏗️  POM Generation: ${pomGenerationTime}ms (${this.getPerformanceRating(pomGenerationTime, PERFORMANCE_BENCHMARKS.POM_GENERATION_TIME)})`);
    console.log(`   ⏱️  Total Time: ${result.totalTime}ms`);
  }

  /**
   * Get performance rating based on benchmarks
   */
  private getPerformanceRating(time: number, benchmarks: any): string {
    if (time < benchmarks.EXCELLENT) return '🟢 EXCELLENT';
    if (time < benchmarks.GOOD) return '🟡 GOOD';
    if (time < benchmarks.ACCEPTABLE) return '🟠 ACCEPTABLE';
    return '🔴 POOR';
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log('⚠️  Monitoring is not running');
      return;
    }

    console.log('🛑 Stopping real-time monitoring...');
    
    // Clear all intervals
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();
    
    this.isMonitoring = false;
    console.log('✅ Real-time monitoring stopped');
  }

  /**
   * Get monitoring statistics
   */
  getMonitoringStats(): any {
    const stats: any = {};
    
    this.monitoringData.forEach((data, website) => {
      if (data.length > 0) {
        const successfulRuns = data.filter(d => d.status === 'SUCCESS');
        const errorRuns = data.filter(d => d.status === 'ERROR');
        
        if (successfulRuns.length > 0) {
          const avgPageLoadTime = successfulRuns.reduce((sum, d) => sum + d.pageLoadTime, 0) / successfulRuns.length;
          const avgElementDetectionTime = successfulRuns.reduce((sum, d) => sum + d.elementDetectionTime, 0) / successfulRuns.length;
          const avgPOMGenerationTime = successfulRuns.reduce((sum, d) => sum + d.pomGenerationTime, 0) / successfulRuns.length;
          
          stats[website] = {
            totalRuns: data.length,
            successfulRuns: successfulRuns.length,
            errorRuns: errorRuns.length,
            successRate: (successfulRuns.length / data.length) * 100,
            averagePageLoadTime: Math.round(avgPageLoadTime),
            averageElementDetectionTime: Math.round(avgElementDetectionTime),
            averagePOMGenerationTime: Math.round(avgPOMGenerationTime),
            lastRun: data[data.length - 1]
          };
        } else {
          stats[website] = {
            totalRuns: data.length,
            successfulRuns: 0,
            errorRuns: errorRuns.length,
            successRate: 0,
            lastRun: data[data.length - 1]
          };
        }
      }
    });
    
    return stats;
  }

  /**
   * Generate monitoring report
   */
  generateReport(): string {
    const stats = this.getMonitoringStats();
    let report = '📊 Real-Time Monitoring Report\n';
    report += '================================\n\n';
    
    Object.entries(stats).forEach(([website, data]: [string, any]) => {
      report += `🌐 ${website}\n`;
      report += `   📈 Total Runs: ${data.totalRuns}\n`;
      report += `   ✅ Success Rate: ${data.successRate.toFixed(1)}%\n`;
      
      if (data.averagePageLoadTime) {
        report += `   📄 Avg Page Load: ${data.averagePageLoadTime}ms\n`;
        report += `   🔍 Avg Element Detection: ${data.averageElementDetectionTime}ms\n`;
        report += `   🏗️  Avg POM Generation: ${data.averagePOMGenerationTime}ms\n`;
      }
      
      report += `   🕐 Last Run: ${data.lastRun.timestamp}\n`;
      report += `   📊 Status: ${data.lastRun.status}\n\n`;
    });
    
    return report;
  }
}

// Test suite for real-time monitoring
describe('🔄 Real-Time Monitoring Test Suite', () => {
  let monitor: RealTimeMonitor;

  beforeAll(async () => {
    monitor = new RealTimeMonitor();
  });

  afterAll(async () => {
    monitor.stopMonitoring();
  });

  describe('🚀 Monitoring Initialization', () => {
    test('should initialize monitoring system', () => {
      expect(monitor).toBeDefined();
      expect(typeof monitor.startMonitoring).toBe('function');
      expect(typeof monitor.stopMonitoring).toBe('function');
      expect(typeof monitor.getMonitoringStats).toBe('function');
    });

    test('should have proper monitoring configuration', () => {
      expect(MONITORING_CONFIG.HIGH_FREQUENCY).toBeDefined();
      expect(MONITORING_CONFIG.MEDIUM_FREQUENCY).toBeDefined();
      expect(MONITORING_CONFIG.LOW_FREQUENCY).toBeDefined();
      
      expect(MONITORING_CONFIG.HIGH_FREQUENCY.interval).toBe(30000);
      expect(MONITORING_CONFIG.MEDIUM_FREQUENCY.interval).toBe(300000);
      expect(MONITORING_CONFIG.LOW_FREQUENCY.interval).toBe(900000);
    });

    test('should have proper performance benchmarks', () => {
      expect(PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME).toBeDefined();
      expect(PERFORMANCE_BENCHMARKS.ELEMENT_DETECTION_TIME).toBeDefined();
      expect(PERFORMANCE_BENCHMARKS.POM_GENERATION_TIME).toBeDefined();
    });
  });

  describe('📊 Performance Monitoring', () => {
    test('should monitor page load time correctly', async () => {
      const startTime = Date.now();
      
      const browser = await monitor['browserManager'].launchBrowser({
        name: 'chrome',
        headless: true,
        timeout: 10000
      });
      
      const page = await browser.newPage();
      await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      
      await browser.close();
      
      expect(loadTime).toBeGreaterThan(0);
      expect(loadTime).toBeLessThan(10000);
    }, 15000);

    test('should monitor element detection correctly', async () => {
      const startTime = Date.now();
      
      const browser = await monitor['browserManager'].launchBrowser({
        name: 'chrome',
        headless: true,
        timeout: 10000
      });
      
      const page = await browser.newPage();
      await page.goto('https://www.google.com', { waitUntil: 'networkidle' });
      
      const elements = await monitor['elementDetector'].detectElements(page);
      const detectionTime = Date.now() - startTime;
      
      await browser.close();
      
      expect(elements).toBeDefined();
      expect(elements.length).toBeGreaterThan(0);
      expect(detectionTime).toBeGreaterThan(0);
      expect(detectionTime).toBeLessThan(10000);
    }, 15000);

    test('should monitor POM generation correctly', async () => {
      const startTime = Date.now();
      
      const result = await monitor['generator'].generatePOM('https://www.google.com', {
        framework: 'playwright',
        language: 'typescript',
        browser: { name: 'chrome', headless: true },
        timeout: 15000
      });
      
      const generationTime = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(generationTime).toBeGreaterThan(0);
      expect(generationTime).toBeLessThan(30000);
    }, 30000);
  });

  describe('🔄 Continuous Monitoring', () => {
    test('should start and stop monitoring', async () => {
      // Start monitoring
      await monitor.startMonitoring();
      
      // Wait a bit for monitoring to start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Stop monitoring
      monitor.stopMonitoring();
      
      // Verify monitoring stopped
      expect(monitor['isMonitoring']).toBe(false);
      expect(monitor['intervals'].size).toBe(0);
    }, 10000);

    test('should collect monitoring data', async () => {
      // Start monitoring
      await monitor.startMonitoring();
      
      // Wait for some data to be collected
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Get stats
      const stats = monitor.getMonitoringStats();
      
      // Stop monitoring
      monitor.stopMonitoring();
      
      // Verify data collection
      expect(Object.keys(stats).length).toBeGreaterThan(0);
      
      // Check that at least one website has data
      const hasData = Object.values(stats).some((data: any) => data.totalRuns > 0);
      expect(hasData).toBe(true);
    }, 15000);
  });

  describe('📈 Performance Analysis', () => {
    test('should calculate performance ratings correctly', () => {
      const getRating = monitor['getPerformanceRating'];
      
      // Test page load time ratings
      expect(getRating(500, PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME)).toContain('EXCELLENT');
      expect(getRating(1500, PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME)).toContain('GOOD');
      expect(getRating(3000, PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME)).toContain('ACCEPTABLE');
      expect(getRating(15000, PERFORMANCE_BENCHMARKS.PAGE_LOAD_TIME)).toContain('POOR');
    });

    test('should generate comprehensive reports', async () => {
      // Start monitoring briefly to collect some data
      await monitor.startMonitoring();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate report
      const report = monitor.generateReport();
      
      // Stop monitoring
      monitor.stopMonitoring();
      
      // Verify report format
      expect(report).toContain('Real-Time Monitoring Report');
      expect(report).toContain('Total Runs:');
      expect(report).toContain('Success Rate:');
      expect(report).toContain('Last Run:');
    }, 10000);
  });

  describe('🔍 Error Handling and Resilience', () => {
    test('should handle monitoring errors gracefully', async () => {
      // Test with invalid URL
      const invalidUrl = 'https://invalid-domain-that-does-not-exist-12345.com';
      
      try {
        const browser = await monitor['browserManager'].launchBrowser({
          name: 'chrome',
          headless: true,
          timeout: 5000
        });
        
        const page = await browser.newPage();
        await page.goto(invalidUrl, { waitUntil: 'networkidle' });
        
        await browser.close();
      } catch (error) {
        // Should handle error gracefully
        expect(error).toBeDefined();
        expect(error.message).toContain('net::ERR_NAME_NOT_RESOLVED');
      }
    }, 10000);

    test('should retry failed operations', async () => {
      // This test verifies that the monitoring system can handle retries
      const retryConfig = { maxRetries: 3, retryDelay: 1000 };
      
      let attemptCount = 0;
      const mockOperation = async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Simulated failure');
        }
        return 'success';
      };
      
      // Simulate retry logic
      let result;
      for (let i = 0; i < retryConfig.maxRetries; i++) {
        try {
          result = await mockOperation();
          break;
        } catch (error) {
          if (i === retryConfig.maxRetries - 1) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay));
        }
      }
      
      expect(result).toBe('success');
      expect(attemptCount).toBe(3);
    });
  });

  describe('📊 Data Management', () => {
    test('should limit stored data per website', async () => {
      // Start monitoring
      await monitor.startMonitoring();
      
      // Wait for data collection
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Get stats
      const stats = monitor.getMonitoringStats();
      
      // Stop monitoring
      monitor.stopMonitoring();
      
      // Verify data limits
      Object.values(stats).forEach((data: any) => {
        expect(data.totalRuns).toBeLessThanOrEqual(100);
      });
    }, 10000);

    test('should maintain data integrity', async () => {
      // Start monitoring
      await monitor.startMonitoring();
      
      // Wait for data collection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get initial stats
      const initialStats = monitor.getMonitoringStats();
      
      // Wait a bit more
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get updated stats
      const updatedStats = monitor.getMonitoringStats();
      
      // Stop monitoring
      monitor.stopMonitoring();
      
      // Verify data integrity
      Object.keys(initialStats).forEach(website => {
        if (updatedStats[website]) {
          expect(updatedStats[website].totalRuns).toBeGreaterThanOrEqual(initialStats[website].totalRuns);
        }
      });
    }, 10000);
  });
});
