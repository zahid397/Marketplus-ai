function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\r/g, '')
}

function wrapLines(text: string, maxLen = 90): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLen) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

export function buildReportPdf(report: {
  title: string
  summary: string
  ticker: string
  createdAt: string
  pages: number
  template?: string
}): Buffer {
  const bodyLines = [
    'MarketPulse AI — Intelligence Report',
    report.title,
    `Ticker: ${report.ticker}`,
    `Template: ${report.template || 'pre-earnings'}`,
    `Generated: ${new Date(report.createdAt).toLocaleString()}`,
    `Pages: ${report.pages}`,
    '',
    'EXECUTIVE SUMMARY',
    ...wrapLines(report.summary),
    '',
    'KEY SIGNALS (Demo)',
    '- Institutional activity elevated',
    '- Hiring velocity trending positive',
    '- News sentiment constructive pre-earnings',
    '',
    'This document was generated in demo mode.',
    'Not financial advice.',
  ]

  const streamContent = bodyLines
    .map((line, i) => {
      const y = 780 - i * 14
      if (y < 40) return ''
      return `BT /F1 11 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`
    })
    .filter(Boolean)
    .join('\n')

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'utf8')} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'))
    pdf += obj
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, 'utf8')
}
