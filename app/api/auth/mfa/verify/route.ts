import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, verifyToken } from '@/lib/auth'
import { getUserById, enableMFA } from '@/lib/db-users'
import { validateMFAToken, generateBackupCodes } from '@/lib/mfa'
import { logAudit } from '@/lib/audit-logger'

export async function POST(request: NextRequest) {
  try {
    const { token, secret } = await request.json()

    if (!token || !secret) {
      return NextResponse.json(
        { error: 'Token and secret are required' },
        { status: 400 }
      )
    }

    // Get auth token
    const authToken = await getAuthCookie()

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const user = verifyToken(authToken)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user
    const dbUser = await getUserById(user.id)

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify MFA token
    const isValid = validateMFAToken(token, secret)

    if (!isValid) {
      logAudit({
        userId: user.id,
        action: 'mfa_verify_failed',
        resource: 'auth',
        details: { reason: 'invalid_token' },
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

    // Generate backup codes
    const backupCodes = generateBackupCodes()

    // Enable MFA
    await enableMFA(user.id, secret, backupCodes)

    logAudit({
      userId: user.id,
      action: 'mfa_enabled',
      resource: 'auth',
      details: { mfaType: 'totp' },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      message: 'MFA enabled successfully',
      backupCodes,
    })
  } catch (error) {
    console.error('[v0] MFA verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
