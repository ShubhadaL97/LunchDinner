# Password Encryption & Security Guide

## Overview

The test framework now implements **AES-256-CBC encryption** to secure sensitive test data including passwords, card numbers, and CVV codes. This prevents plain-text secrets from being exposed in the repository or logs.

## Security Architecture

### Encryption Details
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard, 256-bit key)
- **Key Derivation**: SHA-256 hash of encryption key
- **Initialization Vector (IV)**: Random 16-byte IV for each encryption
- **Format**: Encrypted data stored as `iv:encryptedText` (IV is prepended to ciphertext)

### Key Features
✅ Each password encrypted with a unique IV  
✅ Deterministic key derivation using SHA-256  
✅ Automatic detection of encrypted vs. plain-text passwords  
✅ Seamless decryption during test execution  
✅ CLI tools for encrypt/decrypt operations  

---

## Setup Instructions

### 1. Set Encryption Key

Create a `.env` file in the project root with your encryption key:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your encryption key
ENCRYPTION_KEY=your-secure-encryption-key-min-32-chars!!!!
```

**Security Best Practices:**
- Generate a strong, random key (minimum 32 characters)
- Use a different key for each environment (dev, staging, prod)
- Never commit `.env` to version control (already in .gitignore)
- Rotate keys periodically
- Store production keys in secure vaults (AWS Secrets Manager, HashiCorp Vault, etc.)

### 2. Encrypt Test Data

Run the encryption migration script to encrypt all passwords in `testData.json`:

```bash
node encrypt-testdata.js encrypt
```

**Output:**
```
Loading test data...
Encrypting passwords and sensitive data...
✓ Encrypted valid user password
✓ Encrypted invalid user password
✓ Encrypted lockedOut user password
✓ Encrypted registration password
✓ Encrypted registration confirmPassword
✓ Encrypted registration wrongConfirmPassword
✓ Encrypted payment card number
✓ Encrypted payment CVV
Writing encrypted data to file...
✓ Test data encrypted and saved successfully!
```

### 3. Verify Encryption

Check that passwords in `test-data/testData.json` are now encrypted:

```bash
# View a sample of encrypted data
cat test-data/testData.json | head -20
```

You'll see encrypted passwords in the format: `iv:encryptedText`

Example:
```json
{
  "users": {
    "valid": {
      "email": "sblnzau@gmail.com",
      "password": "a1b2c3d4e5f6g7h8:9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7"
    }
  }
}
```

### 4. Run Tests

Tests will now automatically decrypt passwords when loading test data:

```bash
npm test
```

The `loadTestData()` helper function automatically:
1. Detects encrypted passwords
2. Decrypts them using the ENCRYPTION_KEY
3. Provides plain-text passwords to test steps

---

## Usage Guide

### Encrypting Individual Passwords

```javascript
import EncryptionService from './utils/encryption.js';

const encryptionService = new EncryptionService();

// Encrypt a password
const encrypted = encryptionService.encrypt('MyPassword123!');
console.log(encrypted); // Output: "iv:encryptedText"

// Decrypt the password
const plain = encryptionService.decrypt(encrypted);
console.log(plain); // Output: "MyPassword123!"
```

### Using Helper Functions

```javascript
import { encryptPassword, decryptPassword, getPlainPassword, isPasswordEncrypted } from './utils/helpers.js';

// Encrypt a password
const encrypted = encryptPassword('TestPass@123');

// Check if encrypted
const isEncrypted = isPasswordEncrypted(encrypted);
console.log(isEncrypted); // true

// Get plain password (auto-detects encryption)
const plain = getPlainPassword(encrypted);
console.log(plain); // "TestPass@123"
```

### CLI Commands

#### Encrypt Test Data
```bash
node encrypt-testdata.js encrypt
```
Encrypts all passwords in `test-data/testData.json`

#### Decrypt Test Data
```bash
node encrypt-testdata.js decrypt
```
Decrypts all passwords in `test-data/testData.json` (for backup/migration)

#### Encrypt a Single Password
```bash
node -e "import('./utils/encryption.js').then(m => { const svc = new m.default(); console.log(svc.encrypt('mypassword')); })"
```

#### Decrypt a Single Password
```bash
node encrypt-testdata.js decrypt
# Or use:
node -e "import('./utils/encryption.js').then(m => { const svc = new m.default(); console.log(svc.decrypt('iv:encryptedText')); })"
```

---

## File Reference

### Core Files

**`utils/encryption.js`**
- EncryptionService class with encrypt/decrypt methods
- Automatic IV generation and prepending
- Format: `iv:encryptedText`
- Methods:
  - `encrypt(plainText)` → encrypted string
  - `decrypt(encryptedText)` → plain text
  - `isEncrypted(text)` → boolean
  - `getPlainPassword(passwordOrEncrypted)` → plain text

**`utils/helpers.js`**
- Enhanced with automatic password decryption
- `loadTestData()` automatically decrypts passwords on load
- Wrapper functions: `encryptPassword()`, `decryptPassword()`, `getPlainPassword()`
- Used by all test steps for seamless password handling

**`encrypt-testdata.js`**
- CLI tool for bulk encryption/decryption
- Usage: `node encrypt-testdata.js [encrypt|decrypt]`
- Handles all password fields in testData.json

**`.env.example`**
- Template for environment variables
- Copy to `.env` and set your encryption key
- Already in `.gitignore` to prevent accidental commits

**`test-data/testData.json`**
- Contains test data with encrypted passwords
- Automatically decrypted by `loadTestData()`
- Safe to commit (encrypted passwords are secure)

---

## Password Fields Encrypted

The framework encrypts the following sensitive fields:

### User Passwords
- `users.valid.password`
- `users.invalid.password`
- `users.lockedOut.password`

### Registration Data
- `registration.password`
- `registration.confirmPassword`
- `registration.wrongConfirmPassword`

### Payment Data
- `checkout.payment.cardNumber`
- `checkout.payment.cvv`

---

## Environment Variables

### ENCRYPTION_KEY (Required)
Your encryption key for AES-256-CBC operations.

```bash
# Development
ENCRYPTION_KEY=dev-key-32-characters-minimum!!

