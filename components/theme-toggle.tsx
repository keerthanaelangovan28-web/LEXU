'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors"
      style={{
        borderColor: 'rgba(0, 180, 255, 0.3)',
        backgroundColor: theme === 'dark' ? 'rgba(0, 180, 255, 0.05)' : 'rgba(0, 180, 255, 0.05)',
        color: theme === 'dark' ? '#00B4FF' : '#0F172A',
      }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
