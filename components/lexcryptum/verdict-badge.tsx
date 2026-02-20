"use client"

import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react"
import type { VerdictType } from "@/lib/types"

interface VerdictBadgeProps {
  verdict: VerdictType
  cfiScore?: number
  constitutionalScore?: number
  coverage?: number
}

export function VerdictBadge({ verdict, cfiScore, constitutionalScore, coverage }: VerdictBadgeProps) {
  const config = {
    VERIFIED: {
      icon: ShieldCheck,
      label: "VERIFIED",
      border: "border-success/30",
      bg: "bg-success/5",
      textColor: "text-success",
      description: "Claim is mathematically proven and logically entailed from the source document.",
    },
    UNCERTAIN: {
      icon: ShieldQuestion,
      label: "UNCERTAIN",
      border: "border-warning/30",
      bg: "bg-warning/5",
      textColor: "text-warning",
      description: "Mixed agent consensus. Additional manual review recommended.",
    },
    HALLUCINATION: {
      icon: ShieldAlert,
      label: "HALLUCINATION DETECTED",
      border: "border-destructive/30",
      bg: "bg-destructive/5",
      textColor: "text-destructive",
      description: "Claim is not logically entailed from the source document. Key elements lack support.",
    },
  }

  const c = config[verdict]
  const Icon = c.icon

  return (
    <div className={`animate-fade-in-up rounded-xl border ${c.border} ${c.bg} p-6 neon-glow`} style={{ borderColor: verdict === 'VERIFIED' ? 'rgba(0, 255, 153, 0.4)' : verdict === 'HALLUCINATION' ? 'rgba(255, 77, 77, 0.4)' : 'rgba(0, 180, 255, 0.4)' }}>
      <div className="flex items-start gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.bg} border ${c.border} neon-glow`}>
          <Icon className={`h-8 w-8 ${c.textColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-black tracking-tighter ${c.textColor}`}>{c.label}</h3>
          <p className="mt-1 text-sm font-medium leading-relaxed" style={{ color: '#A0AEC0' }}>{c.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {cfiScore !== undefined && (
              <div className="rounded-xl bg-black/40 px-3 py-2 border border-white/5 neon-border">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">CFI Confidence</p>
                <p className={`font-mono text-base font-black ${c.textColor}`}>{cfiScore.toFixed(3)}</p>
              </div>
            )}
            {constitutionalScore !== undefined && (
              <div className="rounded-xl bg-black/40 px-3 py-2 border border-white/5 neon-border">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Constitutional AI</p>
                <p className={`font-mono text-base font-black ${c.textColor}`}>{constitutionalScore}/10</p>
              </div>
            )}
            {coverage !== undefined && (
              <div className="rounded-xl bg-black/40 px-3 py-2 border border-white/5 neon-border">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Context Coverage</p>
                <p className={`font-mono text-base font-black ${c.textColor}`}>{(coverage * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
