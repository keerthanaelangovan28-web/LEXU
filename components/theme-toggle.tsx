'use client'

import { useTheme } from 'next-themes'
<<<<<<< HEAD
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
=======
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
>>>>>>> ff82bed (feat: implement ZK proof verification, fully functional MFA, fix dev environment and rename UI elements to LEX AXIOM)

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

<<<<<<< HEAD
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
=======
  // Avoid hydration mismatch — only render after mount
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-10 w-10" />

  const isDark = theme === 'dark' || theme === 'system'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-10 w-10 rounded-full transition-colors duration-200"
      style={{
        color: isDark ? '#00B4FF' : '#0369a1',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = isDark
          ? '#1E293B'
          : '#F1F5F9'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {isDark ? (
>>>>>>> ff82bed (feat: implement ZK proof verification, fully functional MFA, fix dev environment and rename UI elements to LEX AXIOM)
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
<<<<<<< HEAD
    </button>
=======
    </Button>
>>>>>>> ff82bed (feat: implement ZK proof verification, fully functional MFA, fix dev environment and rename UI elements to LEX AXIOM)
  )
}
