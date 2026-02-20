"use client"

import { BarChart3 } from "lucide-react"
import type { Layer5Result } from "@/lib/types"

interface Layer5PanelProps {
  result: Layer5Result
}

export function Layer5Panel({ result }: Layer5PanelProps) {
  const entropyColor = result.legalEntropyScore < 0.3
    ? "text-success"
    : result.legalEntropyScore < 0.6
    ? "text-warning"
    : "text-destructive"

  const entropyBg = result.legalEntropyScore < 0.3
    ? "bg-success"
    : result.legalEntropyScore < 0.6
    ? "bg-warning"
    : "bg-destructive"

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Layer 5: Conformal Prediction</h3>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          {(result.coverageGuarantee * 100).toFixed(0)}% Coverage
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Prediction Set */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Prediction Set</p>
          <div className="flex flex-wrap gap-1.5">
            {result.predictionSet.map((item, i) => (
              <span key={i} className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] text-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Legal Entropy */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Legal Entropy Score</p>
            <span className={`font-mono text-xs font-bold ${entropyColor}`}>
              {result.legalEntropyScore.toFixed(2)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${entropyBg} transition-all`}
              style={{ width: `${result.legalEntropyScore * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">
            {result.legalEntropyScore < 0.3 ? "Low ambiguity - precise legal terms" : result.legalEntropyScore < 0.6 ? "Moderate ambiguity - some vague terms" : "High ambiguity - significant vague language"}
          </p>
        </div>

        {/* Conformal Intervals */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Conformal Intervals</p>
          <div className="flex flex-col gap-2">
            {result.conformalIntervals.map((ci, i) => (
              <div key={i} className="rounded-lg bg-secondary p-2.5">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-foreground">{ci.label}</p>
                  <span className="text-[10px] font-mono text-primary">
                    [{ci.lower.toFixed(2)}, {ci.upper.toFixed(2)}]
                  </span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="absolute h-full rounded-full bg-primary/30"
                    style={{ left: `${ci.lower * 100}%`, width: `${(ci.upper - ci.lower) * 100}%` }}
                  />
                  <div
                    className="absolute h-full w-1 rounded-full bg-primary"
                    style={{ left: `${((ci.lower + ci.upper) / 2) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
