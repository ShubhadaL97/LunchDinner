import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import EncryptionService from './encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const encryptionService = new EncryptionService();

export function loadTestData() {
  const testData = JSON.parse(
    readFileSync(join(__dirname, '../test-data/testData.json'), 'utf-8')
  );

  // Decrypt all passwords in test data
  if (testData.users) {
    Object.keys(testData.users).forEach(userType => {
      if (testData.users[userType].password) {
        testData.users[userType].password = encryptionService.getPlainPassword(
          testData.users[userType].password
        );
      }
    });
  }

  // Decrypt registration password if encrypted
  if (testData.registration && testData.registration.password) {
    testData.registration.password = encryptionService.getPlainPassword(
      testData.registration.password
    );
    testData.registration.confirmPassword = encryptionService.getPlainPassword(
      testData.registration.confirmPassword
    );
  }

  // Decrypt payment info if needed
  if (testData.checkout && testData.checkout.payment && testData.checkout.payment.cvv) {
    testData.checkout.payment.cvv = encryptionService.getPlainPassword(
      testData.checkout.payment.cvv
    );
  }

  return testData;
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

/**
 * Encryption/Decryption utilities
 */

export function encryptPassword(plainPassword) {
  return encryptionService.encrypt(plainPassword);
}

export function decryptPassword(encryptedPassword) {
  return encryptionService.decrypt(encryptedPassword);
}

export function getPlainPassword(passwordOrEncrypted) {
  return encryptionService.getPlainPassword(passwordOrEncrypted);
}

export function isPasswordEncrypted(text) {
  return encryptionService.isEncrypted(text);
}
