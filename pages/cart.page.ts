import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  readonly cartSection: string = 'h2:has-text("Cart")';
  readonly emptyCartMsg: string = 'text=Your cart is empty';
  readonly cartItems: string = '[class*="cart"] h3, [class*="cart"] [class*="item"]';
  readonly removeBtn: string = 'button[aria-label*="remove"], button:has-text("Remove"), button[class*="remove"]';
  readonly checkoutBtn: string = 'button:has-text("Checkout"), button:has-text("Proceed"), [role="button"]:has-text("Checkout")';
  readonly cartTotal: string = '[class*="cart"] [class*="total"], [class*="cart"] span:has-text("$")';
  readonly cartItemCount: string = '[class*="cart"] [class*="count"], [class*="badge"]';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async scrollToCart(): Promise<void> {
    await this.page.locator(this.cartSection).scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async isCartSectionVisible(): Promise<boolean> {
    return this.isVisible(this.cartSection);
  }

  async isEmptyCartVisible(): Promise<boolean> {
    try {
      await this.page.waitForTimeout(500);

      const emptyMsgVisible = await this.isVisible(this.emptyCartMsg).catch(() => false);

      if (!emptyMsgVisible) {
        const itemCount = await this.getCartItemCount();
        return itemCount === 0;
      }

      return emptyMsgVisible;
    } catch (e) {
      console.log('Error checking cart empty status:', e instanceof Error ? e.message : String(e));
      return false;
    }
  }

  async isCheckoutBtnVisible(): Promise<boolean> {
    try {
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
      console.log('Error checking checkout button visibility:', e instanceof Error ? e.message : String(e));
      return false;
    }
  }

  async clickCheckout(): Promise<void> {
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

  async getCartItemCount(): Promise<number> {
    try {
      const count = await this.page.locator(this.removeBtn).count();
      if (count > 0) {
        console.log(`Found ${count} cart items by counting remove buttons`);
        return count;
      }
    } catch (e) {
      console.log('Error counting remove buttons:', e instanceof Error ? e.message : String(e));
    }

    try {
      const items = await this.page.locator('[class*="cart"] li, [class*="cart"] [class*="item"]').all();
      if (items.length > 0) {
        console.log(`Found ${items.length} cart items`);
        return items.length;
      }
    } catch (e) {
      console.log('Error counting items:', e instanceof Error ? e.message : String(e));
    }

    return 0;
  }

  async removeFirstItem(): Promise<void> {
    await this.page.locator(this.removeBtn).first().click();
    await this.page.waitForTimeout(500);
  }

  async getCartItemPrices(): Promise<number[]> {
    const items = await this.page.locator('[class*="cart"] [class*="item"], [class*="cart"] li').all();
    const prices: number[] = [];

    for (const item of items) {
      const priceText = await item.locator('text=/\\$\\d+\\.?\\d*/').textContent();
      if (priceText) {
        const match = priceText.match(/\$?([\d.]+)/);
        if (match) {
          prices.push(parseFloat(match[1]));
        }
      }
    }

    return prices;
  }

  async calculateCartTotal(): Promise<number> {
    const prices = await this.getCartItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  async getDisplayedTotal(): Promise<number> {
    try {
      const totalText = await this.page.locator(this.cartTotal).first().textContent();
      const match = totalText?.match(/\$?([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    } catch (e) {
      return 0;
    }
  }

  async removeItemByIndex(index: number = 0): Promise<void> {
    const removeButtons = this.page.locator(this.removeBtn);
    const count = await removeButtons.count();
    if (count > index) {
      await removeButtons.nth(index).click();
      await this.page.waitForTimeout(500);
    }
  }
}
