export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        // Dynamic import to avoid SSR issues with canvas/DOMMatrix
        const pdfjsLib = await import('pdfjs-dist');

        // Make sure to set the worker source in the client context
        if (typeof window !== 'undefined' && 'Worker' in window) {
            // Use a CDN for the worker to avoid build hassles
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;

        let fullText = '';
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Extract text items from the content, ignoring items without 'str' property if necessary, 
            // though Typescript usually handles the union type well.
            // We cast item to any because the type definition can be tricky with different versions.
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file');
    }
}
