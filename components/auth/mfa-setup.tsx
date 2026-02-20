'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Copy, CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface MFASetupProps {
  onComplete?: () => void
}

export function MFASetup({ onComplete }: MFASetupProps) {
  const [step, setStep] = useState<'init' | 'setup' | 'verify' | 'complete'>('init')
  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [token, setToken] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const initSetup = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to initialize MFA setup')
        return
      }

      setQrCode(data.qrCode)
      setSecret(data.secret)
      setBackupCodes(data.backupCodes)
      setStep('setup')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyToken = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          secret,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid verification code')
        return
      }

      setStep('complete')
      onComplete?.()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (step === 'init') {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-500" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={initSetup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 'setup') {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code" className="h-48 w-48" />
            </div>
          )}

          <div className="rounded-lg bg-slate-700 p-4">
            <p className="text-sm text-slate-300 mb-2">Or enter this code manually:</p>
            <code className="text-sm font-mono text-cyan-400 break-all">{secret}</code>
          </div>

          <div>
            <Label className="text-slate-200 mb-2 block">Backup Codes</Label>
            <p className="text-xs text-slate-400 mb-3">
              Save these codes in a secure location. You can use them to regain access if you lose your authenticator device.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-between rounded bg-slate-700 px-3 py-2 cursor-pointer hover:bg-slate-600"
                  onClick={() => copyToClipboard(code)}
                >
                  <code className="text-xs font-mono text-cyan-400">{code}</code>
                  <Copy className={`h-4 w-4 ${copiedCode === code ? 'text-green-500' : 'text-slate-400'}`} />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setStep('verify')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            Continue to Verification
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 'verify') {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle>Verify Code</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={token}
              onChange={setToken}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
                <InputOTPSlot index={1} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
                <InputOTPSlot index={2} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
                <InputOTPSlot index={3} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
                <InputOTPSlot index={4} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
                <InputOTPSlot index={5} className="border-slate-600 bg-slate-700 text-white h-10 w-10" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={verifyToken}
            disabled={isLoading || token.length !== 6}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            {isLoading ? 'Verifying...' : 'Verify and Enable'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardContent className="pt-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Two-Factor Authentication Enabled!</h2>
          <p className="text-slate-400">
            Your account is now protected with two-factor authentication.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
