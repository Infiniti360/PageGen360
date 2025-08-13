export class PlaywrightPage {
  constructor(private page: Page) {}

  getExampledomain(): WebElement {
    return page.locator("#exampledomain");
  }

  waitExampledomain(timeout: number = 5000): void {
    page.locator("#exampledomain").waitFor({ timeout: timeout });
  }

  getMoreinformation(): WebElement {
    return page.locator("#moreinformation");
  }

  waitMoreinformation(timeout: number = 5000): void {
    page.locator("#moreinformation").waitFor({ timeout: timeout });
  }

  getMoreinformation(): WebElement {
    return page.locator("#moreinformation");
  }

  clickMoreinformation(): void {
    page.locator("#moreinformation").click();
  }

  waitMoreinformation(timeout: number = 5000): void {
    page.locator("#moreinformation").waitFor({ timeout: timeout });
  }

  waitForPageLoad(): void {
    page.waitForLoadState('networkidle');
  }

  getPageTitle(): string {
    return page.title();
  }

  takeScreenshot(filename: string): string {
    const screenshotPath = filename || 'screenshot.png';
        await page.screenshot({ path: screenshotPath });
        return screenshotPath;
  }

}
