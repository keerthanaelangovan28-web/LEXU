export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        // Dynamic import to avoid SSR issues
        const pdfjsLib = await import('pdfjs-dist')

        // Define version - hardcoded if dynamic detection fails
        const version = '5.4.624' // Matching package.json exactly for reliability

        // Set worker source with multiple fallback mechanisms
        if (typeof window !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`
        }

        const arrayBuffer = await file.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            disableFontFace: true,
            verbosity: 0,
        })

        const pdf = await loadingTask.promise
        let fullText = ''

        // Extract text page by page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
                .map((item: any) => ('str' in item ? item.str : ''))
                .join(' ')
            fullText += pageText + '\n\n'
        }

        const result = fullText.trim()
        if (!result) {
            throw new Error('This PDF appears to be a scanned image or contains no extractable text.')
        }

        return result
    } catch (error: any) {
        console.error('PDF Extraction Error:', error)
        if (error.message?.includes('worker')) {
            throw new Error('Security Error: Could not load the PDF processing worker. Please check your internet connection or use a different browser.')
        }
        throw error
    }
}
