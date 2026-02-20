'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth-token='))

    if (authToken) {
      router.push('/dashboard')
    } else {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-slate-400">Redirecting...</div>
    </div>
  )
}
