import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Browser, Page } from 'playwright';

import { NavigationPage } from '../pages/navigation.page.js';
import { HomePage } from '../pages/home.page.js';
import { MenuPage } from '../pages/menu.page.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { LoginPage } from '../pages/login.page.js';
import { RegisterPage } from '../pages/register.page.js';
import { AccountPage } from '../pages/account.page.js';
import { ContactPage } from '../pages/contact.page.js';
import { TestData } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testData: TestData = JSON.parse(
  readFileSync(join(__dirname, '../test-data/testData.json'), 'utf-8')
);

export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  testData: TestData;
  baseUrl: string;
  navigationPage!: NavigationPage;
  homePage!: HomePage;
  menuPage!: MenuPage;
  cartPage!: CartPage;
  checkoutPage!: CheckoutPage;
  loginPage!: LoginPage;
  registerPage!: RegisterPage;
  accountPage!: AccountPage;
  contactPage!: ContactPage;
  menuAvailable?: boolean;

  constructor(options: IWorldOptions) {
    super(options);
    this.testData = testData;
    this.baseUrl = testData.baseUrl;
  }

  initPages(): void {
    if (!this.page) {
      throw new Error('Page is not initialized');
    }
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
