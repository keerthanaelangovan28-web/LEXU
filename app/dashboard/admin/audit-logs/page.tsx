'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Activity, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  status: 'success' | 'failure'
  timestamp: string
  details: Record<string, any>
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs')
      const data = await response.json()
      if (data.success) {
        setLogs(data.logs)
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('login')) return 'bg-blue-500/20 text-blue-400'
    if (action.includes('created')) return 'bg-green-500/20 text-green-400'
    if (action.includes('deleted')) return 'bg-red-500/20 text-red-400'
    if (action.includes('updated')) return 'bg-yellow-500/20 text-yellow-400'
    return 'bg-slate-500/20 text-slate-400'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
            <p className="text-slate-400 text-sm">Monitor all system activities and changes</p>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              System Activity Log
            </CardTitle>
            <CardDescription>Recent actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-400">Loading logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-400">No activity logs yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Action</TableHead>
                      <TableHead className="text-slate-300">Resource</TableHead>
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell>
                          <Badge className={getActionBadgeColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{log.resource}</TableCell>
                        <TableCell className="text-slate-300 font-mono text-xs">
                          {log.userId.substring(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.status === 'success'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {formatDate(log.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
