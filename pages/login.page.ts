import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  readonly modal: string = '[role="dialog"]';
  readonly closeModalBtn: string = '[role="dialog"] button[aria-label*="close"], [role="dialog"] button:has-text("×"), [role="dialog"] button:has-text("✕")';
  readonly signInTab: string = '[role="dialog"] button:has-text("Sign In"), [role="dialog"] [role="tab"]:has-text("Sign In")';
  readonly signUpTab: string = '[role="dialog"] button:has-text("Sign Up"), [role="dialog"] [role="tab"]:has-text("Sign Up")';
  readonly emailInput: string = '#signin-email';
  readonly passwordInput: string = '#signin-password';
  readonly signInBtn: string = '[role="dialog"] button:has-text("Sign In"):not([role="tab"])';
  readonly forgotLink: string = '[role="dialog"] button:has-text("Forgot"), [role="dialog"] a:has-text("Forgot")';
  readonly googleBtn: string = '[role="dialog"] button:has-text("Continue with Google")';
  readonly errorMsg: string = '[role="dialog"] [class*="error"], [role="dialog"] [role="alert"], [role="dialog"] p:has-text("error"), [role="dialog"] [class*="message"]';
  readonly signUpEmailInput: string = '#signup-email, [placeholder*="email"]';
  readonly signUpPasswordInput: string = '#signup-password';
  readonly signUpBtn: string = '[role="dialog"] button[type="submit"]:not(:has-text("Sign In"))';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async openLoginModal(): Promise<void> {
    await this.click('button:has-text("Login")');
    await this.page.locator(this.modal).waitFor({ state: 'visible', timeout: 8000 });
  }

  async switchToSignUp(): Promise<void> {
    await this.click(this.signUpTab);
    await this.page.waitForTimeout(300);
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.signInBtn);
    await this.page.waitForTimeout(2000);
  }

  async submitEmptyForm(): Promise<void> {
    await this.click(this.signInBtn);
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotLink);
    await this.page.waitForTimeout(500);
  }

  async isModalVisible(): Promise<boolean> {
    return this.isVisible(this.modal);
  }

  async isSignInTabVisible(): Promise<boolean> {
    return this.isVisible(this.signInTab);
  }

  async isSignUpTabVisible(): Promise<boolean> {
    return this.isVisible(this.signUpTab);
  }

  async isErrorVisible(): Promise<boolean> {
    try {
      const errorVisible = await this.isVisible(this.errorMsg).catch(() => false);
      if (errorVisible) return true;

      const errorText = await this.page.locator('[role="dialog"]').textContent().catch(() => '');
      if (errorText?.toLowerCase().includes('error') || errorText?.toLowerCase().includes('invalid')) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const modalGone = !(await this.page.locator(this.modal).isVisible().catch(() => false));
    const avatarVisible = await this.page.locator('button[aria-label*="account"], button[aria-label*="user"], button[class*="avatar"]').isVisible().catch(() => false);
    const loginBtnGone = !(await this.page.locator('button:has-text("Login")').isVisible().catch(() => true));
    return modalGone && (avatarVisible || loginBtnGone);
  }

  async isForgotVisible(): Promise<boolean> {
    return this.isVisible(this.forgotLink);
  }

  async isGoogleBtnVisible(): Promise<boolean> {
    return this.isVisible(this.googleBtn);
  }
}
