import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join } from 'path';

const testData = JSON.parse(readFileSync(join('.', 'test-data/testData.json'), 'utf-8'));

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(testData.baseUrl);
  await page.waitForLoadState('networkidle');

  console.log('\n=== BEFORE LOGIN ===');
  const headerBtnsBeforeLogin = await page.locator('header button').allTextContents();
  console.log('Header buttons (text):', headerBtnsBeforeLogin);

  // Click login and log in
  console.log('\nLogging in with:', testData.users.valid.email);
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(500);

  // Check modal opened
  const modalOpenedCheck = await page.locator('[role="dialog"]').isVisible().catch(() => false);
  console.log('Modal opened:', modalOpenedCheck);

  // Fill in login form
  console.log('Filling email and password...');
  await page.fill('#signin-email', testData.users.valid.email);
  await page.fill('#signin-password', testData.users.valid.password);

  // Get the Sign In button (exclude the tab)
  const signInBtn = page.locator('[role="dialog"] button:has-text("Sign In"):not([role="tab"])');
  console.log('Sign In button visible:', await signInBtn.isVisible());

  await signInBtn.click();
  console.log('Sign In button clicked, waiting 3 seconds...');
  await page.waitForTimeout(3000);

  // Check if modal closed
  const modalClosed = !(await page.locator('[role="dialog"]').isVisible().catch(() => false));
  console.log('Modal closed after login:', modalClosed);

  console.log('\n=== AFTER LOGIN ===');

  // Check if Login button is gone
  const loginStillVisible = await page.locator('button:has-text("Login")').isVisible().catch(() => false);
  console.log('Login button still visible:', loginStillVisible);

  const headerBtnsAfterLogin = await page.locator('header button').allTextContents();
  console.log('Header buttons (text):', headerBtnsAfterLogin);

  const headerBtnCount = await page.locator('header button').count();
  console.log('Header button count:', headerBtnCount);

  // List each button with index and text
  console.log('\nDetailed header buttons:');
  for (let i = 0; i < headerBtnCount; i++) {
    const btn = page.locator('header button').nth(i);
    const text = (await btn.textContent())?.trim();
    const className = await btn.getAttribute('class');
    console.log(`  [${i}] Text: "${text}", Class: ${className}`);
  }

  // Also check nav area
  console.log('\n=== NAV ELEMENT ===');
  const navBtns = await page.locator('nav button').allTextContents();
  console.log('Nav buttons (text):', navBtns);

  // Check all buttons on page
  console.log('\n=== ALL BUTTONS (visible) ===');
  const allBtnCount = await page.locator('button:visible').count();
  console.log('Total visible buttons:', allBtnCount);
  console.log('First 10 buttons:');
  for (let i = 0; i < Math.min(10, allBtnCount); i++) {
    const btn = page.locator('button:visible').nth(i);
    const text = (await btn.textContent())?.trim() || '[empty]';
    console.log(`  [${i}] "${text}"`);
  }

  // Get details of that empty button (the username button)
  console.log('\n=== USERNAME BUTTON DETAILS ===');
  const navBtnsDetail = page.locator('nav button');
  const navBtnCountDetail = await navBtnsDetail.count();
  console.log('Total nav buttons after login:', navBtnCountDetail);

  if (navBtnCountDetail > 0) {
    // Get the last button (which should be the username/user menu button)
    const usernameBtn = navBtnsDetail.nth(navBtnCountDetail - 1);
    const usernameText = await usernameBtn.textContent();
    const usernameHTML = await usernameBtn.innerHTML();
    const usernameClass = await usernameBtn.getAttribute('class');
    const usernameRole = await usernameBtn.getAttribute('role');
    const usernameAriaLabel = await usernameBtn.getAttribute('aria-label');

    console.log('Text content:', `"${usernameText?.trim()}"`);
    console.log('HTML:', usernameHTML.substring(0, 200));
    console.log('Class:', usernameClass);
    console.log('Role:', usernameRole);
    console.log('Aria-label:', usernameAriaLabel);
  }

  // Check if modal is still open
  console.log('\n=== CLICKING USERNAME BUTTON ===');
  const navBtn = page.locator('nav button').nth(5);
  await navBtn.evaluate(el => el.click());
  await page.waitForTimeout(1000);

  // Check what appears after click
  console.log('URL after username button click:', page.url());

  // Look for dropdowns or menus
  const dropdownSelector = '[role="menu"], [role="dialog"], [class*="dropdown"], [class*="popover"]';
  const dropdownCount = await page.locator(dropdownSelector).count();
  console.log('Dropdowns/menus visible:', dropdownCount);

  // Look for logout button
  const logoutBtnSelectors = [
    'button:has-text("Logout")',
    'button:has-text("Log out")',
    'a:has-text("Logout")',
    'a:has-text("Log out")',
    '[class*="logout"]',
    '[data-testid*="logout"]',
    'button:has-text("Sign out")',
    'a:has-text("Sign out")'
  ];

  console.log('\nSearching for logout button with various selectors:');
  for (const selector of logoutBtnSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      const text = await page.locator(selector).first().textContent();
      console.log(`  ✓ "${selector}": found ${count} elements, text: "${text?.trim()}"`);
    }
  }

  // Get all text on page (first 500 chars)
  const pageText = await page.textContent('body');
  const logoutKeywords = pageText?.match(/logout|sign out|log out/gi) || [];
  console.log('\nLogout-related keywords found:', logoutKeywords.length > 0 ? logoutKeywords : 'none');

  // Check all buttons on page
  const allBtns = await page.locator('button').allTextContents();
  console.log('\nAll buttons on page (after username click):');
  allBtns.forEach((txt, i) => {
    if (txt.toLowerCase().includes('logout') || txt.toLowerCase().includes('sblnzau') || i < 20) {
      console.log(`  [${i}] "${txt.trim()}"`);
    }
  });

  // Check if there's a popover or dropdown hidden
  const allElements = await page.locator('[role="menu"], [role="menuitem"], [class*="dropdown"], [class*="popover"], [class*="menu"], [class*="submenu"]').allTextContents();
  if (allElements.length > 0) {
    console.log('\nDropdown/menu elements found:');
    allElements.forEach((txt, i) => console.log(`  [${i}] "${txt.trim()}`));
  } else {
    console.log('\nNo dropdown/menu elements found');
  }

  // Look around the "sblnzau" button
  const sblnzauIndex = allBtns.findIndex(txt => txt.includes('sblnzau'));
  if (sblnzauIndex >= 0) {
    console.log(`\nButtons near "sblnzau" (index ${sblnzauIndex}):`);
    for (let i = Math.max(0, sblnzauIndex - 2); i < Math.min(allBtns.length, sblnzauIndex + 5); i++) {
      console.log(`  [${i}] "${allBtns[i].trim()}"`);
    }

    // Try clicking the sblnzau button to see if it logs out
    console.log('\nClicking "sblnzau" button...');
    const sblnzauBtn = page.locator('button:has-text("sblnzau")');
    await sblnzauBtn.evaluate(el => el.click()).catch(() => {});
    await page.waitForTimeout(1500);

    // Check if user is still logged in (Login button visible)
    const loginVisible = await page.locator('button:has-text("Login")').isVisible().catch(() => false);
    console.log('Login button visible after clicking sblnzau:', loginVisible);

    // Check all buttons again
    const allBtns2 = await page.locator('button').allTextContents();
    const sblnzauIndex2 = allBtns2.findIndex(txt => txt.includes('sblnzau'));
    console.log('\nAll buttons after clicking "sblnzau" (first 20):');
    for (let i = 0; i < Math.min(20, allBtns2.length); i++) {
      const btn = allBtns2[i].trim().substring(0, 80);
      console.log(`  [${i}] "${btn}"`);
    }

    // Also check for any menu items or links in a sidebar/dropdown
    console.log('\nSearching for menu items/links:');
    const menuItems = await page.locator('[role="menu"], [role="menuitem"], ul, li, nav').allTextContents();
    menuItems.slice(0, 10).forEach((txt, i) => {
      const item = txt.trim().substring(0, 100);
      if (item.length > 0) {
        console.log(`  [${i}] "${item}"`);
      }
    });

    // Search for "logout" in ANY element
    console.log('\nSearching for "logout" text in any element:');
    const logoutElements = await page.locator('*:has-text("logout"), *:has-text("log out"), *:has-text("sign out")').allTextContents();
    if (logoutElements.length > 0) {
      console.log('Found logout-related elements:');
      logoutElements.slice(0, 5).forEach((txt, i) => console.log(`  [${i}] "${txt.trim().substring(0, 100)}"`));
    } else {
      console.log('No logout-related elements found');
    }
  } else {
    console.log('No sblnzau button found');
  }

  // Take screenshot
  console.log('\nTaking screenshots...');
  await page.screenshot({ path: 'reports/screenshots/after-username-click.png', fullPage: true }).catch(() => {});
  console.log('Screenshot saved to reports/screenshots/after-username-click.png');

  await browser.close();
})();
