"use client"

import { useState } from "react"
import { Users, ChevronDown, ChevronUp } from "lucide-react"
import type { Layer3Result } from "@/lib/types"

interface Layer3PanelProps {
  result: Layer3Result
}

export function Layer3Panel({ result }: Layer3PanelProps) {
  const [expandedAgent, setExpandedAgent] = useState<number | null>(null)

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold text-foreground">Layer 3: Multi-Agent Debate</h3>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${result.finalVerdict === "VERIFIED"
            ? "bg-success/10 text-success"
            : result.finalVerdict === "UNCERTAIN"
              ? "bg-warning/10 text-warning"
              : "bg-destructive/10 text-destructive"
          }`}>
          CFI: {result.cfiScore.toFixed(3)}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Agents */}
        {result.agents.map((agent, i) => (
          <div key={i} className="rounded-lg border border-border bg-secondary">
            <button
              type="button"
              onClick={() => setExpandedAgent(expandedAgent === i ? null : i)}
              className="flex w-full items-center gap-3 px-3 py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground">{agent.role}</p>
              </div>
              <span className="mr-2 text-[10px] font-mono font-bold text-primary">
                {agent.score.toFixed(2)}
              </span>
              {expandedAgent === i ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
            {expandedAgent === i && (
              <div className="border-t border-border px-3 py-3">
                <p className="mb-2 text-[10px] leading-relaxed text-foreground">{agent.reasoning}</p>
                <div className="flex flex-col gap-1">
                  {agent.findings.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-1.5">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <p className="text-[10px] text-muted-foreground">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}
