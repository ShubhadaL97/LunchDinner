import { chromium } from 'playwright';

const BASE_URL = 'https://www.lunchdinner.co.nz';

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  async function wait() {
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }

  // --- Homepage deep inspect ---
  await page.goto(BASE_URL);
  await wait();

  console.log('\n=== HOMEPAGE FULL BUTTONS ===');
  const allBtns = await page.$$eval('button, a', els =>
    els.map(e => ({ tag: e.tagName, text: e.textContent?.trim().substring(0,40), href: e.getAttribute('href'), class: e.className?.substring(0,50) }))
       .filter(e => e.text && e.text.length > 1 && e.text.length < 50)
  );
  console.log(JSON.stringify(allBtns, null, 2));

  // --- Click Login and capture result ---
  console.log('\n=== CLICKING LOGIN ===');
  await page.click('button:has-text("Login"), a:has-text("Login")');
  await wait();
  console.log('URL after Login click:', page.url());
  await page.screenshot({ path: 'reports/screenshots/after_login_click.png' });

  // Check for modal
  const modalVisible = await page.isVisible('[role="dialog"], .modal, [class*="modal"], [class*="dialog"]');
  console.log('Modal visible:', modalVisible);

  const loginInputs = await page.$$eval('input', els =>
    els.map(e => ({ type: e.type, name: e.name, id: e.id, placeholder: e.placeholder }))
  );
  console.log('Login inputs:', JSON.stringify(loginInputs));

  await page.screenshot({ path: 'reports/screenshots/login_modal.png' });

  // --- Order Now ---
  await page.goto(BASE_URL);
  await wait();
  await page.click('button:has-text("Order Now"), a:has-text("Order Now")').catch(() => {});
  await wait();
  console.log('\n=== URL after Order Now click ===', page.url());
  await page.screenshot({ path: 'reports/screenshots/order_now.png' });

  // --- Scroll down homepage for more elements ---
  await page.goto(BASE_URL);
  await wait();
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'reports/screenshots/homepage_scroll1.png' });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'reports/screenshots/homepage_scroll2.png' });
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'reports/screenshots/homepage_scroll3.png' });

  // Get full page content structure
  console.log('\n=== PAGE SECTIONS (h1, h2, h3) ===');
  const headings = await page.$$eval('h1, h2, h3, h4', els => els.map(e => ({ tag: e.tagName, text: e.textContent?.trim() })));
  console.log(JSON.stringify(headings, null, 2));

  // --- View Weekly Menu ---
  await page.goto(BASE_URL);
  await wait();
  await page.click('button:has-text("View Weekly Menu"), a:has-text("View Weekly Menu")').catch(() => {});
  await wait();
  console.log('\n=== URL after View Weekly Menu click ===', page.url());
  await page.screenshot({ path: 'reports/screenshots/weekly_menu.png' });

  const menuItems = await page.$$eval('button, a', els =>
    els.map(e => ({ tag: e.tagName, text: e.textContent?.trim().substring(0,40), href: e.getAttribute('href') }))
       .filter(e => e.text && e.text.length > 1)
       .slice(0, 30)
  );
  console.log('Menu page items:', JSON.stringify(menuItems, null, 2));

  // --- About ---
  await page.goto(BASE_URL);
  await wait();
  await page.click('button:has-text("About"), a:has-text("About")').catch(() => {});
  await wait();
  console.log('\n=== URL after About click ===', page.url());
  await page.screenshot({ path: 'reports/screenshots/about.png' });

  await browser.close();
}

inspect().catch(console.error);
