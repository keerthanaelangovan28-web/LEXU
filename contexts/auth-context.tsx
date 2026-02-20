'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'superadmin'
  mfaEnabled: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  setupMFA: () => Promise<{ secret: string; qrCode: string }>
  verifyMFA: (code: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('auth-token='))
          ?.split('=')[1]

        if (token) {
          // Verify token is valid
          const response = await fetch('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            // Token is invalid, clear it
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
          }
        }
      } catch (error) {
        console.error('[v0] Auth initialization failed:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('[v0] Login error:', error)
      throw error
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('[v0] Register error:', error)
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('[v0] Logout error:', error)
      throw error
    }
  }, [])

  const setupMFA = useCallback(async () => {
    const response = await fetch('/api/auth/mfa/setup', { method: 'POST' })
    return response.json()
  }, [])

  const verifyMFA = useCallback(async (code: string) => {
    const response = await fetch('/api/auth/mfa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      }
      return true
    }
    return false
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setupMFA,
        verifyMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
