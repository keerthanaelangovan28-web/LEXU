import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { getUserByEmail, createUser } from '@/lib/db-users'
import { logAudit } from '@/lib/audit-logger'

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      logAudit({
        userId: 'unknown',
        action: 'register_failed',
        resource: 'auth',
        details: { email, reason: 'email_already_exists' },
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
        status: 'failure',
        errorMessage: 'Email already registered',
      })

      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user (default role: viewer)
    const newUser = await createUser({
      email,
      passwordHash,
      name,
      role: 'viewer',
      mfaEnabled: false,
      isActive: true,
    })

    logAudit({
      userId: newUser.id,
      action: 'register_success',
      resource: 'auth',
      details: { email, name },
      ipAddress: request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      status: 'success',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please log in.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
