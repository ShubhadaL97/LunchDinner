import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('the hero heading should be visible', async function (this: CustomWorld): Promise<void> {
  expect(await this.homePage.isHeroVisible()).toBeTruthy();
});

Then('the {string} button should be visible', async function (this: CustomWorld, label: string): Promise<void> {
  expect(await this.navigationPage.isNavButtonVisible(label)).toBeTruthy();
});

Then('the Cart section should be visible on the homepage', async function (this: CustomWorld): Promise<void> {
  expect(await this.homePage.isCartSectionVisible()).toBeTruthy();
});

Then('the cart should show empty message', async function (this: CustomWorld): Promise<void> {
  expect(await this.homePage.isEmptyCartVisible()).toBeTruthy();
});

Then('the date selector buttons should be visible', async function (this: CustomWorld): Promise<void> {
  expect(await this.menuPage.areDateButtonsVisible()).toBeTruthy();
});
