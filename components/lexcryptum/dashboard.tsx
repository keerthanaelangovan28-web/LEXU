"use client"

import { useState, useCallback } from "react"
import { LexcryptumHeader } from "./header"
import { InputSection } from "./input-section"
import { LayerPipeline } from "./layer-pipeline"
import { Layer1Panel } from "./layer1-panel"
import { Layer2Panel } from "./layer2-panel"
import { Layer3Panel } from "./layer3-panel"
import { Layer4Panel } from "./layer4-panel"
import { Layer5Panel } from "./layer5-panel"
import { VerdictBadge } from "./verdict-badge"
import { FaithfulnessHeatmap } from "./faithfulness-heatmap"
import { CertificatePanel } from "./certificate-panel"
import {
  runLayer1,
  runLayer2,
  runLayer3,
  runLayer4,
  runLayer5,
  generateSentenceAnnotations,
} from "@/lib/verification-engine"
import { ModeratorSynthesis } from "./moderator-synthesis"
import type { VerificationResult, LayerStatus, SentenceAnnotation } from "@/lib/types"

const INITIAL_RESULT: VerificationResult = {
  layer1: null,
  layer2: null,
  layer3: null,
  layer4: null,
  layer5: null,
  layerStatuses: ["pending", "pending", "pending", "pending", "pending"],
  overallStatus: "idle",
  overallVerdict: null,
}

export function LexcryptumDashboard() {
  const [result, setResult] = useState<VerificationResult>(INITIAL_RESULT)
  const [annotations, setAnnotations] = useState<SentenceAnnotation[]>([])

  const updateLayerStatus = useCallback((index: number, status: LayerStatus) => {
    setResult((prev) => {
      const newStatuses = [...prev.layerStatuses] as [LayerStatus, LayerStatus, LayerStatus, LayerStatus, LayerStatus]
      newStatuses[index] = status
      return { ...prev, layerStatuses: newStatuses }
    })
  }, [])

  const handleVerify = useCallback(async (sourceText: string, query: string) => {
    setResult({ ...INITIAL_RESULT, overallStatus: "processing" })
    setAnnotations([])

    try {
      // Layer 1: Neuro-Symbolic
      updateLayerStatus(0, "running")
      const l1 = await runLayer1(sourceText, query)
      setResult((prev) => ({ ...prev, layer1: l1 }))
      updateLayerStatus(0, "complete")

      // Layer 2: Constitutional AI
      updateLayerStatus(1, "running")
      const l2 = await runLayer2(sourceText, query)
      setResult((prev) => ({ ...prev, layer2: l2 }))
      updateLayerStatus(1, "complete")

      // Layer 3: Multi-Agent Debate
      updateLayerStatus(2, "running")
      const l3 = await runLayer3(sourceText, query)
      setResult((prev) => ({ ...prev, layer3: l3 }))
      updateLayerStatus(2, "complete")

      // Layer 4: ZK Proofs
      updateLayerStatus(3, "running")
      const l4 = await runLayer4(sourceText, query)
      setResult((prev) => ({ ...prev, layer4: l4 }))
      updateLayerStatus(3, "complete")

      // Layer 5: Conformal Prediction
      updateLayerStatus(4, "running")
      const l5 = await runLayer5(sourceText, query)
      setResult((prev) => ({
        ...prev,
        layer5: l5,
        overallStatus: "complete",
        overallVerdict: l3.finalVerdict,
      }))
      updateLayerStatus(4, "complete")

      // Generate heatmap
      const anns = generateSentenceAnnotations(sourceText, l3.finalVerdict)
      setAnnotations(anns)
    } catch (error) {
      console.error("[v0] Verification error:", error)
      setResult((prev) => ({ ...prev, overallStatus: "idle" }))
    }
  }, [updateLayerStatus])

  const isProcessing = result.overallStatus === "processing"
  const isComplete = result.overallStatus === "complete"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LexcryptumHeader />

      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column - Input & Pipeline */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <InputSection onVerify={handleVerify} isProcessing={isProcessing} />
              <LayerPipeline statuses={result.layerStatuses} />
            </div>

            {/* Right Column - Results */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {/* Verdict */}
              {isComplete && result.overallVerdict && (
                <VerdictBadge
                  verdict={result.overallVerdict}
                  cfiScore={result.layer3?.cfiScore}
                  constitutionalScore={result.layer2?.score}
                  coverage={result.layer5?.coverageGuarantee}
                />
              )}

              {/* Moderator Synthesis */}
              {result.layer3 && <ModeratorSynthesis result={result.layer3} />}

              {/* Layer Results */}
              {result.layer1 && <Layer1Panel result={result.layer1} />}
              {result.layer2 && <Layer2Panel result={result.layer2} />}
              {result.layer3 && <Layer3Panel result={result.layer3} />}
              {result.layer4 && <Layer4Panel result={result.layer4} />}
              {result.layer5 && <Layer5Panel result={result.layer5} />}

              {/* Heatmap */}
              {isComplete && annotations.length > 0 && (
                <FaithfulnessHeatmap annotations={annotations} />
              )}

              {/* Certificate */}
              {isComplete && <CertificatePanel result={result} />}

              {/* Empty State */}
              {result.overallStatus === "idle" && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-8 py-16">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Ready to Verify</h3>
                  <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
                    Upload a legal document and enter a claim or query to run the 5-layer verification pipeline.
                    Use the &quot;Load Sample NDA&quot; button to try a demo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            LexAxiom v1.0.0 &mdash; 5-Layer Verifiable Legal Intelligence
          </p>
          <p className="text-[10px] text-muted-foreground">
            Powered by Z3 SMT Solver, CrewAI, MAPIE, EZKL
          </p>
        </div>
      </footer>
    </div>
  )
}
