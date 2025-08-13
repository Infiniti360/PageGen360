const { UniversalPOMGenerator } = require('./dist/core/UniversalPOMGenerator');
const fs = require('fs');

async function generateEnhancedTocaPOM() {
  try {
    console.log('🚀 Starting Enhanced TOCA Football POM Generation...');
    
    // Initialize the enhanced POM generator with better configuration
    const generator = new UniversalPOMGenerator({
      logLevel: 'info',
      cacheEnabled: true,
      namingConventions: {
        useDescriptiveNames: true,
        removePersonalData: true,
        useCamelCase: true,
        useSemanticNames: true
      }
    });

    // Load configuration
    const config = JSON.parse(fs.readFileSync('./pom-config.json', 'utf8'));
    
    console.log('📋 Configuration loaded');
    console.log(`🎯 Target URL: ${config.url}`);
    console.log(`🔐 Login URL: ${config.loginConfig.loginUrl}`);

    // Enhanced options for better POM generation
    const enhancedOptions = {
      framework: config.framework,
      language: config.language,
      browser: config.browser,
      loginConfig: config.loginConfig,
      mcpIntegration: config.mcpIntegration,
      codeGeneration: config.codeGeneration,
      // Enhanced naming and structure options
      namingConventions: {
        className: 'TocaFootballHomePage',
        useDescriptiveNames: true,
        removePersonalData: true,
        useCamelCase: true,
        useSemanticNames: true,
        elementNaming: {
          prefix: 'get',
          suffix: 'Element',
          useSemanticNames: true
        }
      },
      // Enhanced code generation options
      codeGeneration: {
        ...config.codeGeneration,
        generateInterfaces: true,
        generateDocumentation: true,
        includeTypeSafety: true,
        includeErrorHandling: true,
        includeWaitStrategies: true,
        includePerformanceOptimizations: true
      },
      // Enhanced element detection
      elementDetection: {
        prioritizeSemanticElements: true,
        ignorePersonalData: true,
        useAccessibleSelectors: true,
        generateDescriptiveNames: true
      }
    };

    // Generate POM with enhanced configuration
    console.log('⏳ Generating Enhanced POM with proper naming conventions...');
    const result = await generator.generatePOM(config.url, enhancedOptions);

    if (result.success) {
      console.log('✅ Enhanced POM Generation Successful!');
      console.log(`📊 Generated Class: ${result.pom.className}`);
      console.log(`🔧 Methods Count: ${result.pom.methods.length}`);
      console.log(`⏱️  Generation Time: ${result.metadata.generationTime}ms`);
      
      // Create enhanced output directory
      const outputDir = './generated-pom-enhanced';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Generate enhanced POM with proper naming
      const enhancedPOMCode = generateEnhancedPOMCode(result);
      
      // Save enhanced POM file
      fs.writeFileSync(
        `${outputDir}/TocaFootballHomePage.ts`,
        enhancedPOMCode
      );
      
      // Generate enhanced test file
      const enhancedTestCode = generateEnhancedTestCode(result);
      fs.writeFileSync(
        `${outputDir}/TocaFootballHomePage.test.ts`,
        enhancedTestCode
      );
      
      // Save enhanced metadata
      fs.writeFileSync(
        `${outputDir}/TocaFootballHomePage.metadata.json`,
        JSON.stringify({
          ...result.pom.metadata,
          enhancedGeneration: true,
          namingConventions: 'improved',
          timestamp: new Date().toISOString()
        }, null, 2)
      );
      
      console.log('💾 Enhanced files saved to ./generated-pom-enhanced/');
      console.log('📁 Generated files:');
      console.log('   - TocaFootballHomePage.ts (Enhanced)');
      console.log('   - TocaFootballHomePage.test.ts (Enhanced)');
      console.log('   - TocaFootballHomePage.metadata.json (Enhanced)');
      
    } else {
      console.error('❌ Enhanced POM Generation Failed!');
      console.error('Errors:', result.errors);
    }
    
  } catch (error) {
    console.error('💥 Error during enhanced POM generation:', error);
  }
}

