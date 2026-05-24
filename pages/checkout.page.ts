import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

interface OrderDetails {
  itemCount: number;
  totalPrice: number;
  items: string[];
  address: string;
  phone: string;
}

export class CheckoutPage extends BasePage {
  readonly checkoutModal: string = '[role="dialog"], [class*="checkout"]';
  readonly nameInput: string = 'input[name*="name"], input[placeholder*="name"]';
  readonly phoneInput: string = 'input[type="tel"], input[name*="phone"]';
  readonly addressInput: string = 'input[name*="address"], input[placeholder*="address"]';
  readonly placeOrderBtn: string = 'button:has-text("Place Order"), button:has-text("Confirm"), button:has-text("Pay")';
  readonly confirmMsg: string = 'h2:has-text("Thank"), h1:has-text("Order"), [class*="success"], [class*="confirm"]';
  readonly orderSummary: string = '[class*="summary"], [class*="order-total"]';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async isCheckoutVisible(): Promise<boolean> {
    return this.isVisible(this.checkoutModal);
  }

  async isConfirmationVisible(): Promise<boolean> {
    return this.isVisible(this.confirmMsg);
  }

  async getOrderDetails(): Promise<string> {
    try {
      const modal = await this.page.locator(this.checkoutModal).first();
      return (await modal.textContent()) || '';
    } catch (e) {
      return '';
    }
  }

  async getOrderItemCount(): Promise<number> {
    try {
      const details = await this.getOrderDetails();
      const match = details.match(/(\d+)\s*item/i);
      return match ? parseInt(match[1]) : 0;
    } catch (e) {
      return 0;
    }
  }

  async getOrderTotalPrice(): Promise<number> {
    try {
      const details = await this.getOrderDetails();
      const match = details.match(/total[^\d]*\$?([\d.]+)/i);
      return match ? parseFloat(match[1]) : 0;
    } catch (e) {
      return 0;
    }
  }

  async verifyOrderSummaryVisible(): Promise<boolean> {
    const summaryElements = await this.page.locator(this.orderSummary).count();
    return summaryElements > 0;
  }

  async getVisibleOrderDetails(): Promise<OrderDetails> {
    const details: OrderDetails = {
      itemCount: 0,
      totalPrice: 0,
      items: [],
      address: '',
      phone: ''
    };

    try {
      const itemElements = await this.page.locator('[class*="summary"] li, [class*="order"] li').allTextContents();
      details.items = itemElements;

      const priceElements = await this.page.locator('[class*="summary"] span:has-text("$"), [class*="order"] span:has-text("$")').allTextContents();
      if (priceElements.length > 0) {
        const lastPrice = priceElements[priceElements.length - 1];
        const match = lastPrice.match(/\$?([\d.]+)/);
        details.totalPrice = match ? parseFloat(match[1]) : 0;
      }

      details.itemCount = itemElements.length;
    } catch (e) {
      console.log('Error getting order details:', e instanceof Error ? e.message : String(e));
    }

    return details;
  }
}
