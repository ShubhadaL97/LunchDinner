import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('the phone link should be visible in the footer', async function (this: CustomWorld): Promise<void> {
  expect(await this.contactPage.isPhoneLinkVisible()).toBeTruthy();
});

Then('the email link should be visible in the footer', async function (this: CustomWorld): Promise<void> {
  expect(await this.contactPage.isEmailLinkVisible()).toBeTruthy();
});
