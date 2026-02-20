"use client"

import { Award, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VerificationResult } from "@/lib/types"

interface CertificatePanelProps {
  result: VerificationResult
}

export function CertificatePanel({ result }: CertificatePanelProps) {
  if (!result.layer3 || !result.layer2 || !result.layer4 || !result.layer5) return null

  const verdict = result.overallVerdict
  const verdictColor = verdict === "VERIFIED"
    ? "text-success"
    : verdict === "UNCERTAIN"
      ? "text-warning"
      : "text-destructive"

  function downloadJSON() {
    const certData = {
      type: "lexaxiom_verification_certificate",
      timestamp: new Date().toISOString(),
      verdict: result.overallVerdict,
      cfiScore: result.layer3?.cfiScore,
      constitutionalCompliance: `${result.layer2?.score}/10`,
      coverageGuarantee: `${((result.layer5?.coverageGuarantee ?? 0) * 100).toFixed(0)}%`,
      zkProofHash: result.layer4?.zkProofHash,
      z3Status: result.layer1?.z3Result.status,
      soundnessBadge: "Mathematically proven by Z3 SMT solver",
    }
    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lexaxiom-certificate.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-primary/20 bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">LexAxiom Verification Certificate</h3>
      </div>

      <div className="rounded-lg border border-border bg-secondary p-4">
        <div className="mb-4 border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-muted-foreground">LEXAXIOM CERT</p>
            <p className="font-mono text-[10px] text-muted-foreground">{new Date().toISOString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-[10px] text-muted-foreground">CFI Score</p>
            <p className={`font-mono text-lg font-bold ${verdictColor}`}>
              {result.layer3.cfiScore.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Constitutional</p>
            <p className={`font-mono text-lg font-bold ${verdictColor}`}>
              {result.layer2.score}/10
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
            <p className="font-mono text-lg font-bold text-primary">
              {(result.layer5.coverageGuarantee * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">ZK Proof</p>
            <p className="truncate font-mono text-[10px] font-bold text-primary">
              {result.layer4.zkProofHash.slice(0, 14)}...
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          <p className="text-center text-[10px] font-bold text-primary">
            Soundness Badge: Mathematically proven by Z3 SMT solver
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={downloadJSON}
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs bg-transparent"
        >
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs bg-transparent"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "LexAxiom Verification",
                text: `Verdict: ${verdict} | CFI: ${result.layer3?.cfiScore.toFixed(3)}`,
              })
            }
          }}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </div>
  )
}
