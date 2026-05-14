import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import EncryptionService from './utils/encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n========== FRAMEWORK SETUP VERIFICATION ==========\n');

let allPassed = true;

// 1. Check .env file
console.log('1️⃣  Checking .env file...');
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  const envContent = readFileSync(envPath, 'utf-8');
  if (envContent.includes('ENCRYPTION_KEY')) {
    console.log('   ✅ ENCRYPTION_KEY is set in .env');
  } else {
    console.log('   ❌ ENCRYPTION_KEY not found in .env');
    allPassed = false;
  }
} else {
  console.log('   ❌ .env file not found');
  allPassed = false;
}

// 2. Check environment variable
console.log('\n2️⃣  Checking ENCRYPTION_KEY environment variable...');
const encryptionKey = process.env.ENCRYPTION_KEY;
if (encryptionKey) {
  console.log('   ✅ ENCRYPTION_KEY environment variable is set');
  console.log(`   Value: ${encryptionKey.substring(0, 20)}...`);
} else {
  console.log('   ⚠️  ENCRYPTION_KEY environment variable not set (may be set in GitHub)');
}

// 3. Check encryption service
console.log('\n3️⃣  Testing encryption service...');
try {
  const encryptionService = new EncryptionService();
  const testPassword = 'TestPassword123!';
  const encrypted = encryptionService.encrypt(testPassword);
  const decrypted = encryptionService.decrypt(encrypted);

  if (decrypted === testPassword) {
    console.log('   ✅ Encryption/Decryption working correctly');
    console.log(`   Plain: ${testPassword}`);
    console.log(`   Encrypted: ${encrypted.substring(0, 40)}...`);
  } else {
    console.log('   ❌ Decryption failed');
    allPassed = false;
  }
} catch (error) {
  console.log('   ❌ Encryption service error:', error.message);
  allPassed = false;
}

// 4. Check testData.json
console.log('\n4️⃣  Checking testData.json...');
const testDataPath = join(__dirname, 'test-data/testData.json');
if (existsSync(testDataPath)) {
  try {
    const testData = JSON.parse(readFileSync(testDataPath, 'utf-8'));
    console.log('   ✅ testData.json is valid JSON');

    // Check if passwords are encrypted
    if (testData.users && testData.users.valid && testData.users.valid.password) {
      const password = testData.users.valid.password;
      if (password.includes(':')) {
        console.log('   ✅ Passwords appear to be encrypted');
      } else {
        console.log('   ⚠️  Passwords appear to be plain text (should be encrypted)');
      }
    }
  } catch (error) {
    console.log('   ❌ testData.json parsing error:', error.message);
    allPassed = false;
  }
} else {
  console.log('   ❌ testData.json not found');
  allPassed = false;
}

// 5. Check helper functions
console.log('\n5️⃣  Checking helper functions...');
try {
  const helpers = await import('./utils/helpers.js');
  if (helpers.loadTestData && typeof helpers.loadTestData === 'function') {
    console.log('   ✅ loadTestData function exists');

    // Try to load test data
    try {
      const data = helpers.loadTestData();
      console.log('   ✅ loadTestData executed successfully');

      if (data.users && data.users.valid) {
        console.log(`   ✅ Test data loaded with user email: ${data.users.valid.email}`);
      }
    } catch (error) {
      console.log('   ❌ loadTestData error:', error.message);
      allPassed = false;
    }
  } else {
    console.log('   ❌ loadTestData function not found');
    allPassed = false;
  }
} catch (error) {
  console.log('   ❌ Helper import error:', error.message);
  allPassed = false;
}

// 6. Check package.json scripts
console.log('\n6️⃣  Checking npm scripts...');
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
  const requiredScripts = ['test', 'test:smoke', 'test:auth', 'test:menu'];

  let scriptsOK = true;
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`   ✅ npm script '${script}' exists`);
    } else {
      console.log(`   ❌ npm script '${script}' missing`);
      scriptsOK = false;
    }
  });

  if (!scriptsOK) allPassed = false;
} catch (error) {
  console.log('   ❌ package.json error:', error.message);
  allPassed = false;
}

// 7. Check GitHub workflow file
console.log('\n7️⃣  Checking GitHub Actions workflow...');
const workflowPath = join(__dirname, '.github/workflows/test.yml');
if (existsSync(workflowPath)) {
  console.log('   ✅ .github/workflows/test.yml exists');
  const workflowContent = readFileSync(workflowPath, 'utf-8');
  if (workflowContent.includes('ENCRYPTION_KEY')) {
    console.log('   ✅ Workflow uses ENCRYPTION_KEY');
  } else {
    console.log('   ❌ Workflow does not use ENCRYPTION_KEY');
    allPassed = false;
  }
} else {
  console.log('   ❌ .github/workflows/test.yml not found');
  allPassed = false;
}

// Final result
console.log('\n================================================\n');
if (allPassed) {
  console.log('✅ ALL CHECKS PASSED - Framework is ready!');
  console.log('\nYour setup is correct. If tests fail in GitHub Actions:');
  console.log('1. Check that ENCRYPTION_KEY secret is set in GitHub');
  console.log('2. Verify the website (lunchdinner.co.nz) is accessible');
  console.log('3. Check for pre-existing test failures (known UI issues)');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED - Fix the issues above');
  console.log('\nCommon fixes:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run encrypt:data');
  console.log('3. Check .env file has ENCRYPTION_KEY');
  process.exit(1);
}
