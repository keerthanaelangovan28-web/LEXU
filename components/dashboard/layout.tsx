'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuItemLink,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Shield,
  FileCheck,
  Users,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Lock,
  Menu,
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from cookies
    const userCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth-user='))

    if (!userCookie) {
      router.push('/auth/login')
      return
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
      setUser(userData)
    } catch {
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigationItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Shield,
      label: 'Verify Document',
      href: '/dashboard/verify',
    },
    {
      icon: FileCheck,
      label: 'My Documents',
      href: '/dashboard/documents',
    },
    ...(user.role === 'admin' || user.role === 'super-admin'
      ? [
          {
            icon: Users,
            label: 'User Management',
            href: '/dashboard/admin/users',
          },
          {
            icon: BarChart3,
            label: 'Audit Logs',
            href: '/dashboard/admin/audit-logs',
          },
        ]
      : []),
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Sidebar className="border-r border-slate-700 bg-slate-800/50 backdrop-blur">
          <SidebarHeader className="border-b border-slate-700">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">LexAxiom</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-700">
            <div className="flex items-center justify-between p-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-700 border-slate-600">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-slate-200 focus:bg-slate-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="bg-gradient-to-b from-slate-800/50 to-transparent backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-bold text-white">LexAxiom Dashboard</h1>
              <div className="text-xs text-slate-400">
                Secure • Encrypted • Verified
              </div>
            </div>
          </div>

          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
