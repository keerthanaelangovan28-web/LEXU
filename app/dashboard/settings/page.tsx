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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
          <p className="text-slate-400 text-sm">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileForm />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <PasswordForm />

            <Card className="border-slate-700 bg-slate-800/50 glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  {profile?.mfaEnabled
                    ? 'Your account is protected with two-factor authentication'
                    : 'Add an extra layer of security to your account'}
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
