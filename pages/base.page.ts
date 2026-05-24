import { expect, Page } from '@playwright/test';

export class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).first().isVisible().catch(() => false);
  }

  async click(selector: string): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    await locator.first().click();
  }

  async fill(selector: string, value: string): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    await locator.first().clear();
    await locator.first().fill(value);
  }

  async getText(selector: string): Promise<string | null> {
    const locator = this.page.locator(selector);
    await locator.first().waitFor({ state: 'visible', timeout: 10000 });
    return locator.first().textContent();
  }

  async assertVisible(selector: string, message?: string): Promise<void> {
    await expect(this.page.locator(selector), message).toBeVisible({ timeout: 10000 });
  }

  async assertText(selector: string, expectedText: string | RegExp): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout: 10000 });
  }

  async assertUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath), { timeout: 10000 });
  }

  async waitForSelector(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
  }

  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name: string): Promise<Buffer | void> {
    return this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
