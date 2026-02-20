'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info, Lock } from 'lucide-react'

export function SecurityAlerts() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Status</h3>
      </div>

      <Alert className="bg-green-900/20 border-green-700">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-400">SSL/TLS Enabled</AlertTitle>
        <AlertDescription className="text-green-300">
          Your connection is encrypted and secure with TLS 1.3
        </AlertDescription>
      </Alert>

      <Alert className="bg-blue-900/20 border-blue-700">
        <Lock className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-400">End-to-End Encryption</AlertTitle>
        <AlertDescription className="text-blue-300">
          All documents are encrypted with AES-256 encryption
        </AlertDescription>
      </Alert>

      <Alert className="bg-cyan-900/20 border-cyan-700">
        <Info className="h-4 w-4 text-cyan-500" />
        <AlertTitle className="text-cyan-400">Audit Logging Active</AlertTitle>
        <AlertDescription className="text-cyan-300">
          All actions are logged for compliance and security monitoring
        </AlertDescription>
      </Alert>

      <Alert className="bg-yellow-900/20 border-yellow-700">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-400">Enable Two-Factor Authentication</AlertTitle>
        <AlertDescription className="text-yellow-300">
          Protect your account with 2FA. Go to Settings {'>'} Security to enable it now.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      action: 'Document Verified',
      resource: 'contract_2024_01.pdf',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'User Added',
      resource: 'john.doe@example.com',
      timestamp: '5 hours ago',
      status: 'success',
    },
    {
      id: 3,
      action: 'Settings Changed',
      resource: 'MFA Configuration',
      timestamp: '1 day ago',
      status: 'info',
    },
    {
      id: 4,
      action: 'Document Uploaded',
      resource: 'legal_agreement.docx',
      timestamp: '2 days ago',
      status: 'success',
    },
  ]

  return (
    <Card className="border-slate-700 bg-slate-800/50 glass-effect">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{activity.action}</p>
              <p className="text-xs text-slate-400">{activity.resource}</p>
            </div>
            <p className="text-xs text-slate-500">{activity.timestamp}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
