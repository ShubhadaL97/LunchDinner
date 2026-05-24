import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I log out', async function (this: CustomWorld): Promise<void> {
  await this.accountPage.clickLogout();
});

Then('I should see the username displayed in the navigation', async function (this: CustomWorld): Promise<void> {
  const usernameVisible = await this.accountPage.isUsernameVisible();
  expect(usernameVisible).toBeTruthy();
});

When('I click on {string} link', async function (this: CustomWorld, linkName: string): Promise<void> {
  await this.page.locator(`button:has-text("${linkName}"), a:has-text("${linkName}")`).first().click();
  await this.page.waitForTimeout(500);
});

Then('I should be on the {string} page', async function (this: CustomWorld, pageName: string): Promise<void> {
  // Check URL contains the page name or other indicators
  const url = this.page.url();
  expect(url).toContain(pageName.toLowerCase().replace(/\s+/g, ''));
});
