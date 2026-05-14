import EncryptionService from './utils/encryption.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const encryptionService = new EncryptionService();
const testDataPath = join(__dirname, 'test-data/testData.json');

// Load test data
const testData = JSON.parse(readFileSync(testDataPath, 'utf-8'));

function decryptPassword(encrypted) {
  try {
    return encryptionService.decrypt(encrypted);
  } catch (error) {
    return '[Failed to decrypt]';
  }
}

function viewAllPasswords() {
  console.log('\n========== ALL ENCRYPTED PASSWORDS ==========\n');

  // User passwords
  console.log('👤 USER LOGIN PASSWORDS:');
  Object.keys(testData.users).forEach(userType => {
    const user = testData.users[userType];
    if (user.password) {
      console.log(`  ${userType}:`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Encrypted: ${user.password}`);
      console.log(`    Decrypted: ${decryptPassword(user.password)}`);
    }
  });

  // Registration passwords
  console.log('\n📝 REGISTRATION PASSWORDS:');
  if (testData.registration.password) {
    console.log(`  password:`);
    console.log(`    Encrypted: ${testData.registration.password}`);
    console.log(`    Decrypted: ${decryptPassword(testData.registration.password)}`);
  }
  if (testData.registration.confirmPassword) {
    console.log(`  confirmPassword:`);
    console.log(`    Encrypted: ${testData.registration.confirmPassword}`);
    console.log(`    Decrypted: ${decryptPassword(testData.registration.confirmPassword)}`);
  }
  if (testData.registration.wrongConfirmPassword) {
    console.log(`  wrongConfirmPassword:`);
    console.log(`    Encrypted: ${testData.registration.wrongConfirmPassword}`);
    console.log(`    Decrypted: ${decryptPassword(testData.registration.wrongConfirmPassword)}`);
  }

  // Payment info
  console.log('\n💳 PAYMENT INFORMATION:');
  if (testData.checkout.payment.cardNumber) {
    console.log(`  cardNumber:`);
    console.log(`    Encrypted: ${testData.checkout.payment.cardNumber}`);
    console.log(`    Decrypted: ${decryptPassword(testData.checkout.payment.cardNumber)}`);
  }
  if (testData.checkout.payment.cvv) {
    console.log(`  CVV:`);
    console.log(`    Encrypted: ${testData.checkout.payment.cvv}`);
    console.log(`    Decrypted: ${decryptPassword(testData.checkout.payment.cvv)}`);
  }

  console.log('\n==========================================\n');
}

function viewSpecificPassword(passwordType) {
  console.log('\n========== DECRYPT SPECIFIC PASSWORD ==========\n');

  let encrypted = null;
  let label = '';

  // Map password types to actual data
  switch (passwordType.toLowerCase()) {
    case 'valid':
      encrypted = testData.users.valid.password;
      label = 'Valid User Password';
      break;
    case 'invalid':
      encrypted = testData.users.invalid.password;
      label = 'Invalid User Password';
      break;
    case 'lockedout':
    case 'locked':
      encrypted = testData.users.lockedOut.password;
      label = 'Locked Out User Password';
      break;
    case 'registration':
    case 'reg':
      encrypted = testData.registration.password;
      label = 'Registration Password';
      break;
    case 'confirm':
    case 'confirmpassword':
      encrypted = testData.registration.confirmPassword;
      label = 'Registration Confirm Password';
      break;
    case 'wrong':
    case 'wrongconfirm':
      encrypted = testData.registration.wrongConfirmPassword;
      label = 'Wrong Confirm Password';
      break;
    case 'card':
    case 'cardnumber':
      encrypted = testData.checkout.payment.cardNumber;
      label = 'Card Number';
      break;
    case 'cvv':
      encrypted = testData.checkout.payment.cvv;
      label = 'Payment CVV';
      break;
    default:
      console.log('❌ Unknown password type:', passwordType);
      console.log('\nAvailable options: valid, invalid, lockedout, registration, confirm, wrong, card, cvv');
      return;
  }

  if (encrypted) {
    console.log(`🔓 ${label}:`);
    console.log(`   Encrypted: ${encrypted}`);
    console.log(`   Decrypted: ${decryptPassword(encrypted)}`);
  } else {
    console.log(`❌ Password not found for: ${passwordType}`);
  }

  console.log('\n=============================================\n');
}

// Get command-line argument
const command = process.argv[2];

if (!command) {
  // Show usage
  console.log('\n========== PASSWORD DECRYPTION UTILITY ==========\n');
  console.log('Usage: node view-password.js <password-type>\n');
  console.log('View ALL passwords:');
  console.log('  node view-password.js all\n');
  console.log('View SPECIFIC password:');
  console.log('  node view-password.js valid          (valid user password)');
  console.log('  node view-password.js invalid        (invalid user password)');
  console.log('  node view-password.js lockedout      (locked out user password)');
  console.log('  node view-password.js registration   (registration password)');
  console.log('  node view-password.js confirm        (registration confirm password)');
  console.log('  node view-password.js wrong          (wrong confirm password)');
  console.log('  node view-password.js card           (payment card number)');
  console.log('  node view-password.js cvv            (payment CVV)\n');
  console.log('Examples:');
  console.log('  node view-password.js all');
  console.log('  node view-password.js valid');
  console.log('  node view-password.js cvv\n');
} else if (command.toLowerCase() === 'all') {
  viewAllPasswords();
} else {
  viewSpecificPassword(command);
}
