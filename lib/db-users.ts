import type { UserRole } from './rbac'
import { encryptData, decryptData } from './encryption'

export interface StoredUser {
  id: string
  email: string
  passwordHash: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  mfaEnabled: boolean
  mfaSecret?: string
  backupCodes?: string[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  encryptedEmail?: { ciphertext: string; iv: string; authTag: string }
  encryptedPhone?: { ciphertext: string; iv: string; authTag: string }
}

// In-memory user database (replace with real database in production)
const users: StoredUser[] = []

// Seed default admin user
const defaultAdminUser: StoredUser = {
  id: 'admin-001',
  email: 'admin@lexaxiom.com',
  passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gJXUFm', // 'admin123' hashed
  name: 'System Administrator',
  role: 'super-admin',
  avatar: undefined,
  phone: undefined,
  mfaEnabled: false,
  lastLogin: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isActive: true,
}

// Initialize with default admin
if (users.length === 0) {
  users.push(defaultAdminUser)
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  return users.find((u) => u.id === id) || null
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
}

export async function createUser(userData: Omit<StoredUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoredUser> {
  const newUser: StoredUser = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }

  // Encrypt sensitive data
  if (userData.email) {
    newUser.encryptedEmail = encryptData(userData.email)
  }
  if (userData.phone) {
    newUser.encryptedPhone = encryptData(userData.phone)
  }

  users.push(newUser)
  return newUser
}

export async function updateUser(id: string, updates: Partial<StoredUser>): Promise<StoredUser | null> {
  const index = users.findIndex((u) => u.id === id)

  if (index === -1) {
    return null
  }

  const updatedUser: StoredUser = {
    ...users[index],
    ...updates,
    id: users[index].id, // Keep original ID
    createdAt: users[index].createdAt, // Keep original creation date
    updatedAt: new Date(),
  }

  // Re-encrypt sensitive data if updated
  if (updates.email) {
    updatedUser.encryptedEmail = encryptData(updates.email)
  }
  if (updates.phone) {
    updatedUser.encryptedPhone = encryptData(updates.phone)
  }

  users[index] = updatedUser
  return updatedUser
}

export async function deleteUser(id: string): Promise<boolean> {
  const index = users.findIndex((u) => u.id === id)

  if (index === -1) {
    return false
  }

  users.splice(index, 1)
  return true
}

export async function getAllUsers(): Promise<StoredUser[]> {
  return users.map((u) => ({
    ...u,
    // Don't expose sensitive data in list view
    passwordHash: '',
    mfaSecret: undefined,
    backupCodes: undefined,
  }))
}

export async function getUsersByRole(role: UserRole): Promise<StoredUser[]> {
  return users.filter((u) => u.role === role)
}

export async function updateLastLogin(userId: string): Promise<void> {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.lastLogin = new Date()
    user.updatedAt = new Date()
  }
}

export async function enableMFA(userId: string, secret: string, backupCodes: string[]): Promise<void> {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.mfaEnabled = true
    user.mfaSecret = secret
    user.backupCodes = backupCodes
    user.updatedAt = new Date()
  }
}

export async function disableMFA(userId: string): Promise<void> {
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.mfaEnabled = false
    user.mfaSecret = undefined
    user.backupCodes = undefined
    user.updatedAt = new Date()
  }
}

export async function useBackupCode(userId: string, code: string): Promise<boolean> {
  const user = users.find((u) => u.id === userId)
  if (!user || !user.backupCodes) {
    return false
  }

  const index = user.backupCodes.indexOf(code)
  if (index === -1) {
    return false
  }

  user.backupCodes.splice(index, 1)
  user.updatedAt = new Date()
  return true
}

export async function getDecryptedEmail(user: StoredUser): Promise<string> {
  if (user.encryptedEmail) {
    return decryptData(user.encryptedEmail)
  }
  return user.email
}

export async function getDecryptedPhone(user: StoredUser): Promise<string | undefined> {
  if (user.encryptedPhone) {
    return decryptData(user.encryptedPhone)
  }
  return user.phone
}

export function resetDatabase(): void {
  users.length = 0
  users.push(defaultAdminUser)
}
