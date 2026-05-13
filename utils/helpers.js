import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadTestData() {
  return JSON.parse(
    readFileSync(join(__dirname, '../test-data/testData.json'), 'utf-8')
  );
}

export function generateTimestamp() {
  return Date.now();
}

export function generateUniqueEmail(base = 'testuser') {
  return `${base}_${Date.now()}@mailinator.com`;
}

export async function waitForNetworkIdle(page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function scrollToBottom(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

export async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function clearAndType(page, selector, value) {
  await page.locator(selector).clear();
  await page.locator(selector).fill(value);
}

export async function isElementPresent(page, selector) {
  return (await page.locator(selector).count()) > 0;
}

export async function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
