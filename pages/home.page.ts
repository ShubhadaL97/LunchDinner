import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  readonly heroHeading: string = 'h1';
  readonly viewWeeklyMenuBtn: string = 'button:has-text("View Weekly Menu")';
  readonly orderNowBtn: string = 'button:has-text("Order Now")';
  readonly orderSectionTitle: string = 'h1:has-text("Order"), h1:has-text("Plan")';
  readonly aboutSection: string = 'h2:has-text("About Our Kitchen")';
  readonly freeYourselfBanner: string = 'text=Free yourself from cooking';
  readonly pickupLocation: string = 'button:has-text("Main Location")';
  readonly cartSection: string = 'h2:has-text("Cart")';
  readonly emptyCartMsg: string = 'text=Your cart is empty';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async goToHomePage(): Promise<void> {
    await this.navigate('/');
  }

  async clickViewWeeklyMenu(): Promise<void> {
    await this.click(this.viewWeeklyMenuBtn);
    await this.page.waitForTimeout(800);
  }

  async clickOrderNow(): Promise<void> {
    await this.click(this.orderNowBtn);
    await this.page.waitForTimeout(800);
  }

  async isHeroVisible(): Promise<boolean> {
    return this.page.locator(this.heroHeading).first().isVisible();
  }

  async isOrderSectionVisible(): Promise<boolean> {
    return this.isVisible(this.freeYourselfBanner);
  }

  async isAboutSectionVisible(): Promise<boolean> {
    return this.isVisible(this.aboutSection);
  }

  async isCartSectionVisible(): Promise<boolean> {
    return this.isVisible(this.cartSection);
  }

  async isEmptyCartVisible(): Promise<boolean> {
    return this.isVisible(this.emptyCartMsg);
  }
}
