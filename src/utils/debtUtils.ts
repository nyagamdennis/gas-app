// Helpers for debt calculations
//
// Usage example:
// const debtors = [
//   { amount: 100, date_given: '2025-11-28T09:12:00Z' },
//   { amount: 50, date_given: '2025-11-29T12:00:00Z' },
//   { amount: 25, date_given: '2025-11-29T16:00:00Z' }
// ]
// computeDayOverDayDebtChange(debtors)
// -> { previousTotal: 100, targetTotal: 75, changeAmount: -25, changePercent: -25 }

export interface DebtorRecord {
  id?: number
  amount: number
  date_given: string | Date
  cleared?: boolean
}

export interface DayChangeResult {
  targetDate: string | null
  previousDate: string | null
  previousTotal: number
  targetTotal: number
  changeAmount: number
  changePercent: number | null // null when previousTotal === 0 and targetTotal > 0 (infinite)
}

// Normalize a date to YYYY-MM-DD (UTC) — consistent grouping by day
function toYMD(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d
  if (Number.isNaN(dt.getTime())) return null
  return dt.toISOString().slice(0, 10)
}

// Compute day-over-day change for debtor records.
// - debtors: array of DebtorRecord
// - targetDate (optional): if provided it should be a YYYY-MM-DD string or Date; otherwise the most recent date in the data is used
export function computeDayOverDayDebtChange(
  debtors: DebtorRecord[],
  targetDate?: string | Date
): DayChangeResult {
  if (!Array.isArray(debtors) || debtors.length === 0) {
    return {
      targetDate: null,
      previousDate: null,
      previousTotal: 0,
      targetTotal: 0,
      changeAmount: 0,
      changePercent: 0,
    }
  }

  // Group sums by date string YYYY-MM-DD
  const map = new Map<string, number>()
  for (const r of debtors) {
    const dateKey = toYMD(r.date_given)
    if (!dateKey) continue
    const amt = Number(r.amount) || 0
    map.set(dateKey, (map.get(dateKey) || 0) + amt)
  }

  const dates = Array.from(map.keys()).sort()
  if (dates.length === 0) {
    return {
      targetDate: null,
      previousDate: null,
      previousTotal: 0,
      targetTotal: 0,
      changeAmount: 0,
      changePercent: 0,
    }
  }

  // pick index for target date
  let targetKey: string
  if (targetDate) {
    const k = toYMD(targetDate)
    if (!k || !map.has(k)) {
      // if targetDate not found use latest
      targetKey = dates[dates.length - 1]
    } else {
      targetKey = k
    }
  } else {
    targetKey = dates[dates.length - 1]
  }

  const targetIdx = dates.indexOf(targetKey)
  const prevIdx = targetIdx - 1

  const targetTotal = map.get(targetKey) || 0
  const previousTotal = prevIdx >= 0 ? map.get(dates[prevIdx]) || 0 : 0

  const changeAmount = targetTotal - previousTotal

  let changePercent: number | null = null
  if (previousTotal === 0) {
    // mathematically infinite (or undefined)
    changePercent = previousTotal === 0 && targetTotal === 0 ? 0 : null
  } else {
    changePercent = (changeAmount / previousTotal) * 100
  }

  return {
    targetDate: targetKey,
    previousDate: prevIdx >= 0 ? dates[prevIdx] : null,
    previousTotal,
    targetTotal,
    changeAmount,
    changePercent,
  }
}

export default computeDayOverDayDebtChange
