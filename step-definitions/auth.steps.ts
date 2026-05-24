import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import EncryptionService from '../utils/encryption';
import { CustomWorld } from '../support/world';

const encryptionService = new EncryptionService();

Given('I am logged in as a valid user', async function (this: CustomWorld): Promise<void> {
  await this.loginPage.openLoginModal();
  const plainPassword = encryptionService.getPlainPassword(this.testData.users.valid.password);
  await this.loginPage.signIn(
    this.testData.users.valid.email,
    plainPassword
  );
  await this.page.waitForTimeout(1500);
});

When('I click the Login button', async function (this: CustomWorld): Promise<void> {
  await this.loginPage.openLoginModal();
});

When('I sign in with valid credentials', async function (this: CustomWorld): Promise<void> {
  const plainPassword = encryptionService.getPlainPassword(this.testData.users.valid.password);
  await this.loginPage.signIn(
    this.testData.users.valid.email,
    plainPassword
  );
});

When('I sign in with email {string} and password {string}', async function (this: CustomWorld, email: string, password: string): Promise<void> {
  await this.loginPage.signIn(email, password);
});

When('I switch to the Sign Up tab', async function (this: CustomWorld): Promise<void> {
  await this.loginPage.switchToSignUp();
});

Then('the login modal should be visible', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isModalVisible()).toBeTruthy();
});

Then('the {string} tab should be visible in the modal', async function (this: CustomWorld, tab: string): Promise<void> {
  const selector = `[role="dialog"] [role="tab"]:has-text("${tab}")`;
  expect(await this.page.locator(selector).first().isVisible()).toBeTruthy();
});

Then('the email input should be visible in the modal', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isVisible(this.loginPage.emailInput)).toBeTruthy();
});

Then('the password input should be visible in the modal', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isVisible(this.loginPage.passwordInput)).toBeTruthy();
});

Then('the Sign In button should be visible in the modal', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isVisible(this.loginPage.signInBtn)).toBeTruthy();
});

Then('the Forgot password link should be visible in the modal', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isForgotVisible()).toBeTruthy();
});

Then('the Continue with Google button should be visible in the modal', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isGoogleBtnVisible()).toBeTruthy();
});

Then('I should be logged in successfully', async function (this: CustomWorld): Promise<void> {
  // Modal should close after successful login
  await this.page.waitForTimeout(1000);
  const modalGone = !(await this.page.locator('[role="dialog"]').isVisible().catch(() => false));
  expect(modalGone).toBeTruthy();
});

Then('a sign in error should be visible', async function (this: CustomWorld): Promise<void> {
  expect(await this.loginPage.isErrorVisible()).toBeTruthy();
});

Then('the Sign Up form should be visible', async function (this: CustomWorld): Promise<void> {
  const formVisible = await this.page.locator('[role="dialog"] input[type="email"]').isVisible();
  expect(formVisible).toBeTruthy();
});

Then('the Login button should not be visible', async function (this: CustomWorld): Promise<void> {
  const visible = await this.page.locator('button:has-text("Login")').isVisible();
  expect(visible).toBeFalsy();
});

Then('the Login button should be visible again', async function (this: CustomWorld): Promise<void> {
  expect(await this.page.locator('button:has-text("Login")').isVisible()).toBeTruthy();
});
