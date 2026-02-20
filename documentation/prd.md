# Product Requirements Document (PRD)
**Product Name**: LexAxiom
**Version**: 1.0.0
**Status**: Beta / Hackathon Demo

## 1. Executive Summary
LexAxiom is a Verifiable Legal Intelligence platform that moves beyond "black box" LLM generation. It provides a mathematically rigorous audit of legal contracts by combining neuro-symbolic reasoning, multi-agent debate, and uncertainty quantification.

## 2. Problem Statement
Legal professionals cannot trust generic LLMs due to:
-   **Hallucinations**: Inventing cases or clauses.
-   **Lack of Logic**: Failing to catch contradictions in complex conditionals.
-   **Opacity**: No way to verify *why* an answer was given.

## 3. Key Features

### 3.1 Document Ingestion
-   **Support**: PDF and TXT files.
-   **Privacy**: Local processing via PDF.js; documents are not stored on external training servers (in this demo architecture).
-   **Sample Data**: "One-click" load of a sample Mutual NDA for testing.

### 3.2 5-Layer Verification Engine
1.  **Logical Proof**: Deontic logic parsing and Z3 Satisfiability checking.
2.  **Compliance Check**: Constitutional AI scoring against legal principles.
3.  **Hallucination Check**: Multi-agent adversarial debate with citation backing.
4.  **Math Certification**: Simulated Zero-Knowledge Proof generation.
5.  **Risk Quantification**: Conformal prediction sets with confidence guarantees.

### 3.3 Interactive Dashboard
-   **Real-time Status**: Visual pipeline showing the progress of each verification layer.
-   **Citations**: Direct display of the specific contract clause used to answer the query.
-   **Visualizations**: Heatmaps for faithfulness (mockup) and status badges.

### 3.4 Certification
-   **Export**: Downloadable JSON verification certificate key verified stats (CFI score, ZK hash).
-   **Sharing**: Share specific verdicts.

## 4. User Flow
1.  **Landing**: User sees the LexAxiom dashboard.
2.  **Input**: User creates an upload or loads a sample NDA.
3.  **Query**: User asks a specific question (e.g., "What is the liability cap?").
4.  **Processing**: System animates through 5 layers of verification.
5.  **Review**: User reads the verdict, checks the specific cited clause, and reviews agent reasoning.
6.  **Trust**: User downloads the Verification Certificate.

## 5. Non-Functional Requirements
-   **Performance**: Extraction < 2s, Verification < 10s.
-   **Reliability**: Must fail gracefully if text is unreadable.
-   **Aesthetics**: "Cyber-legal" interface (Dark mode, Green/Red status indicators, Monospace fonts).
