import { BasePage } from './base.page.js';

export class ContactPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    // Contact info is in footer, not a separate page
    this.contactSection  = 'h3:has-text("Contact Info"), [class*="contact"]';
    this.phoneLink       = 'a[href^="tel:"]';
    this.emailLink       = 'a[href^="mailto:"]';
    this.privacyPage     = '/privacy';
    this.termsPage       = '/terms';
  }

  async goToPrivacyPage() {
    await this.navigate('/privacy');
  }

  async goToTermsPage() {
    await this.navigate('/terms');
  }

  async isContactInfoVisible() {
    return this.isVisible(this.contactSection);
  }

  async isPhoneLinkVisible() {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    return (await this.page.locator(this.phoneLink).count()) > 0;
  }

  async isEmailLinkVisible() {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    return (await this.page.locator(this.emailLink).count()) > 0;
  }
}
