import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const ALGORITHM = 'aes-256-gcm'

export interface EncryptedData {
  ciphertext: string
  iv: string
  authTag: string
}

export function encryptData(plaintext: string): EncryptedData {
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    ciphertext: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  }
}

export function decryptData(encryptedData: EncryptedData): string {
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const iv = Buffer.from(encryptedData.iv, 'hex')
  const authTag = Buffer.from(encryptedData.authTag, 'hex')
  const ciphertext = Buffer.from(encryptedData.ciphertext, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  try {
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ])
    return decrypted.toString('utf8')
  } catch {
    throw new Error('Decryption failed - data may be corrupted or tampered with')
  }
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

export function hashData(data: string, algorithm: string = 'sha256'): string {
  return crypto.createHash(algorithm).update(data).digest('hex')
}

export function generateHmac(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export function verifyHmac(data: string, secret: string, signature: string): boolean {
  const computed = generateHmac(data, secret)
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))
}
