import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'LexAxiom | Secure Legal Document Verification',
  description: 'Enterprise-grade legal document verification with 5-layer AI verification, end-to-end encryption, and role-based access control. Secure, verifiable, and trusted.',
  keywords: ['legal', 'verification', 'AI', 'encryption', 'document', 'security'],
  openGraph: {
    title: 'LexAxiom | Secure Legal Document Verification',
    description: 'Enterprise-grade legal document verification with end-to-end encryption and advanced AI systems.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Enterprise-grade legal document verification with 5-layer AI verification, end-to-end encryption, and role-based access control." />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
