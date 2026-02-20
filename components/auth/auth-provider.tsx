'use client'

import { AuthProvider as ContextProvider } from '@/contexts/auth-context'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <ContextProvider>{children}</ContextProvider>
}
