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
  Users,
  Settings,
  LogOut,
  Home,
  BarChart3,
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
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1120' }}>
        <div style={{ color: '#94A3B8' }}>Loading...</div>
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
      <div className="flex w-full min-h-screen" style={{ background: '#030712' }}>
        {/* Sidebar */}
        <Sidebar className="neon-border" style={{ background: '#0F172A', borderRight: '1px solid rgba(0, 180, 255, 0.2)' }}>
          <SidebarHeader style={{ borderBottom: '1px solid rgba(0, 180, 255, 0.1)' }}>
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg neon-glow" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}>
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-neon" style={{ color: '#00B4FF' }}>LexAxiom</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300"
                      style={{ color: '#A0AEC0' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(0, 180, 255, 0.1)'
                          ; (e.currentTarget as HTMLElement).style.color = '#00B4FF'
                          ; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 10px rgba(0, 180, 255, 0.2)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                          ; (e.currentTarget as HTMLElement).style.color = '#A0AEC0'
                          ; (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter style={{ borderTop: '1px solid rgba(0, 180, 255, 0.1)' }}>
            <div className="flex items-center justify-between p-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: '#F0F9FF' }}>{user.name}</p>
                <p className="text-xs truncate" style={{ color: '#64748B' }}>{user.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full"
                  >
                    <Menu className="h-4 w-4" style={{ color: '#00B4FF' }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{ background: '#1E293B', border: '1px solid rgba(0, 180, 255, 0.3)' }}>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-neon-blue/20"
                    style={{ color: '#F0F9FF' }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content — full width */}
        <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
          {/* Top bar */}
          <div
            className="sticky top-0 z-10 backdrop-blur-md"
            style={{ background: 'rgba(3, 7, 18, 0.8)', borderBottom: '1px solid rgba(0, 180, 255, 0.2)' }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-2xl font-black tracking-tight text-neon" style={{ color: '#00B4FF' }}>LexAxiom Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success neon-glow animate-pulse" />
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#00B4FF' }}>
                  Secure • Encrypted
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
