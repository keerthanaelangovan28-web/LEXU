export type VerificationStatus = "idle" | "processing" | "complete"

export type LayerStatus = "pending" | "running" | "complete" | "error"

export type VerdictType = "VERIFIED" | "UNCERTAIN" | "HALLUCINATION"

export interface DeonticParse {
  operator: "O" | "P" | "F"
  label: string
  expression: string
}

export interface Z3Result {
  status: "SAT" | "UNSAT"
  proof_tree: string[]
  trace: string
}

export interface ExternalExploit {
  id: string
  title: string
  severity: "high" | "medium" | "low"
  description: string
  mitigation: string
  impact: string
}

export interface Layer1Result {
  deonticParses: DeonticParse[]
  z3Result: Z3Result
  entities: {
    parties: string[]
    obligations: string[]
    conditions: string[]
    temporalMarkers: string[]
  }
  relevantClause?: string
  exploits?: ExternalExploit[]
}

export interface ConstitutionalPrinciple {
  id: number
  name: string
  description: string
  passed: boolean
}

export interface Layer2Result {
  principles: ConstitutionalPrinciple[]
  score: number
  critique: string
  revision: string
}

export interface AgentOutput {
  name: string
  role: string
  reasoning: string
  score: number
  findings: string[]
}

export interface Layer3Result {
  agents: AgentOutput[]
  cfiScore: number
  finalVerdict: VerdictType
  moderatorSummary: string
}

export interface Layer4Result {
  zkProofHash: string
  circuitHash: string
  proofSizeBytes: number
  verificationTimeMs: number
  qrData: string
}

export interface ConformalInterval {
  label: string
  lower: number
  upper: number
  coverage: number
}

export interface Layer5Result {
  predictionSet: string[]
  coverageGuarantee: number
  legalEntropyScore: number
  conformalIntervals: ConformalInterval[]
}

export interface VerificationResult {
  layer1: Layer1Result | null
  layer2: Layer2Result | null
  layer3: Layer3Result | null
  layer4: Layer4Result | null
  layer5: Layer5Result | null
  layerStatuses: [LayerStatus, LayerStatus, LayerStatus, LayerStatus, LayerStatus]
  overallStatus: VerificationStatus
  overallVerdict: VerdictType | null
  integrityHash?: string
  previousHash?: string
}

export interface SentenceAnnotation {
  text: string
  status: "verified" | "inferred" | "hallucination"
  score: number
}

export const SAMPLE_CONTRACT = `MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of January 15, 2025, by and between:

Party A: Axiom Technologies Inc., a Delaware corporation ("Disclosing Party")
Party B: Meridian Legal Solutions LLC, a New York limited liability company ("Receiving Party")

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean any and all non-public information, including but not limited to trade secrets, proprietary data, financial records, client lists, and technical specifications disclosed by either party.

2. OBLIGATIONS OF RECEIVING PARTY
2.1 The Receiving Party shall hold and maintain the Confidential Information in strict confidence for the sole benefit of the Disclosing Party.
2.2 The Receiving Party shall not, without the prior written approval of the Disclosing Party, use for the Receiving Party's own benefit or disclose to any third party any Confidential Information.
2.3 The Receiving Party may disclose Confidential Information to its employees, agents, or subcontractors on a need-to-know basis, provided such persons are bound by confidentiality obligations no less restrictive than this Agreement.

3. INDEMNIFICATION
Party A shall indemnify Party B against any losses arising from breach of this Agreement, provided that Party B notifies Party A in writing within 30 days of becoming aware of such breach.

4. TERM AND TERMINATION
4.1 This Agreement shall remain in effect for a period of three (3) years from the date of execution.
4.2 Either party may terminate this Agreement upon 60 days' written notice to the other party.
4.3 Upon termination, the Receiving Party shall return or destroy all Confidential Information within 15 business days.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of laws principles.

6. LIMITATION OF LIABILITY
In no event shall either party's total liability under this Agreement exceed the sum of $500,000 (Five Hundred Thousand Dollars).`

export const SAMPLE_QUERIES = [
  "What are the termination conditions of this agreement?",
  "What are Party A's indemnification obligations?",
  "Can the Receiving Party share confidential information with third parties?",
  "What is the maximum liability under this agreement?",
  "What happens to confidential information after termination?",
]
