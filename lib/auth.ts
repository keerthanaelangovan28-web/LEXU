import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-change-in-production'

export interface User {
  id: string
  email: string
  name: string
  role: 'super-admin' | 'admin' | 'uploader' | 'viewer'
  avatar?: string
  createdAt: Date
}

export interface AuthSession {
  user: User
  token: string
  refreshToken: string
  expiresAt: number
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export function generateTokens(user: User): {
  token: string
  refreshToken: string
  expiresAt: number
} {
  const expiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour
  const refreshExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: 'refresh',
    },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return {
    token,
    refreshToken,
    expiresAt,
  }
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      createdAt: new Date(decoded.createdAt),
    }
  } catch {
    return null
  }
}

export async function setAuthCookies(session: AuthSession) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  })

  cookieStore.set('refresh-token', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  cookieStore.set('auth-user', JSON.stringify(session.user), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60,
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  cookieStore.delete('refresh-token')
  cookieStore.delete('auth-user')
}
