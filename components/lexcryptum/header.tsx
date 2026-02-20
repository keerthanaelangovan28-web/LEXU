"use client"

import { Shield } from "lucide-react"

export function LexcryptumHeader() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'rgba(0, 180, 255, 0.2)' }}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl neon-glow" style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)' }}>
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-neon shadow-primary/20" style={{ color: '#00B4FF' }}>LexAxiom</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>Neural Verification Engine</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border bg-secondary/50 px-4 py-1.5 sm:flex" style={{ borderColor: 'rgba(0, 180, 255, 0.3)' }}>
          <span className="h-2 w-2 rounded-full bg-success neon-glow animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00B4FF' }}>5 Layers Active</span>
        </div>
        <span className="text-[10px] font-mono font-bold" style={{ color: '#64748B' }}>v1.0.4-BETA</span>
      </div>
    </header>
  )
}
