# System Architecture

## Overview
LexAxiom is a specialized verifiable legal AI system designed to audit legal contracts with mathematical validatity. It employs a 5-layer verification pipeline to ensure correctness, fairness, and safety.

## 5-Layer Verification Pipeline

The core engine (`lib/verification-engine.ts`) orchestrates the following layers sequentially:

### 1. Neuro-Symbolic Verification (Layer 1)
- **Goal**: Convert natural legal language into formal logic to prove consistency.
- **Process**:
    1.  Extract entities (Parties, Obligations, Conditions).
    2.  Parse deontic logic (Obligations, Permissions, Prohibitions).
    3.  Extract relevant clauses using semantic similarity (`findRelevantClause`).
    4.  Simulate Z3 SMT prover execution to check for logical satisfiability (SAT/UNSAT).

### 2. Constitutional AI Guardrails (Layer 2)
- **Goal**: Ensure the output adheres to fundamental legal principles.
- **Process**:
    -   Evaluates the contract against 10 defined constitutional principles (e.g., Deontic Preservation, Temporal Precedence).
    -   Calculates a compliance score.

### 3. Multi-Agent Debate (Layer 3)
- **Goal**: Reduce hallucinations through adversarial debate.
- **Agents**:
    -   **KG Extractor**: Focuses on entity relationships and knowledge graphs.
    -   **HalluGraph Verifier**: Checks entailment and citations.
    -   **Citation Auditor**: Verifies temporal and jurisdictional validity of citations.
- **Process**: Agents analyze the text independently and a moderator synthesizes a verdict (Verified/Uncertain/Hallucination).

### 4. Zero-Knowledge Proofs (Layer 4)
- **Goal**: Certify the computation without revealing sensitive data.
- **Process**: Generates a simulated ZK-SNARK proof hash and circuit identifier to prove that the verification was performed correctly on the specific data.

### 5. Conformal Prediction (Layer 5)
- **Goal**: Quantify uncertainty.
- **Process**: Generates prediction sets for legal interpretations and calculates a coverage guarantee (e.g., 95% confidence that the true interpretation is within the set).

## Client-Side Architecture
- **Input Processing**: Browser-based PDF parsing (`lib/pdf-utils.ts`) using Web Workers to ensure data privacy (docs remain on client).
- **UI Components**:
    -   `Dashboard`: Orchestrates the view.
    -   `Layer[1-5]Panel`: Visualizes specific layer outputs.
    -   `CertificatePanel`: Generates a downloadable JSON certificate of verification.

## Data Flow
1.  User uploads Document (PDF/TXT) -> Client Browser.
2.  Text Extracted locally -> Passed to `InputSection`.
3.  User enters Query.
4.  Data passed to `runLayer[X]` functions (Simulated async server actions/client usage).
5.  Results displayed progressively in the UI.
