import { BasePage } from './base.page.js';

export class AccountPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    this.logoutBtn    = 'button:has-text("Logout"), button:has-text("Log out"), a:has-text("Logout"), a:has-text("Log out")';
    this.orderHistory = '[class*="order-history"], [class*="orders"], h2:has-text("Order"), h2:has-text("History")';
    this.profileName  = '[class*="profile"] [class*="name"], [class*="user"] [class*="name"]';
  }

  async clickUsernameButton() {
    // The username button is the last button in the nav (replaces Login after login)
    // After login, there are 6 nav buttons: Lunch Dinner, About, Work With Us, Gallery, Order Now, and username (icon)

    // Check if Login button is gone (indicating logged in state)
    const loginGone = !(await this.page.locator('button:has-text("Login")').isVisible().catch(() => false));
    if (!loginGone) {
      throw new Error('Not logged in — Login button still visible');
    }

    // The username button might be hidden due to responsive design or off-screen
    // Use JavaScript to dispatch a click event directly to the element
    const navBtn = this.page.locator('nav button').nth(5);
    await navBtn.evaluate(el => {
      el.click();
    });

    await this.page.waitForTimeout(500);
    // Don't call waitForPageLoad() - the button opens a menu, not a new page
  }

  async clickLogout() {
    // Step 1: Click the icon button to make username appear
    await this.clickUsernameButton();

    // Step 2: Click the username button to open the account menu
    await this.page.waitForTimeout(500);
    const usernameBtn = this.page.locator('button:has-text("sblnzau")');

    // Wait for username button to appear (with timeout)
    try {
      await usernameBtn.first().evaluate(el => {
        el.click();
      });
    } catch {
      throw new Error('Username button not found or not clickable');
    }

    await this.page.waitForTimeout(1000);

    // Step 3: Find and click the Logout button (appears in the menu after clicking username)
    // Get all buttons and find one with "logout" in the text (case-insensitive)
    const allButtons = this.page.locator('button, a');
    const count = await allButtons.count();

    let logoutClicked = false;
    for (let i = 0; i < count; i++) {
      const btn = allButtons.nth(i);
      const text = (await btn.textContent()).toLowerCase();
      if (text.includes('logout') || text.includes('log out')) {
        await btn.evaluate(el => {
          el.click();
        }).catch(() => {});
        logoutClicked = true;
        break;
      }
    }

    if (!logoutClicked) {
      throw new Error('No logout button found in any button/link on page');
    }

    await this.page.waitForTimeout(2000);

    // After logout, reload the page to ensure UI reflects logged-out state
    await this.navigate('/');
    await this.page.waitForTimeout(1000);

    // Now the Login button should be visible
    await this.page.locator('button:has-text("Login")').waitFor({ state: 'visible', timeout: 10000 });
  }

  async isLogoutVisible() {
    return this.isVisible(this.logoutBtn);
  }
}
