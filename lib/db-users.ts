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

// BUG 1 FIX: Use a global singleton instead of a plain module-level array.
// In Next.js dev mode, hot-reload re-evaluates modules and resets plain arrays,
// causing registered users to vanish. The global object persists across re-imports.
declare global {
  // eslint-disable-next-line no-var
  var __lexaxiom_users: StoredUser[] | undefined
}

const defaultAdminUser: StoredUser = {
  id: 'admin-001',
  email: 'admin@lexaxiom.com',
  passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gJXUFm', // 'admin123'
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

if (!global.__lexaxiom_users) {
  global.__lexaxiom_users = [defaultAdminUser]
}

// Expose as a simple reference — always points to the singleton
export const users: StoredUser[] = global.__lexaxiom_users

export async function getUserById(id: string): Promise<StoredUser | null> {
  return users.find((u) => u.id === id) || null
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  // BUG 1 FIX: always compare as lowercase so "User@Email.com" finds "user@email.com"
  const normalised = email.toLowerCase().trim()
  return users.find((u) => u.email === normalised) || null
}

export async function createUser(userData: Omit<StoredUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<StoredUser> {
  const newUser: StoredUser = {
    ...userData,
    // BUG 1 FIX: always store email in lowercase
    email: userData.email.toLowerCase().trim(),
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  }

  // Encrypt sensitive data
  if (userData.email) {
    newUser.encryptedEmail = encryptData(userData.email.toLowerCase().trim())
  }
  if (userData.phone) {
    newUser.encryptedPhone = encryptData(userData.phone)
  }

  users.push(newUser)
  console.log(`[LexAxiom] User created: ${newUser.email} (id: ${newUser.id}). Total users: ${users.length}`)
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
    id: users[index].id,
    createdAt: users[index].createdAt,
    updatedAt: new Date(),
  }

  // Re-encrypt sensitive data if updated
  if (updates.email) {
    updatedUser.email = updates.email.toLowerCase().trim()
    updatedUser.encryptedEmail = encryptData(updatedUser.email)
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
