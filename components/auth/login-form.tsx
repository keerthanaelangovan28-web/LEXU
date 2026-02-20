'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)

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
          mfaToken: mfaRequired ? mfaToken : undefined,
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
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">LexAxiom</CardTitle>
          <CardDescription className="text-center">
            {mfaRequired ? 'Enter your authenticator code' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={mfaToken}
                    onChange={setMfaToken}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-slate-600 bg-slate-700 text-white" />
                      <InputOTPSlot index={1} className="border-slate-600 bg-slate-700 text-white" />
                      <InputOTPSlot index={2} className="border-slate-600 bg-slate-700 text-white" />
                      <InputOTPSlot index={3} className="border-slate-600 bg-slate-700 text-white" />
                      <InputOTPSlot index={4} className="border-slate-600 bg-slate-700 text-white" />
                      <InputOTPSlot index={5} className="border-slate-600 bg-slate-700 text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Or use a backup code (8 characters)
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {isLoading ? 'Signing in...' : mfaRequired ? 'Verify Code' : 'Sign In'}
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
