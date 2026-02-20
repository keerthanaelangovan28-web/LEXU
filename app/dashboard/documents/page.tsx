'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: 1,
      name: 'Non-Disclosure Agreement.pdf',
      uploadedAt: '2024-01-15',
      status: 'verified',
      verifiedAt: '2024-01-15 10:30 AM',
      confidence: '99.8%',
      layers: 5,
    },
    {
      id: 2,
      name: 'Service Agreement.pdf',
      uploadedAt: '2024-01-14',
      status: 'verified',
      verifiedAt: '2024-01-14 02:15 PM',
      confidence: '98.5%',
      layers: 5,
    },
    {
      id: 3,
      name: 'Employment Contract.pdf',
      uploadedAt: '2024-01-10',
      status: 'verified',
      verifiedAt: '2024-01-10 11:45 AM',
      confidence: '99.2%',
      layers: 5,
    },
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Documents</h2>
          <p className="text-slate-400 text-sm">View all your verified documents and their verification details</p>
        </div>

        {documents.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">No documents yet. Upload one to get started!</p>
              <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600">
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="border-slate-700 bg-slate-800/50 glass-effect hover:border-slate-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                          <FileText className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{doc.name}</p>
                          <p className="text-xs text-slate-400">Uploaded {doc.uploadedAt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {doc.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600/30 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400">Verification Time</p>
                      <p className="text-sm font-medium text-white">{doc.verifiedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Confidence Score</p>
                      <p className="text-sm font-medium text-cyan-400">{doc.confidence}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Verification Layers</p>
                      <p className="text-sm font-medium text-white">{doc.layers}-Layer System</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
