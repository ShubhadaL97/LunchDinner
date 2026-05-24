import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the homepage', async function () {
  await this.homePage.goToHomePage();
});

When('I click the Order Now button', async function () {
  await this.navigationPage.clickOrderNow();
});

When('I click the About button', async function () {
  await this.navigationPage.clickAbout();
});

When('I navigate to the Privacy Policy page', async function () {
  await this.page.goto(`${this.testData.baseUrl}/privacy`);
  await this.homePage.waitForPageLoad();
});

When('I navigate to the Terms of Service page', async function () {
  await this.page.goto(`${this.testData.baseUrl}/terms`);
  await this.homePage.waitForPageLoad();
});

Then('the header logo should be visible', async function () {
  expect(await this.navigationPage.isVisible(this.navigationPage.logo)).toBeTruthy();
});

Then('the nav button {string} should be visible', async function (label) {
  expect(await this.navigationPage.isNavButtonVisible(label)).toBeTruthy();
});

Then('the footer should be visible', async function () {
  expect(await this.navigationPage.isFooterVisible()).toBeTruthy();
});

Then('the footer link {string} should be visible', async function (href) {
  expect(await this.navigationPage.isFooterLinkVisible(href)).toBeTruthy();
});

Then('the page should not be a 404', async function () {
  const content = await this.page.textContent('body');
  expect(content).not.toContain('404');
  expect(content).not.toContain('Page not found');
});

Then('the order section should be visible', async function () {
  expect(await this.homePage.isOrderSectionVisible()).toBeTruthy();
});

Then('the About Our Kitchen section should be visible', async function () {
  expect(await this.homePage.isAboutSectionVisible()).toBeTruthy();
});

// Additional steps for full journey
When('I navigate to the homepage', async function () {
  await this.homePage.goToHomePage();
});

When('I navigate to the menu page', async function () {
  await this.menuPage.navigate('/');
  await this.menuPage.waitForMenu();
});

When('I navigate to cart', async function () {
  await this.cartPage.navigate('/');
});

When('I navigate to account page', async function () {
  await this.accountPage.navigate('/');
});

Then('the page title should contain {string}', async function (text) {
  const title = await this.page.title();
  expect(title.toLowerCase()).toContain(text.toLowerCase());
});

Then('I should see navigation menu items', async function () {
  const navItems = await this.page.locator('nav button, nav a').count();
  expect(navItems).toBeGreaterThan(0);
});

Then('the page should load successfully', async function () {
  await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  const url = this.page.url();
  expect(url).not.toContain('404');
});
