'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Trash2, Edit, Shield, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  mfaEnabled: boolean
  lastLogin?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'super-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      uploader: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      viewer: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }
    return colors[role] || colors.viewer
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-slate-400 text-sm">Manage system users and their permissions</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
            Add New User
          </Button>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              System Users
            </CardTitle>
            <CardDescription>Total: {users.length} users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-slate-400">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">MFA</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-medium text-white">{user.name}</TableCell>
                        <TableCell className="text-slate-300">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.mfaEnabled ? (
                            <div className="flex items-center gap-1 text-green-400">
                              <Shield className="h-4 w-4" />
                              Enabled
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400">
                              <Lock className="h-4 w-4" />
                              Disabled
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.isActive
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600/30 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
