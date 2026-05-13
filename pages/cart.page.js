import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    this.cartSection     = 'h2:has-text("Cart")';
    this.emptyCartMsg    = 'text=Your cart is empty';
    this.cartItems       = '[class*="cart"] h3, [class*="cart"] [class*="item"]';
    this.removeBtn       = 'button[aria-label*="remove"], button:has-text("Remove"), button[class*="remove"]';
    this.checkoutBtn     = 'button:has-text("Checkout"), button:has-text("Proceed"), [role="button"]:has-text("Checkout")';
    this.cartTotal       = '[class*="cart"] [class*="total"], [class*="cart"] span:has-text("$")';
    this.cartItemCount   = '[class*="cart"] [class*="count"], [class*="badge"]';
  }

  async scrollToCart() {
    await this.page.locator(this.cartSection).scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async isCartSectionVisible() {
    return this.isVisible(this.cartSection);
  }

  async isEmptyCartVisible() {
    try {
      // Wait a bit for cart to potentially update
      await this.page.waitForTimeout(500);

      // Check if empty message is still visible
      const emptyMsgVisible = await this.isVisible(this.emptyCartMsg).catch(() => false);

      // Also check for cart items as an alternate indicator
      if (!emptyMsgVisible) {
        const itemCount = await this.getCartItemCount();
        return itemCount === 0;
      }

      return emptyMsgVisible;
    } catch (e) {
      console.log('Error checking cart empty status:', e.message);
      return false;
    }
  }

  async isCheckoutBtnVisible() {
    try {
      // Try multiple selectors for checkout button
      const selectors = [
        'button:has-text("Checkout")',
        'button:has-text("Proceed")',
        'button:visible:has-text("Check")',
        '[role="button"]:has-text("Checkout")'
      ];

      for (const selector of selectors) {
        try {
          const visible = await this.isVisible(selector).catch(() => false);
          if (visible) return true;
        } catch (e) {
          // Continue to next selector
        }
      }

      return false;
    } catch (e) {
      console.log('Error checking checkout button visibility:', e.message);
      return false;
    }
  }

  async clickCheckout() {
    // Try multiple selectors for checkout button
    const selectors = [
      'button:has-text("Checkout")',
      'button:has-text("Proceed")',
      'button:visible:has-text("Check")',
      '[role="button"]:has-text("Checkout")'
    ];

    let clicked = false;
    for (const selector of selectors) {
      try {
        const btn = this.page.locator(selector);
        const count = await btn.count();
        if (count > 0) {
          await btn.first().waitFor({ state: 'visible', timeout: 5000 });
          await btn.first().click();
          clicked = true;
          console.log(`Checkout button clicked with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!clicked) {
      throw new Error('Could not find or click Checkout button');
    }

    await this.waitForPageLoad();
  }

  async getCartItemCount() {
    const count = await this.page.locator(this.cartItems).count();
    return count;
  }

  async removeFirstItem() {
    await this.page.locator(this.removeBtn).first().click();
    await this.page.waitForTimeout(500);
  }
}
