import { NextResponse } from 'next/server'

// BUG 3 FIX: Global singleton counters for real verification statistics.
// Incremented by the verification engine on each completed verification.
declare global {
  // eslint-disable-next-line no-var
  var __lexaxiom_verifications_total: number | undefined
  // eslint-disable-next-line no-var
  var __lexaxiom_verifications_last_month: number | undefined
}

if (global.__lexaxiom_verifications_total === undefined) {
  global.__lexaxiom_verifications_total = 0
}
if (global.__lexaxiom_verifications_last_month === undefined) {
  global.__lexaxiom_verifications_last_month = 0
}

export function incrementVerificationCount() {
  global.__lexaxiom_verifications_total = (global.__lexaxiom_verifications_total ?? 0) + 1
}

export function getVerificationStats() {
  const total = global.__lexaxiom_verifications_total ?? 0
  const lastMonth = global.__lexaxiom_verifications_last_month ?? 0

  let trend = 'No verifications yet'
  if (total > 0 && lastMonth > 0) {
    const pct = (((total - lastMonth) / lastMonth) * 100).toFixed(1)
    const sign = total >= lastMonth ? '+' : ''
    trend = `${sign}${pct}% from last month`
  } else if (total > 0) {
    trend = 'First verifications this month'
  }

  return { total, trend }
}

export async function GET() {
  const { total, trend } = getVerificationStats()
  return NextResponse.json({ verifications: total, trend })
}
