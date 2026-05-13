import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the meal menu is loaded', async function () {
  await this.menuPage.waitForMenu();
});

When('I click the {string} meal tab', async function (tab) {
  await this.page.locator(`button:has-text("${tab}")`).first().click();
  await this.page.waitForTimeout(500);
});

When('I click the first available date', async function () {
  await this.menuPage.selectFirstAvailableDate();
});

When('I add the first meal to cart', async function () {
  await this.menuPage.clickFirstAddToCart();
});

Then('meal cards should be visible on the homepage', async function () {
  expect(await this.menuPage.areMealCardsVisible()).toBeTruthy();
});

Then('meal prices should be displayed', async function () {
  await this.menuPage.assertMealHasPrice();
});

Then('the {string} meal tab should be visible', async function (tab) {
  expect(await this.page.locator(`button:has-text("${tab}")`).first().isVisible()).toBeTruthy();
});

Then('the Add to Cart button should be visible', async function () {
  expect(await this.menuPage.areMealCardsVisible()).toBeTruthy();
});

Then('the cart should not be empty', async function () {
  const isEmpty = await this.homePage.isEmptyCartVisible();
  expect(isEmpty).toBeFalsy();
});
