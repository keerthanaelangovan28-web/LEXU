const SESSION_KEY = 'auth-token'
const SESSION_EXPIRY_KEY = 'auth-token-expiry'

export interface Session {
  token: string
  expiresAt: number
}

export function setSession(token: string, expiryMinutes: number = 60): void {
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000
  const session: Session = { token, expiresAt }

  try {
    document.cookie = `${SESSION_KEY}=${token}; path=/; max-age=${expiryMinutes * 60}; secure; samesite=strict`
    localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString())
  } catch (error) {
    console.error('[v0] Failed to set session:', error)
  }
}

export function getSession(): Session | null {
  try {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${SESSION_KEY}=`))
      ?.split('=')[1]

    if (!token) return null

    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY)
    const expiresAt = expiryStr ? parseInt(expiryStr) : Date.now() + 60 * 60 * 1000

    if (Date.now() > expiresAt) {
      clearSession()
      return null
    }

    return { token, expiresAt }
  } catch (error) {
    console.error('[v0] Failed to get session:', error)
    return null
  }
}

export function clearSession(): void {
  try {
    document.cookie = `${SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict`
    localStorage.removeItem(SESSION_EXPIRY_KEY)
  } catch (error) {
    console.error('[v0] Failed to clear session:', error)
  }
}

export function isSessionValid(): boolean {
  const session = getSession()
  return session !== null && Date.now() < session.expiresAt
}

export function getAuthHeader(): { Authorization: string } | null {
  const session = getSession()
  if (!session) return null
  return { Authorization: `Bearer ${session.token}` }
}

export function refreshSession(expiryMinutes: number = 60): void {
  const session = getSession()
  if (session) {
    setSession(session.token, expiryMinutes)
  }
}
