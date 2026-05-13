import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    this.heroHeading       = 'h1';
    this.viewWeeklyMenuBtn = 'button:has-text("View Weekly Menu")';
    this.orderNowBtn       = 'button:has-text("Order Now")';
    this.orderSectionTitle = 'h1:has-text("Order"), h1:has-text("Plan")';
    this.aboutSection      = 'h2:has-text("About Our Kitchen")';
    this.freeYourselfBanner= 'text=Free yourself from cooking';
    this.pickupLocation    = 'button:has-text("Main Location")';
    this.cartSection       = 'h2:has-text("Cart")';
    this.emptyCartMsg      = 'text=Your cart is empty';
  }

  async goToHomePage() {
    await this.navigate('/');
  }

  async clickViewWeeklyMenu() {
    await this.click(this.viewWeeklyMenuBtn);
    await this.page.waitForTimeout(800);
  }

  async clickOrderNow() {
    await this.click(this.orderNowBtn);
    await this.page.waitForTimeout(800);
  }

  async isHeroVisible() {
    return this.page.locator(this.heroHeading).first().isVisible();
  }

  async isOrderSectionVisible() {
    return this.isVisible(this.freeYourselfBanner);
  }

  async isAboutSectionVisible() {
    return this.isVisible(this.aboutSection);
  }

  async isCartSectionVisible() {
    return this.isVisible(this.cartSection);
  }

  async isEmptyCartVisible() {
    return this.isVisible(this.emptyCartMsg);
  }
}
