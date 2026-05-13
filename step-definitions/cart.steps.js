import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('I scroll to the cart section', async function () {
  await this.cartPage.scrollToCart();
});

When('I click the Checkout button', async function () {
  await this.cartPage.clickCheckout();
});

Then('the Checkout button should be visible in the cart', async function () {
  expect(await this.cartPage.isCheckoutBtnVisible()).toBeTruthy();
});
