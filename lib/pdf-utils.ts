export async function extractTextFromPDF(file: File): Promise<string> {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist')

    // Set the worker source — try multiple CDN fallbacks
    if (typeof window !== 'undefined') {
        const version = pdfjsLib.version
        // Try jsdelivr CDN first (more reliable), then unpkg
        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
        } catch {
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
        }
    }

    const arrayBuffer = await file.arrayBuffer()

    const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        // Disable features that might fail in browser environment
        disableFontFace: true,
        verbosity: 0,
    })

    const pdf = await loadingTask.promise

    let fullText = ''
    const numPages = pdf.numPages

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ')
        fullText += pageText + '\n\n'
    }

    const result = fullText.trim()
    if (!result) {
        throw new Error('No text could be extracted from this PDF. It may be a scanned image PDF.')
    }

    return result
}
