import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Page } from 'playwright';
import EncryptionService from './encryption.js';
import { TestData } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const encryptionService = new EncryptionService();

export function loadTestData(): TestData {
  const testData = JSON.parse(
    readFileSync(join(__dirname, '../test-data/testData.json'), 'utf-8')
  ) as TestData;

  if (testData.users) {
    Object.keys(testData.users).forEach(userType => {
      const userKey = userType as keyof typeof testData.users;
      if (testData.users[userKey].password) {
        testData.users[userKey].password = encryptionService.getPlainPassword(
          testData.users[userKey].password
        );
      }
    });
  }

  if (testData.registration && testData.registration.password) {
    testData.registration.password = encryptionService.getPlainPassword(
      testData.registration.password
    );
    testData.registration.confirmPassword = encryptionService.getPlainPassword(
      testData.registration.confirmPassword
    );
  }

  if (testData.checkout && testData.checkout.payment && testData.checkout.payment.cvv) {
    testData.checkout.payment.cvv = encryptionService.getPlainPassword(
      testData.checkout.payment.cvv
    );
  }

  if (testData.checkout && testData.checkout.payment && testData.checkout.payment.cardNumber) {
    testData.checkout.payment.cardNumber = encryptionService.getPlainPassword(
      testData.checkout.payment.cardNumber
    );
  }

  return testData;
}

export function generateTimestamp(): number {
  return Date.now();
}

export function generateUniqueEmail(base: string = 'testuser'): string {
  return `${base}_${Date.now()}@mailinator.com`;
}

export async function waitForNetworkIdle(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function clearAndType(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).clear();
  await page.locator(selector).fill(value);
}

export async function isElementPresent(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function encryptPassword(plainPassword: string): string {
  return encryptionService.encrypt(plainPassword);
}

export function decryptPassword(encryptedPassword: string): string {
  return encryptionService.decrypt(encryptedPassword);
}

export function getPlainPassword(passwordOrEncrypted: string): string {
  return encryptionService.getPlainPassword(passwordOrEncrypted);
}

export function isPasswordEncrypted(text: string): boolean {
  return encryptionService.isEncrypted(text);
}
