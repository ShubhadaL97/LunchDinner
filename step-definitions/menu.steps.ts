import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('the meal menu is loaded', async function (this: CustomWorld): Promise<void> {
  await this.menuPage.waitForMenu();
});

When('I click the {string} meal tab', async function (this: CustomWorld, tab: string): Promise<void> {
  await this.page.locator(`button:has-text("${tab}")`).first().click();
  await this.page.waitForTimeout(500);
});

When('I click the first available date', async function (this: CustomWorld): Promise<void> {
  await this.menuPage.selectFirstAvailableDate();
});

When('I add the first meal to cart', async function (this: CustomWorld): Promise<void> {
  await this.menuPage.clickFirstAddToCart();
});

Then('meal cards should be visible on the homepage', async function (this: CustomWorld): Promise<void> {
  expect(await this.menuPage.areMealCardsVisible()).toBeTruthy();
});

Then('meal prices should be displayed', async function (this: CustomWorld): Promise<void> {
  await this.menuPage.assertMealHasPrice();
});

Then('the {string} meal tab should be visible', async function (this: CustomWorld, tab: string): Promise<void> {
  expect(await this.page.locator(`button:has-text("${tab}")`).first().isVisible()).toBeTruthy();
});

Then('the Add to Cart button should be visible', async function (this: CustomWorld): Promise<void> {
  expect(await this.menuPage.areMealCardsVisible()).toBeTruthy();
});

Then('the cart should not be empty', async function (this: CustomWorld): Promise<void> {
  const isEmpty = await this.homePage.isEmptyCartVisible();
  expect(isEmpty).toBeFalsy();
});
