import * as crypto from 'crypto';

export class AESCipher {
  private algorithm: string;
  private encryptKey: string;
  private encryptIv: string;
  private key: Buffer;
  private iv: Buffer;

  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.encryptKey = process.env.CUSTOM_ENCRYPTION_KEY as string;
    this.encryptIv = process.env.CUSTOM_ENCRYPTION_IV as string;

    this.key = Buffer.from(this.encryptKey, 'hex');
    this.iv = Buffer.from(this.encryptIv, 'hex');

    if (this.key.length !== 32) {
      throw new Error('Key must be 32 bytes (256 bits) for aes-256-cbc');
    }

    if (this.iv.length !== 16) {
      throw new Error('IV must be 16 bytes (128 bits) for aes-256-cbc');
    }
  }

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedData: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
