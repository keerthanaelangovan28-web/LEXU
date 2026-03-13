'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { AlertCircle, Shield, Smartphone } from 'lucide-react'

interface MFALoginPromptProps {
  /** The userId returned by the login API when mfaRequired = true */
  userId?: string
  /** The partially-verified credentials to pass back to the final login */
  onSuccess?: () => void
  onCancel?: () => void
}

export function MFALoginPrompt({ userId, onSuccess, onCancel }: MFALoginPromptProps) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBackupMode, setIsBackupMode] = useState(false)
  const [backupCode, setBackupCode] = useState('')

  const verifyCode = async () => {
    setError('')
    setIsLoading(true)

    const payload = isBackupMode
      ? { mfaToken: backupCode.toUpperCase().trim(), isBackupCode: true }
      : { mfaToken: token }

    try {
      const response = await fetch('/api/auth/login/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid authentication code')
        setToken('')
        return
      }

      onSuccess?.()
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#030712' }}>
      <Card
        className="w-full max-w-sm shadow-2xl neon-border"
        style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.3)' }}
      >
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl neon-glow"
              style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}
            >
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-black tracking-tighter" style={{ color: '#00B4FF' }}>
            Two-Factor Auth
          </CardTitle>
          <CardDescription className="text-center" style={{ color: '#A0AEC0' }}>
            {isBackupMode
              ? 'Enter one of your backup codes'
              : 'Enter the 6-digit code from your authenticator app'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {error && (
            <Alert className="border-red-500/50 bg-red-950/30 py-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {!isBackupMode ? (
            <>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={token} onChange={setToken}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-12 text-lg border-slate-600 bg-slate-800 text-white"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={verifyCode}
                disabled={isLoading || token.length !== 6}
                className="w-full font-bold"
                style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Verifying…
                  </span>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={backupCode}
                onChange={e => setBackupCode(e.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3D4"
                maxLength={8}
                className="w-full rounded-lg border px-4 py-3 text-center font-mono text-sm tracking-widest"
                style={{
                  background: '#0F172A',
                  borderColor: 'rgba(0,180,255,0.3)',
                  color: '#38BDF8',
                }}
              />
              <Button
                onClick={verifyCode}
                disabled={isLoading || backupCode.length < 6}
                className="w-full font-bold"
                style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}
              >
                {isLoading ? 'Verifying…' : 'Use Backup Code'}
              </Button>
            </>
          )}

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => { setIsBackupMode(v => !v); setToken(''); setBackupCode(''); setError('') }}
              className="hover:underline transition-colors"
              style={{ color: '#64748B' }}
            >
              {isBackupMode ? '← Use authenticator app' : 'Use backup code instead'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="hover:underline"
                style={{ color: '#64748B' }}
              >
                Cancel
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
