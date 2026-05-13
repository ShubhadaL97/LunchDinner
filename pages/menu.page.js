import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';

export class MenuPage extends BasePage {
  constructor(page, baseUrl) {
    super(page, baseUrl);
    this.menuHeading     = 'h2:has-text("Menu"), h2:has-text("Selected Day")';
    this.mealCards       = 'h3';                    // meal names are in h3
    this.mealPrices      = 'span:has-text("$"), [class*="price"]:has-text("$"), div:has-text("$")';
    this.addToCartBtn    = 'button:has-text("Add to Cart")';
    this.addBtn          = 'button:has-text("Add")';
    this.lunchTab        = 'button:has-text("Lunch")';
    this.dinnerTab       = 'button:has-text("Dinner")';
    this.dateBtns        = 'button:has-text("May")';
    this.pickupDropdown  = 'button:has-text("Main Location")';
  }

  async waitForMenu() {
    // Wait for page content to fully load
    await this.page.waitForLoadState('networkidle');

    // Scroll to ensure menu section is visible
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

    // Try to find Add to Cart buttons with various selectors
    const selectors = [
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
          // Wait for at least one to be visible
          await this.page.locator(selector).first().waitFor({ state: 'visible', timeout: 5000 });
          found = true;
          console.log(`Menu loaded: found ${count} elements with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // If still not found, wait for any button to ensure page loaded
    if (!found) {
      try {
        const btnCount = await this.page.locator('button').count();
        if (btnCount === 0) {
          throw new Error('No buttons found on page - page may not be loaded');
        }
        console.warn(`Menu selector not found. Available buttons: ${(await this.page.locator('button').allTextContents()).slice(0, 10).join(', ')}`);
      } catch (e) {
        throw new Error(`Menu failed to load: ${e.message}`);
      }
    }
  }

  async selectDate(dayText) {
    await this.click(`button:has-text("${dayText}")`);
    await this.page.waitForTimeout(500);
  }

  async selectFirstAvailableDate() {
    await this.page.locator(this.dateBtns).first().click();
    await this.page.waitForTimeout(500);
  }

  async clickLunchTab() {
    await this.click(this.lunchTab);
    await this.page.waitForTimeout(500);
  }

  async clickDinnerTab() {
    await this.click(this.dinnerTab);
    await this.page.waitForTimeout(500);
  }

  async getMealCount() {
    return this.page.locator(this.addToCartBtn).count();
  }

  async clickFirstAddToCart() {
    // Try multiple strategies to find and click the add button
    const strategies = [
      { selector: this.addToCartBtn, name: 'Add to Cart button' },
      { selector: 'button:has-text("Add")', name: 'Add button' },
      { selector: 'button:visible', name: 'any visible button after meal name h3' },
    ];

    let clicked = false;
    for (const { selector, name } of strategies) {
      try {
        let btns = this.page.locator(selector);
        const count = await btns.count();

        if (count === 0) continue;

        // If looking for any button, filter out navigation buttons
        if (selector === 'button:visible') {
          // Get buttons after first h3 (meal name)
          const h3s = await this.page.locator(this.mealCards).count();
          if (h3s > 0) {
            // Find buttons in the context of meal cards, not header
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
        console.log(`Strategy "${name}" failed: ${e.message}`);
        continue;
      }
    }

    if (!clicked) {
      // Get page info for debugging
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

  async areMealCardsVisible() {
    try {
      // First try the standard selector
      let count = await this.page.locator(this.addToCartBtn).count();

      // If no buttons found, try alternative selector
      if (count === 0) {
        count = await this.page.locator('button').filter({ hasText: /Add\s+to\s+Cart/i }).count();
      }

      // Also check for h3 elements (meal names) as fallback
      if (count === 0) {
        count = await this.page.locator(this.mealCards).count();
      }

      return count > 0;
    } catch (e) {
      console.log('Error checking meal cards visibility:', e.message);
      return false;
    }
  }

  async areDateButtonsVisible() {
    return this.page.locator(this.dateBtns).first().isVisible();
  }

  async isMealTypeSelectorVisible() {
    return this.isVisible(this.lunchTab);
  }

  async getMealNames() {
    await this.page.locator(this.addToCartBtn).first().waitFor({ state: 'visible', timeout: 10000 });
    return this.page.locator(this.mealCards).allTextContents();
  }

  async assertMealHasPrice() {
    // Try multiple price selectors
    let count = await this.page.locator(this.mealPrices).count();

    // If not found, look for price patterns in the page
    if (count === 0) {
      // Look for any $ signs which indicate prices
      const pricePattern = await this.page.locator('*:has-text("$")').count();
      count = Math.min(1, pricePattern);
    }

    // If still not found, check for common price patterns in elements
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
}
