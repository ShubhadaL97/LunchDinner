import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('the phone link should be visible in the footer', async function () {
  expect(await this.contactPage.isPhoneLinkVisible()).toBeTruthy();
});

Then('the email link should be visible in the footer', async function () {
  expect(await this.contactPage.isEmailLinkVisible()).toBeTruthy();
});
