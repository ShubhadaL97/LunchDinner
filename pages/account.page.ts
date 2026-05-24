import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class AccountPage extends BasePage {
  readonly logoutBtn: string = 'button:has-text("Logout"), a:has-text("Logout"), div:has-text("Logout")';
  readonly orderHistory: string = '[class*="order-history"], [class*="orders"], h2:has-text("Order"), h2:has-text("History")';
  readonly profileName: string = '[class*="profile"] [class*="name"], [class*="user"] [class*="name"]';
  readonly usernameButton: string = '[class*="text-neutral-600"][class*="cursor-pointer"]';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async isUsernameVisible(): Promise<boolean> {
    try {
      const bodyText = await this.page.textContent('body');
      return bodyText?.includes('sblnzau') || false;
    } catch {
      return false;
    }
  }

  async clickUsernameButton(): Promise<void> {
    console.log('Clicking username button...');

    try {
      const userButton = this.page.locator('[class*="text-neutral-600"][class*="cursor-pointer"]').first();
      await userButton.click();
      console.log('Clicked username using class selector');
      await this.page.waitForTimeout(800);
      return;
    } catch (e) {
      console.log('Method 1 failed, trying Method 2');
    }

    const found = await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));

      const userElement = elements.find(el => {
        const text = el.textContent?.trim();
        const className = el.className.toString();
        const isExactUsername = text === 'sblnzau' || (text?.includes('sblnzau') && (text?.length || 0) < 100);
        const hasClickableClass = className.includes('cursor-pointer');

        return isExactUsername && hasClickableClass;
      });

      if (userElement) {
        console.log('Found username button');
        (userElement as HTMLElement).click();
        return true;
      }

      return false;
    });

    if (!found) {
      throw new Error('Could not find or click username button (sblnzau)');
    }

    await this.page.waitForTimeout(800);
  }

  async clickLogout(): Promise<void> {
    console.log('🔐 Starting logout flow...');

    console.log('Step 1️⃣: Clicking username button');
    await this.clickUsernameButton();

    console.log('Step 2️⃣: Waiting for account menu (2 seconds)');
    await this.page.waitForTimeout(2000);

    console.log('Step 3️⃣: Finding and clicking Logout button');

    const logoutClicked = await this.page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));

      const logoutElement = allElements.find(el => {
        const text = el.textContent?.toLowerCase().trim();
        const isLogout = (text === 'logout' || text === 'log out' || text === 'sign out');
        const className = (el.className && typeof el.className === 'string') ? el.className : '';

        const isClickableType = (
          (el as HTMLElement).tagName === 'BUTTON' ||
          (el as HTMLElement).tagName === 'A' ||
          className.includes('cursor-pointer') ||
          className.includes('btn') ||
          (el as HTMLElement).getAttribute('role') === 'button'
        );

        return isLogout && isClickableType;
      });

      if (logoutElement) {
        console.log(`Found logout: <${(logoutElement as HTMLElement).tagName}> "${logoutElement.textContent}"`);
        try {
          (logoutElement as HTMLElement).click();
          console.log('✅ Clicked logout button');
          return true;
        } catch (e) {
          console.log('Direct click failed, trying parent click');
          if ((logoutElement as HTMLElement).parentElement) {
            ((logoutElement as HTMLElement).parentElement as HTMLElement).click();
            return true;
          }
        }
      }

      console.log('❌ Logout button not found');
      return false;
    });

    if (!logoutClicked) {
      throw new Error('Could not find or click Logout button. Check if account menu opened properly.');
    }

    console.log('Step 4️⃣: Waiting for logout to process (2 seconds)');
    await this.page.waitForTimeout(2000);

    console.log('Step 5️⃣: Reloading page');
    await this.navigate('/');
    await this.page.waitForTimeout(1000);

    console.log('Step 6️⃣: Verifying logout success');
    try {
      await this.page.locator('button:has-text("Login")').waitFor({
        state: 'visible',
        timeout: 10000
      });
      console.log('✅ LOGOUT SUCCESSFUL - Login button is visible again');
    } catch (e) {
      throw new Error('Logout verification failed - Login button not visible');
    }
  }

  async isLogoutVisible(): Promise<boolean> {
    return this.isVisible(this.logoutBtn);
  }
}
