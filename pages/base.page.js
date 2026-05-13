import { expect } from '@playwright/test';

export class BasePage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  async navigate(path = '') {
    await this.page.goto(`${this.baseUrl}${path}`);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  async getTitle() {
    return this.page.title();
  }

  async getUrl() {
    return this.page.url();
  }

  async isVisible(selector) {
    return this.page.locator(selector).isVisible();
  }

  async click(selector) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator(selector).click();
  }

  async fill(selector, value) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator(selector).clear();
    await this.page.locator(selector).fill(value);
  }

  async getText(selector) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
    return this.page.locator(selector).textContent();
  }

  async assertVisible(selector, message) {
    await expect(this.page.locator(selector), message).toBeVisible({ timeout: 10000 });
  }

  async assertText(selector, expectedText) {
    await expect(this.page.locator(selector)).toHaveText(expectedText, { timeout: 10000 });
  }

  async assertUrl(expectedPath) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath), { timeout: 10000 });
  }

  async waitForSelector(selector) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
  }

  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name) {
    return this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
