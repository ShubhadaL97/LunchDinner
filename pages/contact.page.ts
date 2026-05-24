import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ContactPage extends BasePage {
  readonly contactSection: string = 'h3:has-text("Contact Info"), [class*="contact"]';
  readonly phoneLink: string = 'a[href^="tel:"]';
  readonly emailLink: string = 'a[href^="mailto:"]';
  readonly privacyPage: string = '/privacy';
  readonly termsPage: string = '/terms';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async goToPrivacyPage(): Promise<void> {
    await this.navigate('/privacy');
  }

  async goToTermsPage(): Promise<void> {
    await this.navigate('/terms');
  }

  async isContactInfoVisible(): Promise<boolean> {
    return this.isVisible(this.contactSection);
  }

  async isPhoneLinkVisible(): Promise<boolean> {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    return (await this.page.locator(this.phoneLink).count()) > 0;
  }

  async isEmailLinkVisible(): Promise<boolean> {
    await this.page.locator('footer').scrollIntoViewIfNeeded();
    return (await this.page.locator(this.emailLink).count()) > 0;
  }
}
