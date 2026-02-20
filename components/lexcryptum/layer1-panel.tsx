"use client"

import { Brain, Tag } from "lucide-react"
import type { Layer1Result } from "@/lib/types"

interface Layer1PanelProps {
  result: Layer1Result
}

export function Layer1Panel({ result }: Layer1PanelProps) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Layer 1: Neuro-Symbolic Verification</h3>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${result.z3Result.status === "SAT"
            ? "bg-success/10 text-success"
            : "bg-destructive/10 text-destructive"
          }`}>
          Z3: {result.z3Result.status}
        </span>
      </div>

      {result.relevantClause && (
        <div className="mb-4 rounded-lg bg-primary/5 p-3 border border-primary/20">
          <p className="mb-1 text-xs font-bold text-primary">Primary Citation / Relevant Clause</p>
          <p className="text-sm italic text-foreground border-l-2 border-primary pl-2">
            "{result.relevantClause}"
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Deontic Logic */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Deontic Logic Parse</p>
          <div className="flex flex-col gap-1.5">
            {result.deonticParses.map((dp, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2">
                <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${dp.operator === "O" ? "bg-info/10 text-info"
                    : dp.operator === "P" ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                  {dp.operator}()
                </span>
                <span className="text-xs text-muted-foreground">{dp.label}:</span>
                <code className="text-xs font-mono text-foreground">{dp.expression}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Z3 Proof Tree */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Z3 Proof Tree</p>
          <div className="rounded-lg bg-secondary p-3">
            <pre className="text-[10px] font-mono leading-relaxed text-foreground">
              {result.z3Result.proof_tree.join("\n")}
            </pre>
          </div>
        </div>

        {/* Entities */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Extracted Entities</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Parties", items: result.entities.parties },
              { label: "Obligations", items: result.entities.obligations },
              { label: "Conditions", items: result.entities.conditions },
              { label: "Temporal", items: result.entities.temporalMarkers },
            ].map(({ label, items }) => (
              <div key={label} className="rounded-lg bg-secondary p-2.5">
                <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <Tag className="h-3 w-3" /> {label}
                </p>
                {items.map((item, idx) => (
                  <p key={idx} className="text-[10px] text-foreground">{item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Z3 Trace */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Z3 Solver Trace</p>
          <div className="rounded-lg bg-secondary p-3">
            <pre className="text-[10px] font-mono text-muted-foreground">{result.z3Result.trace}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
