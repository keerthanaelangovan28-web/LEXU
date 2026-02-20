"use client"

import { Map } from "lucide-react"
import type { SentenceAnnotation } from "@/lib/types"

interface FaithfulnessHeatmapProps {
  annotations: SentenceAnnotation[]
}

export function FaithfulnessHeatmap({ annotations }: FaithfulnessHeatmapProps) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Map className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Faithfulness Heatmap</h3>
      </div>

      <div className="mb-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-success" />
          <span className="text-[10px] text-muted-foreground">Verified (Z3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-warning" />
          <span className="text-[10px] text-muted-foreground">Inferred (CFI 0.7-0.9)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-destructive" />
          <span className="text-[10px] text-muted-foreground">Hallucination</span>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto rounded-lg bg-secondary p-3">
        <div className="flex flex-wrap gap-0.5">
          {annotations.map((ann, i) => {
            const bgColor =
              ann.status === "verified"
                ? "bg-success/20 border-success/30"
                : ann.status === "inferred"
                ? "bg-warning/20 border-warning/30"
                : "bg-destructive/20 border-destructive/30"

            return (
              <span
                key={i}
                className={`inline rounded border px-1 py-0.5 text-[10px] leading-relaxed text-foreground ${bgColor}`}
                title={`Score: ${ann.score.toFixed(2)} | Status: ${ann.status}`}
              >
                {ann.text}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
