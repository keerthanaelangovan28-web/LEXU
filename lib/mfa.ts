import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import crypto from 'crypto'

export interface MFASetupResult {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface MFAVerification {
  isValid: boolean
  remainingBackupCodes?: number
}

export async function generateTOTPSetup(userEmail: string): Promise<MFASetupResult> {
  const secret = speakeasy.generateSecret({
    name: `LexAxiom (${userEmail})`,
    issuer: 'LexAxiom',
    length: 32,
  })

  if (!secret.otpauth_url) {
    throw new Error('Failed to generate TOTP secret')
  }

  const qrCode = await QRCode.toDataURL(secret.otpauth_url)

  // Generate 10 backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  )

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  }
}

export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 time step in each direction
    })
    return isValid
  } catch {
    return false
  }
}

export function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  )
}

export function verifyBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code.toUpperCase())
}

export async function generateSMSOTP(length: number = 6): Promise<string> {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  const data = `${userAgent}-${ip}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function validateMFAToken(token: string, secret: string): boolean {
  // Remove spaces and check length
  const cleanToken = token.replace(/\s/g, '')

  if (!/^\d{6}$/.test(cleanToken)) {
    return false
  }

  return verifyTOTPToken(cleanToken, secret)
}
