"use client"

import { useRef, useState } from "react"
import { FileText, Search, Loader2, ChevronDown, Upload, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SAMPLE_CONTRACT, SAMPLE_QUERIES } from "@/lib/types"
import { extractTextFromPDF } from "@/lib/pdf-utils"

interface InputSectionProps {
  onVerify: (sourceText: string, query: string) => void
  isProcessing: boolean
}

export function InputSection({ onVerify, isProcessing }: InputSectionProps) {
  const [sourceText, setSourceText] = useState("")
  const [query, setQuery] = useState("")
  const [showSample, setShowSample] = useState(false)
  const [isPrivacyProtected, setIsPrivacyProtected] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const [fileNames, setFileNames] = useState<string[]>([])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFileNames: string[] = []
    let combinedText = sourceText ? sourceText + "\n\n" : ""

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      try {
        let text = ""

        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(file)
        } else if (
          file.type === "text/plain" ||
          file.name.endsWith(".txt") ||
          file.name.endsWith(".md") ||
          file.name.endsWith(".csv")
        ) {
          text = await file.text()
        } else {
          // Try reading as text as a fallback for unsupported types
          try {
            text = await file.text()
          } catch {
            alert(`File "${file.name}" is not a supported format. Please use PDF or TXT files.`)
            continue
          }
        }

        newFileNames.push(file.name)
        combinedText += `--- Document: ${file.name} ---\n${text}\n\n`
      } catch (err) {
        console.error(`Error reading file ${file.name}:`, err)
        alert(`Failed to read "${file.name}". Please make sure it is a valid PDF or text file.`)
      }
    }

    if (newFileNames.length > 0) {
      setSourceText(combinedText)
      setFileNames((prev) => [...prev, ...newFileNames])
    }

    // Reset the input so the same file can be re-selected
    e.target.value = ""
  }

  function loadSampleData() {
    setSourceText(SAMPLE_CONTRACT)
    setQuery(SAMPLE_QUERIES[0])
    setShowSample(false)
  }

  const redactPII = (text: string) => {
    if (!isPrivacyProtected) return text
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED EMAIL]")
      .replace(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, "[REDACTED PHONE]")
  }

  function handleVerify() {
    if (sourceText.trim() && query.trim()) {
      const processedText = redactPII(sourceText)
      onVerify(processedText, query)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-6 neon-border transition-all duration-500" style={{ background: '#0F172A', borderColor: 'rgba(0, 180, 255, 0.2)' }}>
      {/* Header row — title only */}
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 shrink-0" style={{ color: '#00B4FF' }} />
        <h2 className="text-lg font-black tracking-tight leading-tight" style={{ color: '#00B4FF' }}>Neural Document Analysis</h2>
      </div>

      {/* BUG 4 FIX: buttons centered below header, equal width, primary + ghost */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".txt,.pdf"
        multiple
        onChange={handleFileUpload}
      />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-xs gap-2 font-bold neon-glow"
          style={{ background: 'linear-gradient(135deg, #00B4FF, #3399FF)', color: '#030712' }}
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
        <Button
          variant="outline"
          onClick={loadSampleData}
          className="w-full max-w-xs gap-2 font-bold border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 bg-transparent"
        >
          View Sample Data
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="source" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Contract / Legal Document
          </label>
          <textarea
            id="source"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Paste your legal contract or document text here..."
            className="h-40 w-full resize-none rounded-lg border border-border bg-secondary p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="query" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Query / Claim to Verify
          </label>
          <div className="relative">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter the claim or question to verify against the document..."
              className="h-20 w-full resize-none rounded-lg border border-border bg-secondary p-3 pr-10 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowSample(!showSample)}
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Toggle sample queries"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          {showSample && (
            <div className="mt-1 rounded-lg border border-border bg-secondary p-2">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Sample Queries:</p>
              <div className="flex flex-col gap-1">
                {SAMPLE_QUERIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { setQuery(q); setShowSample(false) }}
                    className="rounded px-2 py-1 text-left text-xs text-foreground hover:bg-muted"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {fileNames.length > 0 && (
          <div className="rounded-lg border border-border bg-secondary p-2">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Uploaded Documents:</p>
            <div className="flex flex-wrap gap-2">
              {fileNames.map((name, i) => (
                <span key={i} className="rounded bg-background px-2 py-1 text-[10px] text-foreground border border-border">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guard - Hackathon Special */}
      <div className="flex items-center justify-between rounded-xl bg-primary/5 p-3 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${isPrivacyProtected ? 'bg-success/20 animate-pulse' : 'bg-slate-800'}`}>
            <ShieldCheck className={`h-4 w-4 ${isPrivacyProtected ? 'text-success' : 'text-slate-500'}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-tight">Privacy Guard <span className="text-[10px] text-primary font-black ml-1">BETA</span></p>
            <p className="text-[9px] text-slate-400">Auto-redact PII (Emails, Phones) before processing</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="privacy-guard"
            checked={isPrivacyProtected}
            onCheckedChange={setIsPrivacyProtected}
          />
        </div>
      </div>

      <Button
        onClick={handleVerify}
        disabled={isProcessing || !sourceText.trim() || !query.trim()}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Verify Claim
          </>
        )}
      </Button>
    </div>
  )
}
