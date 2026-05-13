import { setWorldConstructor, World } from '@cucumber/cucumber';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { NavigationPage } from '../pages/navigation.page.js';
import { HomePage } from '../pages/home.page.js';
import { MenuPage } from '../pages/menu.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { LoginPage } from '../pages/login.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { AccountPage } from '../pages/account.page.js';
import { ContactPage } from '../pages/contact.page.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testData = JSON.parse(
  readFileSync(join(__dirname, '../test-data/testData.json'), 'utf-8')
);

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.testData = testData;
    this.baseUrl = testData.baseUrl;

    // browser and page are set in hooks.js Before hook
    this.browser = null;
    this.page = null;

    // page objects are initialised in hooks.js once page is ready
    this.navigationPage = null;
    this.homePage = null;
    this.menuPage = null;
    this.cartPage = null;
    this.checkoutPage = null;
    this.loginPage = null;
    this.registerPage = null;
    this.accountPage = null;
    this.contactPage = null;
  }

  initPages() {
    this.navigationPage = new NavigationPage(this.page, this.baseUrl);
    this.homePage = new HomePage(this.page, this.baseUrl);
    this.menuPage = new MenuPage(this.page, this.baseUrl);
    this.cartPage = new CartPage(this.page, this.baseUrl);
    this.checkoutPage = new CheckoutPage(this.page, this.baseUrl);
    this.loginPage = new LoginPage(this.page, this.baseUrl);
    this.registerPage = new RegisterPage(this.page, this.baseUrl);
    this.accountPage = new AccountPage(this.page, this.baseUrl);
    this.contactPage = new ContactPage(this.page, this.baseUrl);
  }
}

setWorldConstructor(CustomWorld);
