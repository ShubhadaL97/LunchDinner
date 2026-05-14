import crypto from 'crypto';

/**
 * Encryption utility for securing sensitive test data like passwords
 * Uses AES-256-CBC encryption with a configurable encryption key
 */

class EncryptionService {
  constructor(encryptionKey = null) {
    // Use environment variable or default key (should be changed in production)
    // For security, set ENCRYPTION_KEY environment variable
    this.encryptionKey = encryptionKey ||
                         process.env.ENCRYPTION_KEY ||
                         'your-secret-encryption-key-min-32-chars-long!!';

    // Ensure key is exactly 32 bytes for AES-256
    const hash = crypto.createHash('sha256');
    hash.update(String(this.encryptionKey));
    this.key = hash.digest();
  }

  /**
   * Encrypt a string value
   * @param {string} plainText - The text to encrypt
   * @returns {string} - Encrypted text in format: iv:encryptedText
   */
  encrypt(plainText) {
    if (!plainText || typeof plainText !== 'string') {
      throw new Error('plainText must be a non-empty string');
    }

    try {
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);

      // Create cipher with AES-256-CBC
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);

      // Encrypt the text
      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Return IV and encrypted text together (separated by colon)
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt an encrypted string
   * @param {string} encryptedText - Encrypted text in format: iv:encryptedText
   * @returns {string} - Decrypted plain text
   */
  decrypt(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string') {
      throw new Error('encryptedText must be a non-empty string');
    }

    try {
      // Split IV and encrypted text
      const parts = encryptedText.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted text format. Expected: iv:encryptedText');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];

      // Create decipher with AES-256-CBC
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);

      // Decrypt the text
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Check if a string appears to be encrypted (contains colon separator)
   * @param {string} text - Text to check
   * @returns {boolean} - True if appears to be encrypted
   */
  isEncrypted(text) {
    if (typeof text !== 'string') return false;
    const parts = text.split(':');
    return parts.length === 2 && parts[0].length === 32; // IV is 32 hex chars
  }

  /**
   * Safely get a password - decrypts if encrypted, returns as-is if not
   * @param {string} password - Password that may be encrypted
   * @returns {string} - Plain text password
   */
  getPlainPassword(password) {
    if (!password) return password;

    try {
      if (this.isEncrypted(password)) {
        return this.decrypt(password);
      }
      return password;
    } catch (error) {
      console.warn('Failed to decrypt password, using as-is:', error.message);
      return password;
    }
  }
}

export default EncryptionService;

/**
 * Quick utility functions for one-off encryption/decryption
 */
export const encryptPassword = (plainPassword, encryptionKey = null) => {
  const service = new EncryptionService(encryptionKey);
  return service.encrypt(plainPassword);
};

export const decryptPassword = (encryptedPassword, encryptionKey = null) => {
  const service = new EncryptionService(encryptionKey);
  return service.decrypt(encryptedPassword);
};

/**
 * Command-line utility for encrypting passwords
 * Usage: node -e "import('./utils/encryption.js').then(m => { const svc = new m.default(); console.log(svc.encrypt('mypassword')); })"
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const encryptionService = new EncryptionService();

  if (process.argv[2] === 'encrypt' && process.argv[3]) {
    console.log('Encrypted password:');
    console.log(encryptionService.encrypt(process.argv[3]));
  } else if (process.argv[2] === 'decrypt' && process.argv[3]) {
    console.log('Decrypted password:');
    console.log(encryptionService.decrypt(process.argv[3]));
  } else {
    console.log('Usage:');
    console.log('  node encryption.js encrypt "your-password"');
    console.log('  node encryption.js decrypt "encrypted-password"');
  }
}
