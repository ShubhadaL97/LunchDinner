import { chromium } from 'playwright';

const BASE_URL = 'https://www.lunchdinner.co.nz';

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  async function dump(label, url) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE: ${label} — ${url}`);
    console.log('='.repeat(60));
    await page.goto(url);
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Nav links
    const navLinks = await page.$$eval('header a, nav a', els =>
      els.map(e => ({ text: e.textContent?.trim(), href: e.getAttribute('href') }))
         .filter(e => e.text)
    );
    console.log('NAV LINKS:', JSON.stringify(navLinks, null, 2));

    // Buttons
    const buttons = await page.$$eval('button, a[role="button"]', els =>
      els.map(e => ({ text: e.textContent?.trim(), id: e.id, class: e.className?.substring(0, 60) }))
         .filter(e => e.text && e.text.length < 50)
         .slice(0, 15)
    );
    console.log('BUTTONS:', JSON.stringify(buttons, null, 2));

    // Inputs
    const inputs = await page.$$eval('input, textarea, select', els =>
      els.map(e => ({ tag: e.tagName, type: e.type, name: e.name, id: e.id, placeholder: e.placeholder, class: e.className?.substring(0, 60) }))
         .slice(0, 15)
    );
    console.log('INPUTS:', JSON.stringify(inputs, null, 2));

    // Screenshot
    await page.screenshot({ path: `reports/screenshots/${label.replace(/\s/g, '_')}.png`, fullPage: false });
    console.log(`Screenshot saved.`);
  }

  try {
    await dump('homepage', BASE_URL);
    await dump('menu', `${BASE_URL}/menu`);
    await dump('login', `${BASE_URL}/login`);
    await dump('register', `${BASE_URL}/register`);
    await dump('contact', `${BASE_URL}/contact`);
    await dump('cart', `${BASE_URL}/cart`);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
}

inspect();
