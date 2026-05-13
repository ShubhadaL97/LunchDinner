import { BasePage } from './base.page.js';

export class RegisterPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    // Sign Up is a tab inside the login modal
    this.modal             = '[role="dialog"]';
    this.signUpTab         = '[role="dialog"] button:has-text("Sign Up"), [role="dialog"] [role="tab"]:has-text("Sign Up")';
    this.nameInput         = '[role="dialog"] input[placeholder*="name"], [role="dialog"] input[name*="name"]';
    this.emailInput        = '[role="dialog"] input[type="email"]';
    this.passwordInput     = '[role="dialog"] input[type="password"]:first-of-type';
    this.confirmPassword   = '[role="dialog"] input[type="password"]:last-of-type';
    this.submitBtn         = '[role="dialog"] button[type="submit"]';
    this.errorMsg          = '[role="dialog"] [class*="error"], [role="dialog"] [role="alert"]';
    this.signInTab         = '[role="dialog"] button:has-text("Sign In"), [role="dialog"] [role="tab"]:has-text("Sign In")';
  }

  async openSignUpModal() {
    // Open login modal first, then switch to Sign Up tab
    await this.click('button:has-text("Login")');
    await this.page.locator(this.modal).waitFor({ state: 'visible', timeout: 8000 });
    await this.click(this.signUpTab);
    await this.page.waitForTimeout(300);
  }

  async fillSignUpForm(data) {
    if (await this.page.locator(this.nameInput).isVisible()) {
      await this.fill(this.nameInput, `${data.firstName} ${data.lastName}`);
    }
    await this.fill(this.emailInput, data.email);
    await this.fill(this.passwordInput, data.password);
    if (await this.page.locator(this.confirmPassword).isVisible()) {
      await this.fill(this.confirmPassword, data.confirmPassword);
    }
  }

  async submit() {
    await this.click(this.submitBtn);
    await this.page.waitForTimeout(1500);
  }

  async isSignUpTabVisible() {
    return this.isVisible(this.signUpTab);
  }

  async isSignInTabVisible() {
    return this.isVisible(this.signInTab);
  }

  async isErrorVisible() {
    return this.isVisible(this.errorMsg);
  }
}
