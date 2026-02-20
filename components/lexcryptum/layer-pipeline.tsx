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
    <div className="rounded-2xl border p-6 neon-border transition-all duration-500" style={{ background: '#0F172A', borderColor: 'rgba(0, 180, 255, 0.2)' }}>
      <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-neon" style={{ color: '#00B4FF' }}>Verification Pipeline</h3>
      <div className="flex flex-col gap-3">
        {LAYERS.map((layer, idx) => {
          const status = statuses[idx]
          const Icon = layer.icon
          return (
            <div
              key={layer.id}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-300 ${status === "running"
                  ? "neon-glow border-primary/60 bg-primary/20 scale-[1.02]"
                  : status === "complete"
                    ? "border-success/40 bg-success/10"
                    : "border-white/5 bg-black/20 opacity-60"
                }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status === "complete" ? "bg-success/20" : status === "running" ? "bg-primary/20" : "bg-white/5"
                }`}>
                <Icon className={`h-5 w-5 ${status === "complete" ? "text-success" : status === "running" ? "text-primary" : "text-slate-500"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-black tracking-tight ${status === "complete" || status === "running" ? "text-white" : "text-slate-500"}`}>
                  Layer {layer.id}: {layer.name}
                </p>
                <p className="text-[11px] font-medium" style={{ color: status === "complete" || status === "running" ? '#A0AEC0' : '#475569' }}>{layer.description}</p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center">
                <StatusIcon status={status} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
