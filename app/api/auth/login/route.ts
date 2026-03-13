import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateTokens, setAuthCookies } from '@/lib/auth'
import { getUserByEmail, updateLastLogin } from '@/lib/db-users'
import { logAudit } from '@/lib/audit-logger'
import { validateMFAToken, verifyBackupCode } from '@/lib/mfa'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, mfaToken, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // BUG 1 FIX: normalise email before lookup
    const normalisedEmail = email.toLowerCase().trim()

    // Get user
    const user = await getUserByEmail(normalisedEmail)

    if (!user) {
      console.error(`[LexAxiom] Login failed — user not found for email: "${normalisedEmail}"`)
      logAudit({
        userId: 'unknown',
        action: 'login_failed',
        resource: 'auth',
        details: { email: normalisedEmail, reason: 'user_not_found' },
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
        status: 'failure',
        errorMessage: 'User not found',
      })

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      logAudit({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        details: { email: normalisedEmail, reason: 'account_inactive' },
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
        status: 'failure',
        errorMessage: 'Account is inactive',
      })

      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      // BUG 1 FIX: detailed error logging for password mismatch
      console.error(
        `[LexAxiom] Login failed — password mismatch for user "${normalisedEmail}". ` +
        `Stored hash prefix: "${user.passwordHash.substring(0, 10)}..."`
      )
      logAudit({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        details: { email: normalisedEmail, reason: 'invalid_password' },
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
        status: 'failure',
        errorMessage: 'Invalid password',
      })

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return NextResponse.json(
          { error: 'MFA token required', mfaRequired: true },
          { status: 202 }
        )
      }

      // Verify MFA token
      const isValidMFA = validateMFAToken(mfaToken, user.mfaSecret || '')

      if (!isValidMFA) {
        // Check if it's a backup code
        const isValidBackupCode = user.backupCodes && verifyBackupCode(mfaToken, user.backupCodes)

        if (!isValidBackupCode) {
          logAudit({
            userId: user.id,
            action: 'login_failed',
            resource: 'auth',
            details: { email: normalisedEmail, reason: 'invalid_mfa' },
            ipAddress: request.headers.get('x-forwarded-for') || '',
            userAgent: request.headers.get('user-agent') || '',
            status: 'failure',
            errorMessage: 'Invalid MFA token',
          })

          return NextResponse.json(
            { error: 'Invalid MFA token' },
            { status: 401 }
          )
        }

        // Use backup code
        if (isValidBackupCode) {
          const used = await import('@/lib/db-users').then((m) =>
            m.useBackupCode(user.id, mfaToken)
          )
          if (!used) {
            return NextResponse.json(
              { error: 'Invalid backup code' },
              { status: 401 }
            )
          }
        }
      }
    }

    // Update last login
    await updateLastLogin(user.id)

    // Generate tokens
    const { token, refreshToken, expiresAt } = generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    })

    // BUG 1 FIX: Remember Me — 30-day session if requested
    const sessionMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 60 * 60 // 30 days or 1 hour

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionMaxAge,
    })
    cookieStore.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    })
    cookieStore.set('auth-user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionMaxAge,
    })

    logAudit({
      userId: user.id,
      action: 'login_success',
      resource: 'auth',
      details: { email: normalisedEmail, role: user.role, rememberMe: !!rememberMe },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    console.log(`[LexAxiom] Login success for "${normalisedEmail}" (rememberMe: ${!!rememberMe})`)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expiresAt,
    })
  } catch (error) {
    console.error('[LexAxiom] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
