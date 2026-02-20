# Technology Stack

## Core Framework
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Directory, React Server Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Runtime**: Node.js

## Styling & UI
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter & JetBrains Mono (via `next/font`)
- **Animation**: CSS Keyframes (Tailwind `animate-` utilities)

## Logic & Analysis (Verification Engine)
- **Verification Logic**: Custom Neuro-Symbolic Engine (`lib/verification-engine.ts`)
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/) (`pdfjs-dist`) for client-side text extraction
- **Logic Solver Simulation**: Z3 SMT Solver (Simulated for Hackathon/Demo purposes)
- **Multi-Agent Simulation**: Custom weighted consensus algorithm
- **Statistical Conformal Prediction**: Custom implementation

## Development Tools
- **Linter**: ESLint
- **Formatter**: Prettier (implied)
- **Package Manager**: NPM
