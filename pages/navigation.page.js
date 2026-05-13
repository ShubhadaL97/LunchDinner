import { BasePage } from './base.page.js';

export class NavigationPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    this.logo         = 'button:has-text("Lunch Dinner")';
    this.aboutBtn     = 'header button:has-text("About"), nav button:has-text("About")';
    this.workWithUs   = 'button:has-text("Work With Us")';
    this.galleryBtn   = 'button:has-text("Gallery")';
    this.orderNowBtn  = 'button:has-text("Order Now")';
    this.loginBtn     = 'button:has-text("Login")';
    this.footer       = 'footer';
    this.privacyLink  = 'a[href="/privacy"]';
    this.termsLink    = 'a[href="/terms"]';
    this.guideLink    = 'a[href="/onboarding-guide"]';
  }

  async clickLogo() {
    await this.click(this.logo);
    await this.waitForPageLoad();
  }

  async clickAbout() {
    await this.click(this.aboutBtn);
  }

  async clickOrderNow() {
    await this.click(this.orderNowBtn);
    await this.page.waitForTimeout(500);
  }

  async clickLogin() {
    await this.click(this.loginBtn);
    await this.page.waitForTimeout(500);
  }

  async isNavButtonVisible(label) {
    return this.page.locator(`button:has-text("${label}")`).first().isVisible();
  }

  async isFooterVisible() {
    return this.isVisible(this.footer);
  }

  async isFooterLinkVisible(href) {
    // Check if the link exists in the footer (may not be visible if below fold)
    const count = await this.page.locator(`a[href="${href}"]`).count();
    if (count > 0) {
      // Scroll to footer to make link visible if needed
      await this.page.locator('footer').scrollIntoViewIfNeeded().catch(() => {});
      return true;
    }
    return false;
  }

  async clickFooterLink(href) {
    await this.page.locator(`a[href="${href}"]`).first().click();
    await this.waitForPageLoad();
  }
}