# Staging
ENCRYPTION_KEY=staging-key-32-characters-min!!!

# Production
ENCRYPTION_KEY=production-key-highly-secure!!!
```

### Other Configuration
See `.env.example` for additional options:
- `HEADLESS` - Run browser in headless mode
- `TEST_TIMEOUT` - Maximum test execution time
- `ELEMENT_TIMEOUT` - Element interaction timeout

---

## Troubleshooting

### "Invalid encrypted text format" Error
**Problem**: Trying to decrypt data that isn't in `iv:encryptedText` format  
**Solution**: Check that data is encrypted (run `node encrypt-testdata.js encrypt`)

### "Decryption failed" Error
**Problem**: Wrong encryption key or corrupted encrypted data  
**Solution**: 
1. Verify ENCRYPTION_KEY in `.env` matches the key used for encryption
2. Check that encrypted data hasn't been modified
3. If data is corrupted, restore from backup and re-encrypt

### Tests Failing After Encryption
**Problem**: Tests can't decrypt passwords  
**Solution**:
1. Verify `.env` file exists in project root
2. Check ENCRYPTION_KEY is set and correct
3. Ensure `loadTestData()` is being called in test setup
4. Check that `utils/encryption.js` and `utils/helpers.js` are properly imported

### Plain-Text Passwords Still Showing
**Problem**: Passwords not encrypted in testData.json  
**Solution**: Run `node encrypt-testdata.js encrypt` to encrypt all passwords

---

## Security Recommendations

### For Development
- Use a consistent development key for local testing
- Store key in `.env` (never in code)
- Share key securely with team (not in version control)

### For CI/CD
- Set `ENCRYPTION_KEY` as a secured environment variable in CI system
- Use different keys for different environments
- Rotate keys regularly

### For Production
- Use a key management service (AWS Secrets Manager, Azure Key Vault, etc.)
- Implement key rotation policies
- Log all encryption/decryption operations for audit
- Restrict access to encryption keys to authorized personnel only

### Key Rotation
To rotate encryption keys:
1. Decrypt testData.json with old key: `node encrypt-testdata.js decrypt`
2. Update ENCRYPTION_KEY in `.env`
3. Re-encrypt testData.json: `node encrypt-testdata.js encrypt`
4. Update CI/CD environment variables
5. Verify tests pass with new key

---

## Technical Details

### How Encryption Works

1. **Key Derivation**
   ```javascript
   const hash = crypto.createHash('sha256');
   hash.update(String(encryptionKey));
   const key = hash.digest(); // 32-byte key
   ```

2. **Encryption**
   ```javascript
   const iv = crypto.randomBytes(16); // Random IV each time
   const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
   const encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
   return `${iv.toString('hex')}:${encrypted}`;
   ```

3. **Decryption**
   ```javascript
   const [ivHex, encrypted] = encryptedText.split(':');
   const iv = Buffer.from(ivHex, 'hex');
   const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
   const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
   return decrypted;
   ```

### Why AES-256-CBC?
- **Standard**: NIST-approved, widely used in industry
- **Secure**: 256-bit key provides strong encryption
- **Deterministic**: Same plaintext + key + IV = same ciphertext (good for testing)
- **Fast**: Hardware acceleration available on modern CPUs
- **Node.js Support**: Built-in via crypto module

---

## Compliance & Audit

### PCI DSS Compliance
- ✅ Passwords encrypted at rest
- ✅ Encryption key separate from encrypted data
- ✅ AES-256 meets PCI DSS requirements
- ⚠️ Note: This is for test data security; production payment data requires additional PCI DSS measures

### GDPR Considerations
- ✅ Sensitive personal data encrypted
- ✅ Easy to decrypt for data subject access requests
- ✅ Secure key management prevents unauthorized access

### Audit Trail
All encryption/decryption operations can be logged:

```javascript
console.log('Decrypting password for user:', email);
const plainPassword = encryptionService.decrypt(encryptedPassword);
console.log('Password decrypted successfully');
```

---

## Support & Questions

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review the encryption.js and helpers.js source code
3. Check error messages for specific guidance
4. Consult your team's security policies

---

**Last Updated**: 2026-05-15  
**Encryption Algorithm**: AES-256-CBC  
**Status**: Production Ready
