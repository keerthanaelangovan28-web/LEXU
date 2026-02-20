import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookie, verifyToken } from '@/lib/auth'
import { hasPermission } from '@/lib/rbac'
import { getAuditLogs, getAuditStatistics } from '@/lib/audit-logger'

export async function GET(request: NextRequest) {
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

    // Check permission
    if (!hasPermission(user.role, 'audit-logs', 'read')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get query parameters
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId') || undefined
    const action = url.searchParams.get('action') || undefined
    const resource = url.searchParams.get('resource') || undefined
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Get audit logs
    const logs = getAuditLogs({
      userId,
      action,
      resource,
      limit,
      offset,
    })

    // Get statistics
    const stats = getAuditStatistics({
      userId,
      action,
      resource,
    })

    return NextResponse.json({
      success: true,
      logs,
      statistics: stats,
      pagination: {
        limit,
        offset,
        total: stats.total,
      },
    })
  } catch (error) {
    console.error('[v0] Audit logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
