"use client"

import { Scale, CheckCircle2, XCircle } from "lucide-react"
import type { Layer2Result } from "@/lib/types"

interface Layer2PanelProps {
  result: Layer2Result
}

export function Layer2Panel({ result }: Layer2PanelProps) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Scale className="h-4 w-4 text-info" />
        <h3 className="text-sm font-semibold text-foreground">Layer 2: Constitutional AI</h3>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
          result.score === 10
            ? "bg-success/10 text-success"
            : result.score >= 8
            ? "bg-warning/10 text-warning"
            : "bg-destructive/10 text-destructive"
        }`}>
          {result.score}/10
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Principles Grid */}
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {result.principles.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                p.passed ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
              }`}
            >
              {p.passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
              ) : (
                <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-foreground">{p.name}</p>
                <p className="truncate text-[9px] text-muted-foreground">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Certificate */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="mb-1 text-[10px] font-bold text-primary">Constitutional Compliance Certificate</p>
          <p className="text-[10px] text-foreground">{result.critique}</p>
        </div>

        {/* Revision */}
        <div className="rounded-lg bg-secondary p-3">
          <p className="mb-1 text-[10px] font-medium text-muted-foreground">Revision Applied</p>
          <p className="text-[10px] text-foreground">{result.revision}</p>
        </div>
      </div>
    </div>
  )
}
