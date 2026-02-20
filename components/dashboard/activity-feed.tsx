'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileCheck,
  LogIn,
  Shield,
  Settings,
  Trash2,
  Plus,
  Clock,
} from 'lucide-react'

interface Activity {
  id: string
  type: 'verification' | 'login' | 'mfa' | 'settings' | 'delete' | 'create'
  title: string
  description: string
  timestamp: Date
  icon: React.ComponentType<{ className?: string }>
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'verification',
    title: 'Document Verified',
    description: 'NDA_2024.pdf verified successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    icon: FileCheck,
  },
  {
    id: '2',
    type: 'login',
    title: 'Sign In',
    description: 'Logged in from 192.168.1.100',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: LogIn,
  },
  {
    id: '3',
    type: 'mfa',
    title: 'MFA Enabled',
    description: 'Two-factor authentication activated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    icon: Shield,
  },
  {
    id: '4',
    type: 'create',
    title: 'User Created',
    description: 'New user account created: john.doe@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: Plus,
  },
  {
    id: '5',
    type: 'settings',
    title: 'Settings Updated',
    description: 'Profile information updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    icon: Settings,
  },
]

function getActivityColor(type: string) {
  const colors: Record<string, string> = {
    verification: 'bg-green-500/20 text-green-400',
    login: 'bg-blue-500/20 text-blue-400',
    mfa: 'bg-purple-500/20 text-purple-400',
    settings: 'bg-yellow-500/20 text-yellow-400',
    delete: 'bg-red-500/20 text-red-400',
    create: 'bg-cyan-500/20 text-cyan-400',
  }
  return colors[type] || 'bg-slate-500/20 text-slate-400'
}

function formatTime(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}

export function ActivityFeed() {
  return (
    <Card className="border-slate-700 bg-slate-800/50 glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest actions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-start gap-4 pb-4 ${
                index !== activities.length - 1 ? 'border-b border-slate-700' : ''
              }`}
            >
              <div
                className={`mt-1 flex h-10 w-10 items-center justify-center rounded-lg ${getActivityColor(
                  activity.type
                )}`}
              >
                <activity.icon className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-white">{activity.title}</p>
                <p className="text-sm text-slate-400">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTime(activity.timestamp)}
                </p>
              </div>

              <Badge className={getActivityColor(activity.type)}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
