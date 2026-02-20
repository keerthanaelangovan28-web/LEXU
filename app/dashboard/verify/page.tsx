import { DashboardLayout } from '@/components/dashboard/layout'
import { LexcryptumDashboard } from '@/components/lexcryptum/dashboard'

export default function VerifyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Verification</h2>
          <p className="text-slate-400 text-sm">Upload a legal document for advanced AI-powered verification</p>
        </div>
        <LexcryptumDashboard />
      </div>
    </DashboardLayout>
  )
}
