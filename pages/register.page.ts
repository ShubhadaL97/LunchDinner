import { Page } from '@playwright/test';
import { BasePage } from './base.page.js';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegisterPage extends BasePage {
  readonly modal: string = '[role="dialog"]';
  readonly signUpTab: string = '[role="dialog"] button:has-text("Sign Up"), [role="dialog"] [role="tab"]:has-text("Sign Up")';
  readonly nameInput: string = '[role="dialog"] input[placeholder*="name"], [role="dialog"] input[name*="name"]';
  readonly emailInput: string = '[role="dialog"] input[type="email"]';
  readonly passwordInput: string = '[role="dialog"] input[type="password"]:first-of-type';
  readonly confirmPassword: string = '[role="dialog"] input[type="password"]:last-of-type';
  readonly submitBtn: string = '[role="dialog"] button[type="submit"]';
  readonly errorMsg: string = '[role="dialog"] [class*="error"], [role="dialog"] [role="alert"]';
  readonly signInTab: string = '[role="dialog"] button:has-text("Sign In"), [role="dialog"] [role="tab"]:has-text("Sign In")';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async openSignUpModal(): Promise<void> {
    await this.click('button:has-text("Login")');
    await this.page.locator(this.modal).waitFor({ state: 'visible', timeout: 8000 });
    await this.click(this.signUpTab);
    await this.page.waitForTimeout(300);
  }

  async fillSignUpForm(data: SignUpData): Promise<void> {
    if (await this.page.locator(this.nameInput).isVisible()) {
      await this.fill(this.nameInput, `${data.firstName} ${data.lastName}`);
    }
    await this.fill(this.emailInput, data.email);
    await this.fill(this.passwordInput, data.password);
    if (await this.page.locator(this.confirmPassword).isVisible()) {
      await this.fill(this.confirmPassword, data.confirmPassword);
    }
  }

  async submit(): Promise<void> {
    await this.click(this.submitBtn);
    await this.page.waitForTimeout(1500);
  }

  async isSignUpTabVisible(): Promise<boolean> {
    return this.isVisible(this.signUpTab);
  }

  async isSignInTabVisible(): Promise<boolean> {
    return this.isVisible(this.signInTab);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMsg);
  }
}
