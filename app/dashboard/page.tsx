import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Statistics } from '@/components/dashboard/statistics'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { SecurityAlerts, RecentActivity } from '@/components/dashboard/alerts'
import { Shield, FileText, Users, Lock, TrendingUp, Clock } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Verifications',
      value: '1,234',
      description: 'Total verified documents',
      icon: FileText,
      trend: '+12% from last month',
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      description: 'Average verification success',
      icon: TrendingUp,
      trend: '+0.2% improvement',
    },
    {
      title: 'Average Time',
      value: '2.3s',
      description: 'Average verification time',
      icon: Clock,
      trend: '-0.5s faster',
    },
    {
      title: 'Security Score',
      value: '100/100',
      description: 'Account security rating',
      icon: Lock,
      trend: 'All systems secure',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="glass-effect rounded-xl border border-slate-700 p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-slate-300">
            You're using LexAxiom's advanced 5-layer legal document verification system. All documents are encrypted and verified using neuro-symbolic reasoning, constitutional AI, multi-agent debate, zero-knowledge proofs, and conformal prediction.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-slate-700 bg-slate-800/50 glass-effect">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
                    <stat.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
                <p className="text-xs text-cyan-400 mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <Statistics />

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Security Alerts */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Security Status</h3>
          <SecurityAlerts />
        </div>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 glass-effect overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Verify a Document</CardTitle>
                  <CardDescription>Start a new verification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Upload a legal document and get instant verification using our advanced AI system.
              </p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                Start Verification
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50 glass-effect overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>My Documents</CardTitle>
                  <CardDescription>View verification history</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Access all your previously verified documents and their detailed verification reports.
              </p>
              <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                View Documents
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <Card className="border-slate-700 bg-slate-800/50 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-cyan-400" />
              Security Features
            </CardTitle>
            <CardDescription>Your data is protected by enterprise-grade security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">TLS 1.3 Encryption</p>
                  <p className="text-xs text-slate-400">All data in transit is encrypted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">AES-256 Encryption</p>
                  <p className="text-xs text-slate-400">Data at rest is encrypted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">Two-Factor Auth</p>
                  <p className="text-xs text-slate-400">Optional MFA for extra security</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">Role-Based Access</p>
                  <p className="text-xs text-slate-400">Granular permission control</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">Audit Logging</p>
                  <p className="text-xs text-slate-400">Complete activity tracking</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <p className="font-medium text-white">HTTPS Enforced</p>
                  <p className="text-xs text-slate-400">Secure communication only</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
