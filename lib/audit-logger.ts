export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  status: 'success' | 'failure'
  errorMessage?: string
  timestamp: Date
  integrityHash?: string
  previousHash?: string
}

function generateAuditHash(data: string, previousHash?: string): string {
  const combined = previousHash ? `${previousHash}:${data}` : data
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return "0x" + Math.abs(hash).toString(16).padStart(64, '0')
}

export interface AuditLogFilter {
  userId?: string
  action?: string
  resource?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

// In-memory audit log storage (replace with database in production)
const auditLogs: AuditLog[] = []

export function logAudit(params: Omit<AuditLog, 'id' | 'timestamp' | 'integrityHash' | 'previousHash'>): AuditLog {
  const previousLog = auditLogs.length > 0 ? auditLogs[auditLogs.length - 1] : null
  const previousHash = previousLog?.integrityHash || "0x0000000000000000000000000000000000000000000000000000000000000000"

  const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date()

  const dataToHash = JSON.stringify({
    id,
    action: params.action,
    userId: params.userId,
    timestamp: timestamp.toISOString()
  })

  const log: AuditLog = {
    ...params,
    id,
    timestamp,
    previousHash,
    integrityHash: generateAuditHash(dataToHash, previousHash)
  }

  auditLogs.push(log)

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT-SECURE]', {
      action: log.action,
      resource: log.resource,
      userId: log.userId,
      status: log.status,
      timestamp: log.timestamp.toISOString(),
      hash: log.integrityHash?.slice(0, 10) + '...'
    })
  }

  return log
}

export function getAuditLogs(filters?: AuditLogFilter): AuditLog[] {
  let results = [...auditLogs]

  if (filters?.userId) {
    results = results.filter((log) => log.userId === filters.userId)
  }

  if (filters?.action) {
    results = results.filter((log) => log.action === filters.action)
  }

  if (filters?.resource) {
    results = results.filter((log) => log.resource === filters.resource)
  }

  if (filters?.startDate) {
    results = results.filter((log) => log.timestamp >= filters.startDate!)
  }

  if (filters?.endDate) {
    results = results.filter((log) => log.timestamp <= filters.endDate!)
  }

  // Sort by timestamp descending
  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  // Apply pagination
  if (filters?.offset) {
    results = results.slice(filters.offset)
  }

  if (filters?.limit) {
    results = results.slice(0, filters.limit)
  }

  return results
}

export function getAuditStatistics(filters?: AuditLogFilter): {
  total: number
  byStatus: Record<string, number>
  byAction: Record<string, number>
  byResource: Record<string, number>
} {
  let logs = [...auditLogs]

  if (filters?.userId) {
    logs = logs.filter((log) => log.userId === filters.userId)
  }

  if (filters?.startDate) {
    logs = logs.filter((log) => log.timestamp >= filters.startDate!)
  }

  if (filters?.endDate) {
    logs = logs.filter((log) => log.timestamp <= filters.endDate!)
  }

  const stats = {
    total: logs.length,
    byStatus: {} as Record<string, number>,
    byAction: {} as Record<string, number>,
    byResource: {} as Record<string, number>,
  }

  logs.forEach((log) => {
    stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1
    stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1
    stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1
  })

  return stats
}

export function clearOldLogs(daysOld: number = 90): number {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const initialLength = auditLogs.length
  const filtered = auditLogs.filter((log) => log.timestamp > cutoffDate)

  // Update the array in place
  auditLogs.length = 0
  auditLogs.push(...filtered)

  return initialLength - auditLogs.length
}
