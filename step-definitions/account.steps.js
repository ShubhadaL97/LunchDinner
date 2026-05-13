import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('I log out', async function () {
  await this.accountPage.clickLogout();
});
