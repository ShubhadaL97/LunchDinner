import { Before, After, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

setDefaultTimeout(40000);

// Ensure screenshot directory exists
BeforeAll(async function () {
  mkdirSync('reports/screenshots', { recursive: true });
  mkdirSync('reports/allure-results', { recursive: true });
});

Before(async function (scenario) {
  const headless = this.parameters?.headless !== false;

  this.browser = await chromium.launch({
    headless: headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });

  this.page = await context.newPage();
  this.initPages();
});

After(async function (scenario) {
  // Capture screenshot and attach to Allure on failure
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  if (this.browser) {
    await this.browser.close();
  }
});
