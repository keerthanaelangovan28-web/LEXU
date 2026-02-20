'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/auth/profile-form'
import { PasswordForm } from '@/components/auth/password-form'
import { MFASetup } from '@/components/auth/mfa-setup'
import { Settings, Lock, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  mfaEnabled: boolean
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile')
      const data = await response.json()
      if (data.success) {
        setProfile(data.user)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-slate-400">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-black tracking-tight" style={{ color: '#F0F9FF' }}>Account Settings</h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage your account preferences and security protocols</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="p-1 rounded-xl" style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.2)' }}>
            <TabsTrigger value="profile" className="px-6 py-2 rounded-lg transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-neon">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="px-6 py-2 rounded-lg transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-neon">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <PasswordForm />

            <Card className="neon-border" style={{ background: '#0F172A' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-black" style={{ color: '#F0F9FF' }}>
                  <Shield className="h-6 w-6 neon-glow" style={{ color: '#00B4FF' }} />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription style={{ color: '#A0AEC0' }}>
                  {profile?.mfaEnabled
                    ? 'Your account is protected with enterprise-grade MFA'
                    : 'Add an extra layer of neural security to your account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MFASetup onComplete={fetchProfile} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
