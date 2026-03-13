'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { MFALoginPrompt } from '@/components/auth/mfa-login-prompt'
import { Lock, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)

  // Standard password change — allow any characters
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      })

      const data = await response.json()

      if (response.status === 202) {
        setMfaRequired(true)
        return
      }

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#030712' }}>
      <Card className="w-full max-w-md shadow-2xl neon-border" style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.3)' }}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl neon-glow" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}>
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-black tracking-tighter text-neon" style={{ color: '#00B4FF' }}>LEX AXIOM</CardTitle>
          <CardDescription className="text-center">
            {mfaRequired ? 'Enter your authenticator code' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/50 bg-red-950/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {!mfaRequired ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lexaxiom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    required
                  />
                </div>

                {/* Password field — proper 8+ char password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    required
                    minLength={8}
                  />
                </div>

                {/* BUG 1 FIX: Remember Me checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-slate-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-300 cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
              </>
            ) : (
              <MFALoginPrompt onCancel={() => setMfaRequired(false)} />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <a href="/auth/register" className="text-cyan-500 hover:text-cyan-400">
                Register here
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


