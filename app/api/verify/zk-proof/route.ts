import { NextRequest, NextResponse } from 'next/server'
import { generateZKProof } from '@/lib/zk/proof-generator'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// Global proof store (same singleton pattern as users)
declare global {
  var __lexaxiom_zk_proofs: Map<string, ZKProofRecord> | undefined
}

export interface ZKProofRecord {
  id: string
  userId: string
  documentHash: string
  nullifier: string
  commitment: string
  proof: object
  publicSignals: string[]
  isValid: boolean
  score: number
  scoreThreshold: number
  verificationTime: number
  proofSize: number
  timestamp: number
  createdAt: Date
}

if (!global.__lexaxiom_zk_proofs) {
  global.__lexaxiom_zk_proofs = new Map()
}

const proofStore = global.__lexaxiom_zk_proofs

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    const user = token ? verifyToken(token) : null

    const body = await request.json()
    const { documentContent, verificationScore, minScore } = body

    if (!documentContent || typeof verificationScore !== 'number') {
      return NextResponse.json(
        { error: 'documentContent and verificationScore are required' },
        { status: 400 }
      )
    }

    if (verificationScore < 0 || verificationScore > 100) {
      return NextResponse.json(
        { error: 'verificationScore must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Generate real ZK proof
    const result = await generateZKProof({
      documentContent,
      verificationScore,
      minScore: minScore ?? 80,
      userId: user?.id,
    })

    // Store proof record
    const proofId = `zkp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const record: ZKProofRecord = {
      id: proofId,
      userId: user?.id ?? 'anonymous',
      documentHash: result.documentHash,
      nullifier: result.nullifier,
      commitment: result.commitment,
      proof: result.proof,
      publicSignals: result.publicSignals,
      isValid: result.isValid,
      score: verificationScore,
      scoreThreshold: result.scoreThreshold,
      verificationTime: result.verificationTime,
      proofSize: result.proofSize,
      timestamp: result.timestamp,
      createdAt: new Date(),
    }
    proofStore.set(proofId, record)


    return NextResponse.json({
      success: true,
      proofId,
      documentHash: result.documentHash,
      nullifier: result.nullifier,
      commitment: result.commitment,
      proof: result.proof,
      publicSignals: result.publicSignals,
      isValid: result.isValid,
      scoreThreshold: result.scoreThreshold,
      verificationTime: result.verificationTime,
      proofSize: result.proofSize,
      circuit: 'DocumentVerifier_v1',
      provingScheme: 'groth16',
      curve: 'bn128',
      timestamp: result.timestamp,
    })
  } catch (error) {
    console.error('[LexAxiom] ZK proof generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ZK proof' },
      { status: 500 }
    )
  }
}

// GET: retrieve a stored proof
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const proofId = searchParams.get('id')

  if (!proofId) {
    const all = Array.from(proofStore.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50)
    return NextResponse.json({ proofs: all, total: proofStore.size })
  }

  const proof = proofStore.get(proofId)
  if (!proof) {
    return NextResponse.json({ error: 'Proof not found' }, { status: 404 })
  }

  return NextResponse.json(proof)
}