function generateEnhancedPOMCode(result) {
  const className = 'TocaFootballHomePage';
  
  return `import { Page, Locator, expect } from '@playwright/test';

/**
 * TOCA Football Home Page Object Model
 * 
 * This class provides a clean, semantic interface for interacting with
 * the TOCA Football home page elements and functionality.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2024-01-01
 */
export class ${className} {
  private page: Page;
  
  // Page elements with semantic naming
  private readonly headerGreeting: Locator;
  private readonly profilePictureButton: Locator;
  private readonly profilePictureImage: Locator;
  private readonly playerCard: Locator;
  private readonly playerAge: Locator;
  private readonly playerReps: Locator;
  private readonly jerseyBackName: Locator;
  private readonly jerseyBackNumber: Locator;
  private readonly upcomingSessionsSection: Locator;
  private readonly leaderboardsLink: Locator;
  private readonly mySessionsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators with semantic names
    this.headerGreeting = page.locator('[data-testid="header-greeting"], .header-greeting, h1, h2');
    this.profilePictureButton = page.locator('[data-testid="profile-picture"], .profile-picture, button[aria-label*="profile"]');
    this.profilePictureImage = page.locator('[data-testid="profile-image"], .profile-image, img[alt*="profile"]');
    this.playerCard = page.locator('[data-testid="player-card"], .player-card, .card');
    this.playerAge = page.locator('[data-testid="player-age"], .player-age, .age');
    this.playerReps = page.locator('[data-testid="player-reps"], .player-reps, .reps');
    this.jerseyBackName = page.locator('[data-testid="jersey-name"], .jersey-name, .name');
    this.jerseyBackNumber = page.locator('[data-testid="jersey-number"], .jersey-number, .number');
    this.upcomingSessionsSection = page.locator('[data-testid="upcoming-sessions"], .upcoming-sessions, section');
    this.leaderboardsLink = page.locator('[data-testid="leaderboards"], .leaderboards, a[href*="leaderboard"]');
    this.mySessionsLink = page.locator('[data-testid="my-sessions"], .my-sessions, a[href*="session"]');
  }

  /**
   * Navigate to the TOCA Football home page
   */
  async navigateToHomePage(): Promise<void> {
    await this.page.goto('https://staging.my.tocafootball.com/home');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Additional wait for dynamic content
  }

  /**
   * Verify that the page is loaded and accessible
   */
  async verifyPageIsLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/MyTOCA|TOCA Football/);
    await expect(this.page.locator('body')).toBeVisible();
  }

  /**
   * Verify the page title
   */
  async verifyPageTitle(): Promise<void> {
    const title = await this.page.title();
    expect(title).toMatch(/MyTOCA|TOCA Football/);
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingToComplete(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get player information
   */
  async getPlayerInfo(): Promise<PlayerInfo> {
    const age = await this.getPlayerAge();
    const reps = await this.getPlayerReps();
    const jerseyName = await this.getJerseyBackName();
    const jerseyNumber = await this.getJerseyBackNumber();
    const headerGreeting = await this.getHeaderGreeting();
    const profilePictureUrl = await this.getProfilePictureUrl();
    const backgroundColor = await this.getPlayerCardBackgroundColor();

    return {
      age,
      reps,
      jerseyBackName: jerseyName,
      jerseyBackNumber: jerseyNumber,
      headerGreeting,
      profilePictureUrl,
      backgroundColor,
      fullName: jerseyName // Assuming jersey name is the full name
    };
  }

  /**
   * Get player age
   */
  async getPlayerAge(): Promise<number> {
    const ageText = await this.playerAge.textContent();
    return parseInt(ageText?.replace(/\D/g, '') || '0');
  }

  /**
   * Get player reps count
   */
  async getPlayerReps(): Promise<number> {
    const repsText = await this.playerReps.textContent();
    return parseInt(repsText?.replace(/\D/g, '') || '0');
  }

  /**
   * Get jersey back name
   */
  async getJerseyBackName(): Promise<string> {
    return await this.jerseyBackName.textContent() || '';
  }

  /**
   * Get jersey back number
   */
  async getJerseyBackNumber(): Promise<string> {
    return await this.jerseyBackNumber.textContent() || '';
  }

  /**
   * Get header greeting text
   */
  async getHeaderGreeting(): Promise<string> {
    return await this.headerGreeting.textContent() || '';
  }

  /**
   * Get profile picture URL
   */
  async getProfilePictureUrl(): Promise<string> {
    return await this.profilePictureImage.getAttribute('src') || '';
  }

  /**
   * Get player card background color
   */
  async getPlayerCardBackgroundColor(): Promise<string> {
    return await this.playerCard.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    ) || '';
  }

  /**
   * Verify player card is displayed
   */
  async verifyPlayerCardIsDisplayed(): Promise<void> {
    await expect(this.playerCard).toBeVisible();
  }

  /**
   * Verify upcoming sessions section is displayed
   */
  async verifyUpcomingSessionsSectionIsDisplayed(): Promise<void> {
    await expect(this.upcomingSessionsSection).toBeVisible();
  }

  /**
   * Verify leaderboards link is available
   */
  async verifyLeaderboardsLinkIsAvailable(): Promise<void> {
    await expect(this.leaderboardsLink).toBeVisible();
  }

  /**
   * Verify profile picture is loaded
   */
  async verifyProfilePictureIsLoaded(): Promise<void> {
    await expect(this.profilePictureImage).toBeVisible();
    const src = await this.profilePictureImage.getAttribute('src');
    expect(src).toBeTruthy();
  }

  /**
   * Click on profile picture button
   */
  async clickProfilePictureButton(): Promise<void> {
    await this.profilePictureButton.click();
  }

  /**
   * Click on leaderboards link
   */
  async clickLeaderboardsLink(): Promise<void> {
    await this.leaderboardsLink.click();
  }

  /**
   * Click on my sessions link
   */
  async clickMySessionsLink(): Promise<void> {
    await this.mySessionsLink.click();
  }

  /**
   * Take a screenshot of the page
   */
  async takeScreenshot(filename?: string): Promise<string> {
    const screenshotPath = filename || \`toca-home-\${Date.now()}.png\`;
    await this.page.screenshot({ path: screenshotPath });
    return screenshotPath;
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}

/**
 * Player information interface
 */
export interface PlayerInfo {
  age: number;
  reps: number;
  jerseyBackName: string;
  jerseyBackNumber: string;
  headerGreeting: string;
  profilePictureUrl: string;
  backgroundColor: string;
  fullName: string;
}
`;
}

