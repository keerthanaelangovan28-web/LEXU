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
    <div className={`animate-fade-in-up rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.bg} border ${c.border}`}>
          <Icon className={`h-6 w-6 ${c.textColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${c.textColor}`}>{c.label}</h3>
          <p className="mt-1 text-xs leading-relaxed text-foreground">{c.description}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {cfiScore !== undefined && (
              <div className="rounded-md bg-card px-2.5 py-1.5 border border-border">
                <p className="text-[9px] text-muted-foreground">CFI Score</p>
                <p className={`font-mono text-sm font-bold ${c.textColor}`}>{cfiScore.toFixed(3)}</p>
              </div>
            )}
            {constitutionalScore !== undefined && (
              <div className="rounded-md bg-card px-2.5 py-1.5 border border-border">
                <p className="text-[9px] text-muted-foreground">Constitutional</p>
                <p className={`font-mono text-sm font-bold ${c.textColor}`}>{constitutionalScore}/10</p>
              </div>
            )}
            {coverage !== undefined && (
              <div className="rounded-md bg-card px-2.5 py-1.5 border border-border">
                <p className="text-[9px] text-muted-foreground">Coverage</p>
                <p className={`font-mono text-sm font-bold ${c.textColor}`}>{(coverage * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
