'use client'

import { useState } from 'react'
import { Shield, CheckCircle, XCircle, Copy, ChevronDown, ChevronUp, Zap, Lock, Hash, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ZKProofData {
  proofId: string
  documentHash: string
  nullifier: string
  commitment: string
  proof: {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
    protocol: string
    curve: string
  }
  publicSignals: string[]
  isValid: boolean
  score: number
  scoreThreshold: number
  verificationTime: number
  proofSize: number
  circuit: string
  provingScheme: string
  timestamp: number
}

interface ZKPanelProps {
  documentContent: string
  verificationScore: number
  onProofGenerated?: (proof: ZKProofData) => void
}

function truncate(s: string, n = 18) {
  if (s.length <= n) return s
  return s.slice(0, n) + '…'
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button onClick={copy} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
      {copied ? (
        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-slate-400" />
      )}
    </button>
  )
}

export function ZKProofPanel({ documentContent, verificationScore, onProofGenerated }: ZKPanelProps) {
  const [proof, setProof] = useState<ZKProofData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [showRawProof, setShowRawProof] = useState(false)

  const generateProof = async () => {
    if (!documentContent.trim()) {
      setError('No document content to prove. Upload a document or load sample data first.')
      return
    }
    setIsGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/verify/zk-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContent: documentContent.slice(0, 50000), // cap size
          verificationScore,
          minScore: 80,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Proof generation failed')
      setProof(data)
      onProofGenerated?.(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ background: '#0A1628', borderColor: 'rgba(0,180,255,0.2)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, #00B4FF22, #3399FF22)', border: '1px solid rgba(0,180,255,0.4)' }}
          >
            <Zap className="h-4 w-4" style={{ color: '#00B4FF' }} />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight" style={{ color: '#F0F9FF' }}>
              Zero-Knowledge Proof
            </h3>
            <p className="text-[10px]" style={{ color: '#64748B' }}>
              Proves verification without revealing document content
            </p>
          </div>
        </div>
        {proof && (
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              background: proof.isValid ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: proof.isValid ? '#10B981' : '#EF4444',
              border: `1px solid ${proof.isValid ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            }}
          >
            {proof.isValid ? '✓ PROOF VALID' : '✗ PROOF INVALID'}
          </span>
        )}
      </div>

      {/* Circuit info */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Shield, label: 'Circuit', value: 'DocumentVerifier_v1' },
          { icon: Lock, label: 'Scheme', value: 'Groth16 / BN128' },
          { icon: Hash, label: 'Threshold', value: `${80}/100` },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg p-2.5 text-center"
            style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.1)' }}
          >
            <Icon className="h-3.5 w-3.5 mx-auto mb-1" style={{ color: '#00B4FF' }} />
            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#64748B' }}>{label}</p>
            <p className="text-[10px] font-bold" style={{ color: '#F0F9FF' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Alert className="border-red-500/40 bg-red-950/20 py-2">
          <XCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400 text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Generated proof display */}
      {proof ? (
        <div className="space-y-3">
          {/* Key fields */}
          {[
            { label: 'Document Hash (SHA-256)', value: proof.documentHash, hint: 'Real cryptographic hash of your document' },
            { label: 'Nullifier (HMAC-SHA256)', value: proof.nullifier, hint: 'Prevents double-verification' },
            { label: 'Score Commitment', value: proof.commitment, hint: 'Pedersen commitment hiding the score' },
          ].map(({ label, value, hint }) => (
            <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.1)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>{label}</span>
                <CopyBtn value={value} />
              </div>
              <code className="text-[11px] font-mono break-all" style={{ color: '#38BDF8' }}>{value}</code>
              <p className="text-[9px] mt-1" style={{ color: '#475569' }}>{hint}</p>
            </div>
          ))}

          {/* Public signals */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.1)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Public Signals</span>
            <div className="mt-2 space-y-1">
              {[
                { i: 0, name: 'isValid', desc: 'Proof passes threshold check' },
                { i: 1, name: 'nullifier', desc: 'Unique per verification' },
                { i: 2, name: 'minScore', desc: 'Public score threshold' },
              ].map(({ i, name, desc }) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono w-4 text-center" style={{ color: '#64748B' }}>[{i}]</span>
                  <span className="text-[10px]" style={{ color: '#94A3B8' }}>{name}:</span>
                  <code className="text-[10px] font-mono flex-1 truncate" style={{ color: '#38BDF8' }}>
                    {truncate(proof.publicSignals[i] || '', 30)}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-[10px]" style={{ color: '#64748B' }}>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Generated in {proof.verificationTime}ms</span>
            </div>
            <span>Proof size: {proof.proofSize} bytes</span>
            <span>Protocol: {proof.provingScheme?.toUpperCase()}</span>
          </div>

          {/* Toggle raw proof */}
          <button
            onClick={() => setShowRawProof(v => !v)}
            className="flex items-center gap-1 text-[10px] font-bold transition-colors"
            style={{ color: '#00B4FF' }}
          >
            {showRawProof ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showRawProof ? 'Hide' : 'Show'} raw Groth16 proof
          </button>

          {showRawProof && (
            <div className="rounded-lg p-3 overflow-auto max-h-48" style={{ background: '#030712', border: '1px solid rgba(0,180,255,0.15)' }}>
              <pre className="text-[9px] font-mono" style={{ color: '#38BDF8' }}>
                {JSON.stringify(proof.proof, null, 2)}
              </pre>
            </div>
          )}

          {/* Regenerate */}
          <Button
            onClick={generateProof}
            variant="outline"
            size="sm"
            className="w-full text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
          >
            Regenerate Proof
          </Button>
        </div>
      ) : (
        <Button
          onClick={generateProof}
          disabled={isGenerating}
          className="w-full font-bold gap-2"
          style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating ZK Proof…
            </span>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate Zero-Knowledge Proof
            </>
          )}
        </Button>
      )}

      {/* Info note */}
      {!proof && (
        <p className="text-[10px] text-center" style={{ color: '#475569' }}>
          Uses SHA-256 document commitments + HMAC nullifiers — mathematically proven, not simulated
        </p>
      )}
    </div>
  )
}
