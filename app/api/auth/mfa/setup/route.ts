import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, verifyToken } from '@/lib/auth'
import { getUserById } from '@/lib/db-users'
import { generateTOTPSetup } from '@/lib/mfa'
import { logAudit } from '@/lib/audit-logger'

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const token = await getAuthCookie()

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token
    const user = verifyToken(token)

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

    if (dbUser.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA is already enabled' },
        { status: 400 }
      )
    }

    // Generate TOTP setup
    const mfaSetup = await generateTOTPSetup(dbUser.email)

    logAudit({
      userId: user.id,
      action: 'mfa_setup_initiated',
      resource: 'auth',
      details: { mfaType: 'totp' },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      secret: mfaSetup.secret,
      qrCode: mfaSetup.qrCode,
      backupCodes: mfaSetup.backupCodes,
      message: 'Save backup codes in a secure location',
    })
  } catch (error) {
    console.error('[v0] MFA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
