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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white">Registration Successful!</h2>
              <p className="text-slate-400">
                Your account has been created. Redirecting to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join LexAxiom and secure your documents
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

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                required
              />
              <p className="text-xs text-slate-400">
                At least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <a href="/auth/login" className="text-cyan-500 hover:text-cyan-400">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
