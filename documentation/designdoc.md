# Design Document: LexAxiom

## 1. Design Philosophy
LexAxiom is built on the principle of **"Trust but Verify"**. We do not replace the lawyer; we provide a verifiable second pair of eyes. The visual design reflects this through a high-contrast, "cyber-security" aesthetic rather than a traditional corporate legal look. The architecture reflects this by decoupling generation (Agents) from verification (Z3/Math).

## 2. Component Design

### 2.1 The Dashboard (`dashboard.tsx`)
The centralized hub. It maintains the state of the verification result (`VerificationResult`).
-   **State Management**: React `useState`.
-   **Prop Drilling**: Passes specific layer results down to sub-panels.
-   **Responsiveness**: Uses a Grid layout (CSS Grid) to separate Input (Left) from Results (Right) on large screens, stacking them on mobile.

### 2.2 Input Section (`input-section.tsx`)
Handles the "dirty work" of getting text to the engine.
-   **PDF Handling**: Uses `pdfjs-dist` to render PDF pages to an HTML5 Canvas (conceptually) but actually extracting text strings directly from the display layer items.
-   **Dynamic Imports**: Vital for `pdfjs-dist` to avoid Server-Side Rendering (SSR) crashes due to `window` and `DOMMatrix` dependencies.

### 2.3 Verification Engine (`verification-engine.ts`)
A simulation harness for the hackathon. In a production version, this would be an API gateway to Python/Rust microservices.
-   **Layer 1 (Neuro-Symbolic)**: Mocked by checking for keywords ("shall", "may") and mapping them to predefined First-Order Logic predicates. Uses semantic overlap for citations.
-   **Layer 2 (Constitutional)**: A static list of principles that are effectively "checked" against the text.
-   **Layer 3 (Agents)**: Simulated async delays to mimic reading time. Returns structured reasoning objects.
-   **Layer 4 (ZK)**: Generates random SHA-256-like strings to represent proof hashes.
-   **Layer 5 (Conformal)**: Returns hardcoded prediction sets based on query keywords.

## 3. UI/UX Patterns

### 3.1 Progressive Disclosure
We do not show all 5 layers at once. They cascade in:
-   Status changes from 'pending' -> 'running' -> 'complete'.
-   Loading spinners (`Loader2`) indicate activity.
-   Panels animate in (`animate-fade-in-up`) as they complete.

### 3.2 Visual Confirmation
-   **Green**: Verified/Safe.
-   **Yellow**: Uncertain/Warning.
-   **Red**: Hallucination/Critical Error.
-   **Badges**: Used extensively to allow scanning.

### 3.3 Citations
The most critical trust feature.
-   **Implementation**: A "Primary Citation" block appears at the top of Layer 1.
-   **Style**: Italicized, bordered, distinct background to separate source truth from AI analysis.

## 4. Security & Privacy
-   **Client-Side Execution**: The PDF text extraction happens entirely in the user's browser memory. The raw file is never uploaded to a server in this demo.
-   **Sanitization**: Input text is treated as a string; no `dangerouslySetInnerHTML` is used on user content to prevent XSS.

## 5. Future Improvements
-   **Real Z3 Integration**: Connect to a WASM build of Z3 for actual in-browser solving.
-   **Vector DB**: Use a client-side vector store (like Voy) for better citation retrieval than string matching.
-   **Local LLM**: Integrate WebLLM to run the "Agents" entirely in the browser.
