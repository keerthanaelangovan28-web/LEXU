import { NextRequest, NextResponse } from 'next/server'
import * as bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { users } from '@/lib/db-users'
import { logAudit } from '@/lib/audit-logger'

export async function PUT(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: string
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.passwordHash)
    if (!isPasswordValid) {
      await logAudit({
        userId: decoded.userId,
        action: 'PASSWORD_CHANGE_FAILED',
        resource: 'user_password',
        details: 'Invalid current password',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      })

      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    // Update user password
    const userIndex = users.findIndex((u) => u.id === decoded.userId)
    if (userIndex !== -1) {
      users[userIndex].passwordHash = hashedPassword
    }

    await logAudit({
      userId: decoded.userId,
      action: 'PASSWORD_CHANGED',
      resource: 'user_password',
      details: 'Password changed successfully',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    })

    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 })
  } catch (error) {
    console.error('[v0] Password change error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
