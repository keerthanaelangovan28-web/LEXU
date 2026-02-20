"use client"

import { Shield } from "lucide-react"

export function LexcryptumHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">LexAxiom</h1>
          <p className="text-xs text-muted-foreground">Verifiable Legal Intelligence</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-xs font-medium text-muted-foreground">5 Layers Active</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">v1.0.0</span>
      </div>
    </header>
  )
}
