export interface ExportFormat {
  format: 'csv' | 'json' | 'pdf'
  filename: string
}

export function exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn('[v0] No data to export')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    ),
  ].join('\n')

  downloadFile(csvContent, `${filename}.csv`, 'text/csv')
}

export function exportToJSON(data: any[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, `${filename}.json`, 'application/json')
}

export function exportToMarkdown(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn('[v0] No data to export')
    return
  }

  const headers = Object.keys(data[0])
  const markdownContent = [
    `# ${filename}`,
    `\nGenerated: ${new Date().toISOString()}`,
    '\n## Data\n',
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...data.map(
      (row) =>
        `| ${headers.map((header) => row[header] || '-').join(' | ')} |`
    ),
  ].join('\n')

  downloadFile(markdownContent, `${filename}.md`, 'text/markdown')
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  try {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('[v0] Failed to download file:', error)
  }
}

export function generateAuditReport(auditLogs: any[], startDate?: Date, endDate?: Date): void {
  const filtered = auditLogs.filter((log) => {
    if (!startDate || !endDate) return true
    const logDate = new Date(log.timestamp)
    return logDate >= startDate && logDate <= endDate
  })

  const summary = {
    totalActions: filtered.length,
    actionsByType: {} as Record<string, number>,
    actionsByUser: {} as Record<string, number>,
    timeline: {} as Record<string, number>,
  }

  filtered.forEach((log) => {
    summary.actionsByType[log.action] = (summary.actionsByType[log.action] || 0) + 1
    summary.actionsByUser[log.userId] = (summary.actionsByUser[log.userId] || 0) + 1

    const date = new Date(log.timestamp).toISOString().split('T')[0]
    summary.timeline[date] = (summary.timeline[date] || 0) + 1
  })

  exportToJSON(
    [
      {
        reportType: 'AUDIT_REPORT',
        generatedAt: new Date().toISOString(),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        summary,
        logs: filtered,
      },
    ],
    `audit_report_${Date.now()}`
  )
}
