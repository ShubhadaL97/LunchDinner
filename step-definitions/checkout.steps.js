import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('the checkout flow should be visible', async function () {
  const visible = await this.checkoutPage.isCheckoutVisible();
  expect(visible).toBeTruthy();
});
