import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    // Modal
    this.modal          = '[role="dialog"]';
    this.closeModalBtn  = '[role="dialog"] button[aria-label*="close"], [role="dialog"] button:has-text("×"), [role="dialog"] button:has-text("✕")';
    // Tabs inside modal
    this.signInTab      = '[role="dialog"] button:has-text("Sign In"), [role="dialog"] [role="tab"]:has-text("Sign In")';
    this.signUpTab      = '[role="dialog"] button:has-text("Sign Up"), [role="dialog"] [role="tab"]:has-text("Sign Up")';
    // Sign In fields
    this.emailInput     = '#signin-email';
    this.passwordInput  = '#signin-password';
    this.signInBtn      = '[role="dialog"] button:has-text("Sign In"):not([role="tab"])';
    this.forgotLink     = '[role="dialog"] button:has-text("Forgot"), [role="dialog"] a:has-text("Forgot")';
    this.googleBtn      = '[role="dialog"] button:has-text("Continue with Google")';
    this.errorMsg       = '[role="dialog"] [class*="error"], [role="dialog"] [role="alert"], [role="dialog"] p:has-text("error"), [role="dialog"] [class*="message"]';
    // Sign Up fields (same modal, different tab)
    this.signUpEmailInput    = '#signup-email, [placeholder*="email"]';
    this.signUpPasswordInput = '#signup-password';
    this.signUpBtn           = '[role="dialog"] button[type="submit"]:not(:has-text("Sign In"))';
  }

  async openLoginModal() {
    await this.click('button:has-text("Login")');
    await this.page.locator(this.modal).waitFor({ state: 'visible', timeout: 8000 });
  }

  async switchToSignUp() {
    await this.click(this.signUpTab);
    await this.page.waitForTimeout(300);
  }

  async signIn(email, password) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.signInBtn);
    await this.page.waitForTimeout(2000);
  }

  async submitEmptyForm() {
    await this.click(this.signInBtn);
  }

  async clickForgotPassword() {
    await this.click(this.forgotLink);
    await this.page.waitForTimeout(500);
  }

  async isModalVisible() {
    return this.isVisible(this.modal);
  }

  async isSignInTabVisible() {
    return this.isVisible(this.signInTab);
  }

  async isSignUpTabVisible() {
    return this.isVisible(this.signUpTab);
  }

  async isErrorVisible() {
    try {
      // Check for various error indicators
      const errorVisible = await this.isVisible(this.errorMsg).catch(() => false);
      if (errorVisible) return true;

      // Also check for text-based error messages
      const errorText = await this.page.locator('[role="dialog"]').textContent().catch(() => '');
      if (errorText?.toLowerCase().includes('error') || errorText?.toLowerCase().includes('invalid')) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  async isLoggedIn() {
    // After login modal closes and Login button changes to account/avatar
    const modalGone = !(await this.page.locator(this.modal).isVisible().catch(() => false));
    const avatarVisible = await this.page.locator('button[aria-label*="account"], button[aria-label*="user"], button[class*="avatar"]').isVisible().catch(() => false);
    const loginBtnGone = !(await this.page.locator('button:has-text("Login")').isVisible().catch(() => true));
    return modalGone && (avatarVisible || loginBtnGone);
  }

  async isForgotVisible() {
    return this.isVisible(this.forgotLink);
  }

  async isGoogleBtnVisible() {
    return this.isVisible(this.googleBtn);
  }
}
