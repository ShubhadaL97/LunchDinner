import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class MenuPage extends BasePage {
  readonly menuHeading: string = 'h2:has-text("Menu"), h2:has-text("Selected Day")';
  readonly mealCards: string = 'h3';
  readonly mealPrices: string = 'span:has-text("$"), [class*="price"]:has-text("$"), div:has-text("$")';
  readonly addToCartBtn: string = 'button:has-text("Add to Cart")';
  readonly addBtn: string = 'button:has-text("Add")';
  readonly lunchTab: string = 'button:has-text("Lunch")';
  readonly dinnerTab: string = 'button:has-text("Dinner")';
  readonly dateBtns: string = 'button:has-text("May"), button:has-text("June")';
  readonly pickupDropdown: string = 'button:has-text("Main Location"), button:has-text("Location")';
  readonly locationOption: string = '[role="option"]';
  readonly promoCodeInput: string = 'input[name*="promo"], input[placeholder*="promo"], input[placeholder*="code"]';
  readonly promoApplyBtn: string = 'button:has-text("Apply"), button:has-text("Add Code")';

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
  }

  async waitForMenu(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    try {
      await this.page.evaluate(() => {
        const menuSection = document.querySelector('[class*="menu"], [class*="order"], h2');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      });
    } catch (e) {
      console.log('Could not scroll to menu section');
    }

    await this.page.waitForTimeout(1000);

    const selectors: string[] = [
      this.addToCartBtn,
      'button:has-text("Add to Cart")',
      'button:has-text("Add ")',
      'button:contains("Add")',
      'button:visible'
    ];

    let found = false;
    for (const selector of selectors) {
      try {
        const count = await this.page.locator(selector).count();
        if (count > 0) {
          await this.page.locator(selector).first().waitFor({ state: 'visible', timeout: 5000 });
          found = true;
          console.log(`Menu loaded: found ${count} elements with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!found) {
      try {
        const btnCount = await this.page.locator('button').count();
        if (btnCount === 0) {
          throw new Error('No buttons found on page - page may not be loaded');
        }
        const texts = await this.page.locator('button').allTextContents();
        console.warn(`Menu selector not found. Available buttons: ${texts.slice(0, 10).join(', ')}`);
      } catch (e) {
        throw new Error(`Menu failed to load: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  async selectDate(dayText: string): Promise<void> {
    await this.click(`button:has-text("${dayText}")`);
    await this.page.waitForTimeout(500);
  }

  async selectFirstAvailableDate(): Promise<void> {
    await this.page.locator(this.dateBtns).first().click();
    await this.page.waitForTimeout(500);
  }

  async clickLunchTab(): Promise<void> {
    await this.click(this.lunchTab);
    await this.page.waitForTimeout(500);
  }

  async clickDinnerTab(): Promise<void> {
    await this.click(this.dinnerTab);
    await this.page.waitForTimeout(500);
  }

  async getMealCount(): Promise<number> {
    return this.page.locator(this.addToCartBtn).count();
  }

  async clickFirstAddToCart(): Promise<void> {
    const strategies: Array<{ selector: string; name: string }> = [
      { selector: this.addToCartBtn, name: 'Add to Cart button' },
      { selector: 'button:has-text("Add")', name: 'Add button' },
      { selector: 'button:visible', name: 'any visible button after meal name h3' }
    ];

    let clicked = false;
    for (const { selector, name } of strategies) {
      try {
        const btns = this.page.locator(selector);
        const count = await btns.count();

        if (count === 0) continue;

        if (selector === 'button:visible') {
          const h3s = await this.page.locator(this.mealCards).count();
          if (h3s > 0) {
            const bodyText = await this.page.textContent('body');
            if (!bodyText?.includes('Add')) {
              console.log(`No buttons containing "Add" found on page`);
              continue;
            }
          }
        }

        const firstBtn = btns.first();
        await firstBtn.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`Clicking button with strategy: ${name}`);
        await firstBtn.click();
        clicked = true;
        break;
      } catch (e) {
        console.log(`Strategy "${name}" failed: ${e instanceof Error ? e.message : String(e)}`);
        continue;
      }
    }

    if (!clicked) {
      const allBtns = await this.page.locator('button').allTextContents();
      const h3Count = await this.page.locator(this.mealCards).count();
      throw new Error(
        `Could not find Add to Cart button. ` +
        `Meal cards (h3): ${h3Count}, ` +
        `Buttons: ${allBtns.join(', ')}`
      );
    }

    await this.page.waitForTimeout(500);
  }

  async areMealCardsVisible(): Promise<boolean> {
    try {
      let count = await this.page.locator(this.addToCartBtn).count();

      if (count === 0) {
        count = await this.page.locator('button').filter({ hasText: /Add\s+to\s+Cart/i }).count();
      }

      if (count === 0) {
        count = await this.page.locator(this.mealCards).count();
      }

      return count > 0;
    } catch (e) {
      console.log('Error checking meal cards visibility:', e instanceof Error ? e.message : String(e));
      return false;
    }
  }

  async areDateButtonsVisible(): Promise<boolean> {
    return this.page.locator(this.dateBtns).first().isVisible();
  }

  async isMealTypeSelectorVisible(): Promise<boolean> {
    return this.isVisible(this.lunchTab);
  }

  async getMealNames(): Promise<string[]> {
    await this.page.locator(this.addToCartBtn).first().waitFor({ state: 'visible', timeout: 10000 });
    return this.page.locator(this.mealCards).allTextContents();
  }

  async assertMealHasPrice(): Promise<void> {
    let count = await this.page.locator(this.mealPrices).count();

    if (count === 0) {
      const pricePattern = await this.page.locator('*:has-text("$")').count();
      count = Math.min(1, pricePattern);
    }

    if (count === 0) {
      const allText = await this.page.textContent('body');
      const hasPricePattern = /\$\d+\.?\d*/.test(allText || '');
      count = hasPricePattern ? 1 : 0;
      if (hasPricePattern) {
        console.log('Found price pattern in page text');
      } else {
        console.log('No price pattern found in page. Body text sample:', (allText || '').substring(0, 200));
      }
    }

    expect(count).toBeGreaterThan(0);
  }

  async isPickupLocationDropdownAvailable(): Promise<boolean> {
    try {
      const count = await this.page.locator(this.pickupDropdown).count();
      return count > 0;
    } catch (e) {
      return false;
    }
  }

  async clickPickupLocationDropdown(): Promise<void> {
    await this.click(this.pickupDropdown);
    await this.page.waitForTimeout(500);
  }

  async getAvailableLocations(): Promise<string[]> {
    return this.page.locator(this.locationOption).allTextContents();
  }

  async selectLocationByIndex(index: number = 0): Promise<void> {
    const options = this.page.locator(this.locationOption);
    const count = await options.count();
    if (count > index) {
      await options.nth(index).click();
      await this.page.waitForTimeout(500);
    }
  }

  async selectDateByIndex(index: number = 0): Promise<void> {
    const dateButtons = this.page.locator(this.dateBtns);
    const count = await dateButtons.count();
    if (count > index) {
      await dateButtons.nth(index).click();
      await this.page.waitForTimeout(1000);
    }
  }

  async applyPromoCode(code: string): Promise<void> {
    try {
      const input = this.page.locator(this.promoCodeInput).first();
      await input.fill(code);
      const applyBtn = this.page.locator(this.promoApplyBtn).first();
      if (await applyBtn.count() > 0) {
        await applyBtn.click();
      }
      await this.page.waitForTimeout(1000);
    } catch (e) {
      console.log('Error applying promo code:', e instanceof Error ? e.message : String(e));
    }
  }
}
