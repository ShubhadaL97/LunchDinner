import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class NavigationPage extends BasePage {
  readonly logo: string = 'button:has-text("Lunch Dinner")';
  readonly aboutBtn: string = 'header button:has-text("About"), nav button:has-text("About")';
  readonly workWithUs: string = 'button:has-text("Work With Us")';
  readonly galleryBtn: string = 'button:has-text("Gallery")';
  readonly orderNowBtn: string = 'button:has-text("Order Now")';
  readonly loginBtn: string = 'button:has-text("Login")';
  readonly footer: string = 'footer';
  readonly privacyLink: string = 'a[href="/privacy"]';
  readonly termsLink: string = 'a[href="/terms"]';
  readonly guideLink: string = 'a[href="/onboarding-guide"]';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async clickLogo(): Promise<void> {
    await this.click(this.logo);
    await this.waitForPageLoad();
  }

  async clickAbout(): Promise<void> {
    await this.click(this.aboutBtn);
  }

  async clickOrderNow(): Promise<void> {
    await this.click(this.orderNowBtn);
    await this.page.waitForTimeout(500);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginBtn);
    await this.page.waitForTimeout(500);
  }

  async isNavButtonVisible(label: string): Promise<boolean> {
    return this.page.locator(`button:has-text("${label}")`).first().isVisible();
  }

  async isFooterVisible(): Promise<boolean> {
    return this.isVisible(this.footer);
  }

  async isFooterLinkVisible(href: string): Promise<boolean> {
    const count = await this.page.locator(`a[href="${href}"]`).count();
    if (count > 0) {
      await this.page.locator('footer').scrollIntoViewIfNeeded().catch(() => {});
      return true;
    }
    return false;
  }

  async clickFooterLink(href: string): Promise<void> {
    await this.page.locator(`a[href="${href}"]`).first().click();
    await this.waitForPageLoad();
  }
}
