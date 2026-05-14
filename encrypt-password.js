import EncryptionService from './utils/encryption.js';

const encryptionService = new EncryptionService();

function encryptSinglePassword() {
  const plainPassword = process.argv[2];

  if (!plainPassword) {
    console.log('\n========== ENCRYPT A PASSWORD ==========\n');
    console.log('Usage: node encrypt-password.js "your-password"\n');
    console.log('Examples:');
    console.log('  node encrypt-password.js "MyPassword123!"');
    console.log('  node encrypt-password.js "Test@123"\n');
    console.log('Then copy the encrypted value and add it to testData.json\n');
    return;
  }

  try {
    const encrypted = encryptionService.encrypt(plainPassword);

    console.log('\n========== ENCRYPTED PASSWORD ==========\n');
    console.log(`Plain Password:    ${plainPassword}`);
    console.log(`Encrypted Value:   ${encrypted}`);
   
  } catch (error) {
    console.error('❌ Error encrypting password:', error.message);
  }
}

encryptSinglePassword();
