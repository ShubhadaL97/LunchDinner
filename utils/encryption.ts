import crypto from 'crypto';

class EncryptionService {
  private encryptionKey: string;
  private key: Buffer;

  constructor(encryptionKey?: string | null) {
    this.encryptionKey =
      encryptionKey ||
      process.env.ENCRYPTION_KEY ||
      'your-secret-encryption-key-min-32-chars-long!!';

    const hash = crypto.createHash('sha256');
    hash.update(String(this.encryptionKey));
    this.key = hash.digest();
  }

  encrypt(plainText: string): string {
    if (!plainText || typeof plainText !== 'string') {
      throw new Error('plainText must be a non-empty string');
    }

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);

      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  decrypt(encryptedText: string): string {
    if (!encryptedText || typeof encryptedText !== 'string') {
      throw new Error('encryptedText must be a non-empty string');
    }

    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted text format. Expected: iv:encryptedText');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];

      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  isEncrypted(text: string): boolean {
    if (typeof text !== 'string') return false;
    const parts = text.split(':');
    return parts.length === 2 && parts[0].length === 32;
  }

  getPlainPassword(password: string): string {
    if (!password) return password;

    try {
      if (this.isEncrypted(password)) {
        return this.decrypt(password);
      }
      return password;
    } catch (error) {
      console.warn('Failed to decrypt password, using as-is:', error instanceof Error ? error.message : String(error));
      return password;
    }
  }
}

export default EncryptionService;

export const encryptPassword = (plainPassword: string, encryptionKey?: string | null): string => {
  const service = new EncryptionService(encryptionKey);
  return service.encrypt(plainPassword);
};

export const decryptPassword = (encryptedPassword: string, encryptionKey?: string | null): string => {
  const service = new EncryptionService(encryptionKey);
  return service.decrypt(encryptedPassword);
};

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
    console.log('  npx tsx utils/encryption.ts encrypt "your-password"');
    console.log('  npx tsx utils/encryption.ts decrypt "encrypted-password"');
  }
}
