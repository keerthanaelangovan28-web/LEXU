"use client"

import { Lock, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { Layer4Result } from "@/lib/types"

interface Layer4PanelProps {
  result: Layer4Result
}

export function Layer4Panel({ result }: Layer4PanelProps) {
  const [copied, setCopied] = useState(false)

  function copyHash() {
    navigator.clipboard.writeText(result.zkProofHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Lock className="h-4 w-4 text-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Layer 4: Zero-Knowledge Proofs</h3>
        <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
          Proof Generated
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Proof Hash */}
        <div className="rounded-lg bg-secondary p-3">
          <p className="mb-1 text-[10px] font-medium text-muted-foreground">ZK-SNARK Proof Hash</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate text-[10px] font-mono text-primary">{result.zkProofHash}</code>
            <button type="button" onClick={copyHash} className="shrink-0 text-muted-foreground hover:text-foreground">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary p-2.5">
            <p className="text-[10px] text-muted-foreground">Circuit Hash</p>
            <p className="truncate font-mono text-[10px] text-foreground">{result.circuitHash.slice(0, 20)}...</p>
          </div>
          <div className="rounded-lg bg-secondary p-2.5">
            <p className="text-[10px] text-muted-foreground">Proof Size</p>
            <p className="font-mono text-[10px] text-foreground">{result.proofSizeBytes} bytes</p>
          </div>
          <div className="rounded-lg bg-secondary p-2.5">
            <p className="text-[10px] text-muted-foreground">Verification Time</p>
            <p className="font-mono text-[10px] text-foreground">{result.verificationTimeMs}ms</p>
          </div>
          <div className="rounded-lg bg-secondary p-2.5">
            <p className="text-[10px] text-muted-foreground">Protocol</p>
            <p className="font-mono text-[10px] text-foreground">ZK-SNARK (Groth16)</p>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-secondary p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="grid h-20 w-20 grid-cols-5 grid-rows-5 gap-0.5">
              {Array(25).fill(0).map((_, i) => (
                <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-foreground" : "bg-secondary"}`} />
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground">LexCryptum Verification QR</p>
          </div>
        </div>
      </div>
    </div>
  )
}
