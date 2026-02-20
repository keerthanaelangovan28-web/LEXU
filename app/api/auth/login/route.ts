import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateTokens, setAuthCookies } from '@/lib/auth'
import { getUserByEmail, updateLastLogin } from '@/lib/db-users'
import { logAudit } from '@/lib/audit-logger'
import { verifyTOTPToken, verifyBackupCode, validateMFAToken } from '@/lib/mfa'

export async function POST(request: NextRequest) {
  try {
    const { email, password, mfaToken } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await getUserByEmail(email)

    if (!user) {
      logAudit({
        userId: 'unknown',
        action: 'login_failed',
        resource: 'auth',
        details: { email, reason: 'user_not_found' },
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
        details: { email, reason: 'account_inactive' },
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
      logAudit({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        details: { email, reason: 'invalid_password' },
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
            details: { email, reason: 'invalid_mfa' },
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

    // Set cookies
    await setAuthCookies({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
      refreshToken,
      expiresAt,
    })

    logAudit({
      userId: user.id,
      action: 'login_success',
      resource: 'auth',
      details: { email, role: user.role },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

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
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