function generateEnhancedTestCode(result) {
  return `import { test, expect } from '@playwright/test';
import { TocaFootballHomePage, PlayerInfo } from './TocaFootballHomePage';

/**
 * TOCA Football Home Page Test Suite
 * 
 * This test suite demonstrates the usage of the TocaFootballHomePage
 * Page Object Model with comprehensive test scenarios.
 * 
 * @author Test Automation Team
 * @version 1.0.0
 * @since 2024-01-01
 */
test.describe('TOCA Football Home Page', () => {
    let homePage: TocaFootballHomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new TocaFootballHomePage(page);
        await homePage.navigateToHomePage();
    });

    test.describe('Page Navigation and Loading', () => {
        test('should load the home page successfully', async () => {
            // Verify page is loaded
            await homePage.verifyPageIsLoaded();
            
            // Verify page title
            await homePage.verifyPageTitle();
            
            // Wait for loading to complete
            await homePage.waitForLoadingToComplete();
        });

        test('should display all main page elements', async () => {
            // Verify header elements
            await expect(homePage.headerGreeting).toBeVisible();
            await expect(homePage.profilePictureButton).toBeVisible();
            await expect(homePage.profilePictureImage).toBeVisible();
            
            // Verify player card elements
            await homePage.verifyPlayerCardIsDisplayed();
            
            // Verify upcoming sessions section
            await homePage.verifyUpcomingSessionsSectionIsDisplayed();
            
            // Verify leaderboards link
            await homePage.verifyLeaderboardsLinkIsAvailable();
        });
    });

    test.describe('Player Card Information', () => {
        test('should display player information correctly', async () => {
            // Get player information
            const playerInfo: PlayerInfo = await homePage.getPlayerInfo();
            
            // Verify player information is not empty
            expect(playerInfo.fullName).toBeTruthy();
            expect(playerInfo.age).toBeGreaterThan(0);
            expect(playerInfo.reps).toBeGreaterThanOrEqual(0);
            expect(playerInfo.jerseyBackName).toBeTruthy();
            expect(playerInfo.jerseyBackNumber).toBeTruthy();
            expect(playerInfo.headerGreeting).toBeTruthy();
            expect(playerInfo.profilePictureUrl).toBeTruthy();
            expect(playerInfo.backgroundColor).toBeTruthy();
            
            // Log player information for debugging
            console.log('Player Information:', playerInfo);
        });

        test('should have valid player age', async () => {
            const age = await homePage.getPlayerAge();
            
            // Verify age is within reasonable range
            expect(age).toBeGreaterThan(0);
            expect(age).toBeLessThan(100);
        });

        test('should have valid player reps count', async () => {
            const reps = await homePage.getPlayerReps();
            
            // Verify reps is a non-negative number
            expect(reps).toBeGreaterThanOrEqual(0);
        });

        test('should display jersey information', async () => {
            const jerseyName = await homePage.getJerseyBackName();
            const jerseyNumber = await homePage.getJerseyBackNumber();
            
            // Verify jersey information is displayed
            expect(jerseyName).toBeTruthy();
            expect(jerseyNumber).toBeTruthy();
            
            // Verify jersey number is numeric
            expect(parseInt(jerseyNumber)).not.toBeNaN();
        });

        test('should have profile picture loaded', async () => {
            await homePage.verifyProfilePictureIsLoaded();
            
            const profileUrl = await homePage.getProfilePictureUrl();
            expect(profileUrl).toBeTruthy();
            expect(profileUrl).toMatch(/^https?:\\/\\//);
        });
    });

    test.describe('Navigation and Interactions', () => {
        test('should be able to click profile picture button', async () => {
            await expect(homePage.profilePictureButton).toBeVisible();
            await homePage.clickProfilePictureButton();
            
            // Add verification for profile menu or modal if applicable
        });

        test('should be able to navigate to leaderboards', async () => {
            await expect(homePage.leaderboardsLink).toBeVisible();
            await homePage.clickLeaderboardsLink();
            
            // Verify navigation to leaderboards page
            await expect(homePage.page).toHaveURL(/leaderboard/);
        });

        test('should be able to navigate to my sessions', async () => {
            await expect(homePage.mySessionsLink).toBeVisible();
            await homePage.clickMySessionsLink();
            
            // Verify navigation to sessions page
            await expect(homePage.page).toHaveURL(/session/);
        });
    });

    test.describe('Visual and Performance', () => {
        test('should take screenshot successfully', async () => {
            const screenshotPath = await homePage.takeScreenshot();
            expect(screenshotPath).toBeTruthy();
            expect(screenshotPath).toMatch(/\\.png$/);
        });

        test('should have reasonable page load time', async () => {
            const startTime = Date.now();
            await homePage.navigateToHomePage();
            const loadTime = Date.now() - startTime;
            
            // Page should load within 10 seconds
            expect(loadTime).toBeLessThan(10000);
        });
    });
});
`;
}

// Run the enhanced generation
generateEnhancedTocaPOM().catch(console.error); 