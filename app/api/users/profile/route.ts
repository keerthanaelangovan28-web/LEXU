import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, verifyToken, hashPassword } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/db-users'
import { logAudit } from '@/lib/audit-logger'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthCookie()

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatar: dbUser.avatar,
        mfaEnabled: dbUser.mfaEnabled,
        createdAt: dbUser.createdAt,
        lastLogin: dbUser.lastLogin,
      },
    })
  } catch (error) {
    console.error('[v0] Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthCookie()

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { name, avatar, password } = await request.json()

    const updates: any = {}

    if (name) {
      updates.name = name
    }

    if (avatar) {
      updates.avatar = avatar
    }

    if (password) {
      updates.passwordHash = await hashPassword(password)
    }

    const updatedUser = await updateUser(user.id, updates)

    logAudit({
      userId: user.id,
      action: 'profile_updated',
      resource: 'users',
      details: Object.keys(updates),
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        avatar: updatedUser?.avatar,
      },
    })
  } catch (error) {
    console.error('[v0] Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
