'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const verificationData = [
  { date: 'Jan 1', verifications: 42, successful: 41 },
  { date: 'Jan 2', verifications: 58, successful: 57 },
  { date: 'Jan 3', verifications: 73, successful: 72 },
  { date: 'Jan 4', verifications: 65, successful: 64 },
  { date: 'Jan 5', verifications: 89, successful: 88 },
  { date: 'Jan 6', verifications: 92, successful: 91 },
  { date: 'Jan 7', verifications: 104, successful: 103 },
]

const documentTypeData = [
  { name: 'NDAs', value: 320, fill: '#06b6d4' },
  { name: 'Contracts', value: 280, fill: '#0ea5e9' },
  { name: 'Agreements', value: 198, fill: '#3b82f6' },
  { name: 'Other', value: 102, fill: '#6366f1' },
]

export function Statistics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Verification Trend */}
      <Card className="lg:col-span-2 border-slate-700 bg-slate-800/50 glass-effect">
        <CardHeader>
          <CardTitle>Verification Trend</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="verifications"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="successful"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Document Types Distribution */}
      <Card className="border-slate-700 bg-slate-800/50 glass-effect">
        <CardHeader>
          <CardTitle>Document Types</CardTitle>
          <CardDescription>Distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {documentTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
