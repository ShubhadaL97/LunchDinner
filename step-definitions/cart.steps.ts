import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I scroll to the cart section', async function (this: CustomWorld): Promise<void> {
  await this.cartPage.scrollToCart();
});

When('I click the Checkout button', async function (this: CustomWorld): Promise<void> {
  await this.cartPage.clickCheckout();
});

Then('the Checkout button should be visible in the cart', async function (this: CustomWorld): Promise<void> {
  expect(await this.cartPage.isCheckoutBtnVisible()).toBeTruthy();
});
