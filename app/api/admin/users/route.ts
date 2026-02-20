import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, verifyToken, hashPassword } from '@/lib/auth'
import { getAllUsers, getUserById, updateUser, createUser, deleteUser } from '@/lib/db-users'
import { hasPermission } from '@/lib/rbac'
import { logAudit } from '@/lib/audit-logger'
import type { UserRole } from '@/lib/rbac'

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

    if (!hasPermission(user.role, 'users', 'read')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const users = await getAllUsers()

    logAudit({
      userId: user.id,
      action: 'users_list_accessed',
      resource: 'users',
      details: { count: users.length },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        mfaEnabled: u.mfaEnabled,
        isActive: u.isActive,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
      })),
    })
  } catch (error) {
    console.error('[v0] Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    if (!hasPermission(user.role, 'users', 'create')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { email, password, name, role } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newUser = await createUser({
      email,
      passwordHash,
      name,
      role: role as UserRole,
      mfaEnabled: false,
      isActive: true,
    })

    logAudit({
      userId: user.id,
      action: 'user_created',
      resource: 'users',
      resourceId: newUser.id,
      details: { email, name, role },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error('[v0] Create user error:', error)
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

    if (!hasPermission(user.role, 'users', 'update')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { userId, ...updates } = await request.json()

    const updatedUser = await updateUser(userId, updates)

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    logAudit({
      userId: user.id,
      action: 'user_updated',
      resource: 'users',
      resourceId: userId,
      details: Object.keys(updates),
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    })
  } catch (error) {
    console.error('[v0] Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    if (!hasPermission(user.role, 'users', 'delete')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { userId } = await request.json()

    const success = await deleteUser(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    logAudit({
      userId: user.id,
      action: 'user_deleted',
      resource: 'users',
      resourceId: userId,
      details: {},
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('[v0] Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
