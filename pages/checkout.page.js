import { BasePage } from './base.page.js';

export class CheckoutPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    // Checkout may open as a modal/drawer after clicking Checkout in cart
    this.checkoutModal   = '[role="dialog"], [class*="checkout"]';
    this.nameInput       = 'input[name*="name"], input[placeholder*="name"]';
    this.phoneInput      = 'input[type="tel"], input[name*="phone"]';
    this.addressInput    = 'input[name*="address"], input[placeholder*="address"]';
    this.placeOrderBtn   = 'button:has-text("Place Order"), button:has-text("Confirm"), button:has-text("Pay")';
    this.confirmMsg      = 'h2:has-text("Thank"), h1:has-text("Order"), [class*="success"], [class*="confirm"]';
    this.orderSummary    = '[class*="summary"], [class*="order-total"]';
  }

  async isCheckoutVisible() {
    return this.isVisible(this.checkoutModal);
  }

  async isConfirmationVisible() {
    return this.isVisible(this.confirmMsg);
  }
}
