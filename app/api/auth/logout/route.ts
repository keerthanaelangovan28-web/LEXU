import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth'
import { logAudit } from '@/lib/audit-logger'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('auth-user')

    let userId = 'unknown'
    if (userCookie?.value) {
      try {
        const user = JSON.parse(userCookie.value)
        userId = user.id
      } catch {
        // Ignore parsing errors
      }
    }

    await clearAuthCookies()

    logAudit({
      userId,
      action: 'logout',
      resource: 'auth',
      details: {},
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
