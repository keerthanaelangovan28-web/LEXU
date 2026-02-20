"use client"

import { useRef, useState } from "react"
import { FileText, Search, Loader2, ChevronDown, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fileNames, setFileNames] = useState<string[]>([])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const newFileNames: string[] = []
      let combinedText = sourceText ? sourceText + "\n\n" : ""

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        newFileNames.push(file.name)

        let text = ""
        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(file)
        } else if (file.type === "text/plain") {
          text = await file.text()
        } else {
          continue
        }

        combinedText += `--- Document: ${file.name} ---\n${text}\n\n`
      }

      setSourceText(combinedText)
      setFileNames((prev) => [...prev, ...newFileNames])
    } catch (error) {
      console.error("File upload error:", error)
      alert("Failed to read file(s)")
    }
  }

  function loadSampleData() {
    setSourceText(SAMPLE_CONTRACT)
    setQuery(SAMPLE_QUERIES[0])
    setShowSample(false)
  }

  function handleVerify() {
    if (sourceText.trim() && query.trim()) {
      onVerify(sourceText, query)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Document Input</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".txt,.pdf"
            multiple
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs bg-transparent"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Files
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSampleData}
            className="text-xs bg-transparent"
          >
            Load Sample NDA
          </Button>
        </div>
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
