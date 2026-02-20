export type UserRole = 'super-admin' | 'admin' | 'uploader' | 'viewer'
export type Resource = 'users' | 'documents' | 'settings' | 'audit-logs' | 'verification'
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage'

export interface Permission {
  resource: Resource
  action: Action
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'super-admin': [
    { resource: 'users', action: 'manage' },
    { resource: 'documents', action: 'manage' },
    { resource: 'settings', action: 'manage' },
    { resource: 'audit-logs', action: 'read' },
    { resource: 'verification', action: 'manage' },
  ],
  admin: [
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'documents', action: 'read' },
    { resource: 'documents', action: 'delete' },
    { resource: 'settings', action: 'read' },
    { resource: 'audit-logs', action: 'read' },
    { resource: 'verification', action: 'read' },
  ],
  uploader: [
    { resource: 'documents', action: 'create' },
    { resource: 'documents', action: 'read' },
    { resource: 'documents', action: 'update' },
    { resource: 'verification', action: 'create' },
    { resource: 'verification', action: 'read' },
  ],
  viewer: [
    { resource: 'documents', action: 'read' },
    { resource: 'verification', action: 'read' },
  ],
}

export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.some(
    (p) => p.resource === resource && (p.action === action || p.action === 'manage')
  )
}

export function canAccessDocument(role: UserRole, documentOwnerId: string, currentUserId: string): boolean {
  if (role === 'super-admin' || role === 'admin') {
    return true
  }

  // Uploader can only access their own documents
  if (role === 'uploader') {
    return documentOwnerId === currentUserId
  }

  // Viewers cannot access specific document management
  return false
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    'super-admin': 'Super Administrator',
    admin: 'Administrator',
    uploader: 'Document Uploader',
    viewer: 'Viewer',
  }
  return labels[role]
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    'super-admin': 'Full system access and management capabilities',
    admin: 'User and document management with audit access',
    uploader: 'Can upload and verify documents',
    viewer: 'Read-only access to assigned documents',
  }
  return descriptions[role]
}
