"use client"

import { Brain, Scale, Users, Lock, BarChart3, Check, Loader2, AlertCircle, Clock } from "lucide-react"
import type { LayerStatus } from "@/lib/types"

const LAYERS = [
  { id: 1, name: "Neuro-Symbolic", description: "Z3 SMT Solver", icon: Brain, color: "text-primary" },
  { id: 2, name: "Constitutional AI", description: "10 Principles", icon: Scale, color: "text-info" },
  { id: 3, name: "Multi-Agent Debate", description: "3 Agents + CFI", icon: Users, color: "text-warning" },
  { id: 4, name: "ZK Proofs", description: "EZKL Circuit", icon: Lock, color: "text-foreground" },
  { id: 5, name: "Conformal Predict.", description: "95% Coverage", icon: BarChart3, color: "text-primary" },
]

function StatusIcon({ status }: { status: LayerStatus }) {
  switch (status) {
    case "complete":
      return <Check className="h-3.5 w-3.5 text-success" />
    case "running":
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
    case "error":
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />
    default:
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

interface LayerPipelineProps {
  statuses: [LayerStatus, LayerStatus, LayerStatus, LayerStatus, LayerStatus]
}

export function LayerPipeline({ statuses }: LayerPipelineProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Verification Pipeline</h3>
      <div className="flex flex-col gap-2">
        {LAYERS.map((layer, idx) => {
          const status = statuses[idx]
          const Icon = layer.icon
          return (
            <div
              key={layer.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                status === "running"
                  ? "border-primary/40 bg-primary/5"
                  : status === "complete"
                  ? "border-success/20 bg-success/5"
                  : "border-border bg-secondary"
              }`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                status === "complete" ? "bg-success/10" : status === "running" ? "bg-primary/10" : "bg-muted"
              }`}>
                <Icon className={`h-4 w-4 ${status === "complete" ? "text-success" : status === "running" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold ${status === "complete" || status === "running" ? "text-foreground" : "text-muted-foreground"}`}>
                  Layer {layer.id}: {layer.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{layer.description}</p>
              </div>
              <StatusIcon status={status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
