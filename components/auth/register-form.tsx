'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#030712' }}>
        <Card className="w-full max-w-lg shadow-2xl neon-border" style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.3)' }}>
          <CardContent className="pt-8">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl neon-glow" style={{ background: 'rgba(0, 255, 153, 0.1)', border: '1px solid rgba(0, 255, 153, 0.3)' }}>
                  <CheckCircle className="h-10 w-10 text-success" style={{ color: '#00FF99' }} />
                </div>
              </div>
              <h2 className="text-3xl font-black text-neon" style={{ color: '#00B4FF' }}>Success!</h2>
              <p style={{ color: '#A0AEC0' }}>
                Your neural profile has been created. Syncing with LexAxiom...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: '#030712' }}>
      <Card className="w-full max-w-lg shadow-2xl neon-border" style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.3)' }}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl neon-glow" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}>
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-black tracking-tighter text-neon" style={{ color: '#00B4FF' }}>Join LexAxiom</CardTitle>
          <CardDescription className="text-center" style={{ color: '#A0AEC0' }}>
            Initialize your cryptographic verification profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" style={{ color: '#FF4D4D' }} />
                <AlertDescription style={{ color: '#FF4D4D' }}>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: '#F0F9FF', fontWeight: 600 }}>Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="h-12 border-slate-700 bg-black/20 text-white placeholder:text-slate-500 focus:border-neon focus:ring-neon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#F0F9FF', fontWeight: 600 }}>Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@lexaxiom.ai"
                value={formData.email}
                onChange={handleChange}
                className="h-12 border-slate-700 bg-black/20 text-white placeholder:text-slate-500 focus:border-neon focus:ring-neon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#F0F9FF', fontWeight: 600 }}>Neural Passkey</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="h-12 border-slate-700 bg-black/20 text-white placeholder:text-slate-500 focus:border-neon focus:ring-neon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: '#F0F9FF', fontWeight: 600 }}>Verify Passkey</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-12 border-slate-700 bg-black/20 text-white placeholder:text-slate-500 focus:border-neon focus:ring-neon"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 font-black text-lg neon-glow transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}
            >
              {isLoading ? 'INITIALIZING...' : 'CREATE ACCOUNT'}
            </Button>

            <p className="text-center text-sm" style={{ color: '#64748B' }}>
              Already registered?{' '}
              <a href="/auth/login" className="font-bold hover:underline" style={{ color: '#00B4FF' }}>
                ACCESS PORTAL
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
