import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import EncryptionService from './utils/encryption.js';
import { TestData } from './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encryptionService = new EncryptionService();
const testDataPath = join(__dirname, 'test-data/testData.json');

function encryptTestData(): void {
  console.log('Loading test data...');
  const testData: TestData = JSON.parse(readFileSync(testDataPath, 'utf-8'));

  console.log('Encrypting passwords and sensitive data...');

  if (testData.users) {
    Object.keys(testData.users).forEach((userType: string) => {
      const userKey = userType as keyof typeof testData.users;
      if (testData.users[userKey].password) {
        const plainPassword = testData.users[userKey].password;
        testData.users[userKey].password = encryptionService.encrypt(plainPassword);
        console.log(`✓ Encrypted ${userType} user password`);
      }
    });
  }

  if (testData.registration) {
    if (testData.registration.password) {
      testData.registration.password = encryptionService.encrypt(testData.registration.password);
      console.log('✓ Encrypted registration password');
    }
    if (testData.registration.confirmPassword) {
      testData.registration.confirmPassword = encryptionService.encrypt(testData.registration.confirmPassword);
      console.log('✓ Encrypted registration confirmPassword');
    }
    if (testData.registration.wrongConfirmPassword) {
      testData.registration.wrongConfirmPassword = encryptionService.encrypt(testData.registration.wrongConfirmPassword);
      console.log('✓ Encrypted registration wrongConfirmPassword');
    }
  }

  if (testData.checkout && testData.checkout.payment) {
    if (testData.checkout.payment.cardNumber) {
      testData.checkout.payment.cardNumber = encryptionService.encrypt(testData.checkout.payment.cardNumber);
      console.log('✓ Encrypted payment card number');
    }
    if (testData.checkout.payment.cvv) {
      testData.checkout.payment.cvv = encryptionService.encrypt(testData.checkout.payment.cvv);
      console.log('✓ Encrypted payment CVV');
    }
  }

  console.log('\nWriting encrypted data to file...');
  writeFileSync(testDataPath, JSON.stringify(testData, null, 2), 'utf-8');
  console.log('✓ Test data encrypted and saved successfully!');

  console.log('\n⚠️  IMPORTANT: Encrypted passwords now stored in testData.json');
  console.log('Make sure to set ENCRYPTION_KEY environment variable before running tests.');
  console.log('See .env.example for instructions.');
}

function decryptTestData(): void {
  console.log('Loading test data...');
  const testData: TestData = JSON.parse(readFileSync(testDataPath, 'utf-8'));

  console.log('Decrypting passwords and sensitive data...');

  if (testData.users) {
    Object.keys(testData.users).forEach((userType: string) => {
      const userKey = userType as keyof typeof testData.users;
      if (testData.users[userKey].password) {
        try {
          const decrypted = encryptionService.getPlainPassword(testData.users[userKey].password);
          testData.users[userKey].password = decrypted;
          console.log(`✓ Decrypted ${userType} user password`);
        } catch (error) {
          console.log(`✗ Failed to decrypt ${userType} user password`);
        }
      }
    });
  }

  if (testData.registration) {
    if (testData.registration.password) {
      try {
        testData.registration.password = encryptionService.getPlainPassword(testData.registration.password);
        console.log('✓ Decrypted registration password');
      } catch (error) {
        console.log('✗ Failed to decrypt registration password');
      }
    }
    if (testData.registration.confirmPassword) {
      try {
        testData.registration.confirmPassword = encryptionService.getPlainPassword(testData.registration.confirmPassword);
        console.log('✓ Decrypted registration confirmPassword');
      } catch (error) {
        console.log('✗ Failed to decrypt registration confirmPassword');
      }
    }
    if (testData.registration.wrongConfirmPassword) {
      try {
        testData.registration.wrongConfirmPassword = encryptionService.getPlainPassword(testData.registration.wrongConfirmPassword);
        console.log('✓ Decrypted registration wrongConfirmPassword');
      } catch (error) {
        console.log('✗ Failed to decrypt registration wrongConfirmPassword');
      }
    }
  }

  if (testData.checkout && testData.checkout.payment) {
    if (testData.checkout.payment.cardNumber) {
      try {
        testData.checkout.payment.cardNumber = encryptionService.getPlainPassword(testData.checkout.payment.cardNumber);
        console.log('✓ Decrypted payment card number');
      } catch (error) {
        console.log('✗ Failed to decrypt payment card number');
      }
    }
    if (testData.checkout.payment.cvv) {
      try {
        testData.checkout.payment.cvv = encryptionService.getPlainPassword(testData.checkout.payment.cvv);
        console.log('✓ Decrypted payment CVV');
      } catch (error) {
        console.log('✗ Failed to decrypt payment CVV');
      }
    }
  }

  console.log('\nWriting decrypted data to file...');
  writeFileSync(testDataPath, JSON.stringify(testData, null, 2), 'utf-8');
  console.log('✓ Test data decrypted and saved successfully!');
}

const command = process.argv[2];

if (command === 'encrypt') {
  encryptTestData();
} else if (command === 'decrypt') {
  decryptTestData();
} else {
  console.log('Password Encryption/Decryption Tool for Test Data');
  console.log('================================================\n');
  console.log('Usage:');
  console.log('  npx tsx encrypt-testdata.ts encrypt   - Encrypt all passwords in testData.json');
  console.log('  npx tsx encrypt-testdata.ts decrypt   - Decrypt all passwords in testData.json\n');
  console.log('Examples:');
  console.log('  npx tsx encrypt-testdata.ts encrypt');
  console.log('  npx tsx encrypt-testdata.ts decrypt\n');
  console.log('⚠️  Note: Make sure ENCRYPTION_KEY is set in your .env file before running!');
  process.exit(1);
}
