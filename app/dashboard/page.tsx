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
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="rounded-2xl p-8 neon-glow border-neon" style={{ background: 'linear-gradient(135deg, #0F172A, #060B18)', border: '1px solid rgba(0, 180, 255, 0.3)' }}>
          <h2 className="text-4xl font-black mb-2 text-neon" style={{ color: '#00B4FF' }}>Welcome Back!</h2>
          <p className="text-lg" style={{ color: '#A0AEC0' }}>
            You're using LexAxiom's advanced 5-layer legal document verification system. All documents are encrypted and verified using neuro-symbolic reasoning, constitutional AI, multi-agent debate, zero-knowledge proofs, and conformal prediction.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:scale-105 transition-transform duration-300" style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.2)' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase tracking-widest" style={{ color: '#64748B' }}>{stat.title}</CardTitle>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl neon-glow" style={{ background: 'rgba(0, 180, 255, 0.1)' }}>
                    <stat.icon className="h-5 w-5" style={{ color: '#00B4FF' }} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-neon" style={{ color: '#F0F9FF' }}>{stat.value}</div>
                <p className="text-xs mt-1 font-medium" style={{ color: '#64748B' }}>{stat.description}</p>
                <p className="text-xs mt-3 flex items-center gap-1 font-bold" style={{ color: '#00FF99' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-success neon-glow" />
                  {stat.trend}
                </p>
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
          <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-neon" style={{ color: '#00B4FF' }}>Security System Status</h3>
          <SecurityAlerts />
        </div>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="neon-border overflow-hidden" style={{ background: '#0F172A' }}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl neon-glow" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}>
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black" style={{ color: '#F0F9FF' }}>Verify a Document</CardTitle>
                  <CardDescription style={{ color: '#A0AEC0' }}>Initiate neural verification sequence</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#A0AEC0' }}>
                Upload a legal document and get instant verification using our advanced 5-layer AI system.
              </p>
              <Button className="w-full h-12 font-black text-lg neon-glow transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}>
                START VERIFICATION
              </Button>
            </CardContent>
          </Card>

          <Card className="neon-border overflow-hidden" style={{ background: '#0F172A' }}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl neon-glow" style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)' }}>
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black" style={{ color: '#F0F9FF' }}>System History</CardTitle>
                  <CardDescription style={{ color: '#A0AEC0' }}>Access encrypted verification logs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#A0AEC0' }}>
                Access all your previously verified documents and their detailed verification reports.
              </p>
              <Button variant="outline" className="w-full h-12 font-bold text-lg border-2 hover:bg-white/5" style={{ borderColor: 'rgba(0, 180, 255, 0.3)', color: '#00B4FF' }}>
                VIEW HISTORY
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <Card style={{ background: '#0F172A', border: '1px solid rgba(0, 180, 255, 0.2)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-neon" style={{ color: '#00B4FF' }}>
              <Lock className="h-6 w-6" />
              Cyber Security Protocol
            </CardTitle>
            <CardDescription style={{ color: '#A0AEC0' }}>Encrypted by LexAxiom Neural Network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'TLS 1.3 Encryption', desc: 'Secure data stream', color: '#00FF99' },
                { label: 'AES-256-GCM', desc: 'Military-grade storage', color: '#00B4FF' },
                { label: 'Neural MFA', desc: 'Biometric token auth', color: '#A855F7' },
                { label: 'RBAC v2.0', desc: 'Granular access matrix', color: '#FFD700' },
                { label: 'Quantum Audit', desc: 'Immutable log chain', color: '#FF4D4D' },
                { label: 'Zero-Knowledge', desc: 'Privacy-aware verification', color: '#3399FF' },
              ].map((feature) => (
                <div key={feature.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 neon-glow" style={{ background: `${feature.color}20` }}>
                    <span style={{ color: feature.color, fontWeight: 'bold' }}>✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#F0F9FF' }}>{feature.label}</p>
                    <p className="text-xs font-medium" style={{ color: '#64748B' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
