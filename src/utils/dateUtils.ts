// utils/dateUtils.ts

// Types for Intl.DateTimeFormat parts
interface DateTimeFormatPart {
  type:
    | "year"
    | "month"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "literal"
    | "weekday"
    | "era"
    | "timeZoneName"
    | "dayPeriod"
  value: string
}

/**
 * Get the current date string in Nairobi timezone (YYYY-MM-DD format)
 * @param date Optional date to convert (defaults to current date)
 * @returns Date string in YYYY-MM-DD format
 */
export const getNairobiDateString = (date: Date = new Date()): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  const formatter = new Intl.DateTimeFormat("en-CA", options)
  const parts = formatter.formatToParts(date)

  const year = parts.find((p) => p.type === "year")?.value
  const month = parts.find((p) => p.type === "month")?.value
  const day = parts.find((p) => p.type === "day")?.value

  if (!year || !month || !day) {
    throw new Error("Failed to format Nairobi date")
  }

  return `${year}-${month}-${day}`
}

/**
 * Get the current date object adjusted to Nairobi timezone
 * @param date Optional date to convert (defaults to current date)
 * @returns Date object representing Nairobi time
 */
export const getNairobiDate = (date: Date = new Date()): Date => {
  const nairobiDateString = getNairobiDateString(date)
  const [year, month, day] = nairobiDateString.split("-").map(Number)

  // Create date in Nairobi timezone (month is 0-indexed in JavaScript Date)
  return new Date(year, month - 1, day, 12, 0, 0) // Set to noon to avoid timezone issues
}

/**
 * Get Nairobi datetime string in ISO format
 * @param date Optional date to convert (defaults to current date)
 * @returns ISO string in Nairobi timezone
 */
export const getNairobiISOString = (date: Date = new Date()): string => {
  const nairobiDate = getNairobiDate(date)
  // Get the Nairobi time in ISO format
  const isoString = nairobiDate.toISOString()
  return isoString
}

/**
 * Get start and end of day in Nairobi timezone for filtering
 * @param dateString Date string in YYYY-MM-DD format (defaults to today)
 * @returns Object with start and end Date objects for the day
 */
export const getNairobiDayRange = (
  dateString?: string,
): { start: Date; end: Date } => {
  const date = dateString ? parseDateString(dateString) : new Date()
  const nairobiDateString = getNairobiDateString(date)
  const [year, month, day] = nairobiDateString.split("-").map(Number)

  // Start of day in Nairobi (00:00:00)
  const start = new Date(year, month - 1, day, 0, 0, 0, 0)

  // End of day in Nairobi (23:59:59.999)
  const end = new Date(year, month - 1, day, 23, 59, 59, 999)

  return { start, end }
}

/**
 * Parse a date string in YYYY-MM-DD format to Date object
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Date object
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number)
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error(`Invalid date string: ${dateString}`)
  }
  return new Date(year, month - 1, day)
}

/**
 * Format date for display in Nairobi timezone
 * @param date Date to format
 * @param format Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export const formatNairobiDate = (
  date: Date,
  format: "short" | "medium" | "long" | "full" = "medium",
): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: format === "short" ? "numeric" : "long",
    day: "numeric",
    weekday: format === "full" ? "long" : undefined,
  }

  return date.toLocaleDateString("en-US", options)
}

/**
 * Get yesterday's date in Nairobi timezone
 * @returns Date string in YYYY-MM-DD format for yesterday
 */
export const getYesterdayNairobi = (): string => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return getNairobiDateString(yesterday)
}

/**
 * Get tomorrow's date in Nairobi timezone
 * @returns Date string in YYYY-MM-DD format for tomorrow
 */
export const getTomorrowNairobi = (): string => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return getNairobiDateString(tomorrow)
}

/**
 * Check if a date string is today in Nairobi timezone
 * @param dateString Date string in YYYY-MM-DD format
 * @returns boolean
 */
export const isTodayInNairobi = (dateString: string): boolean => {
  const today = getNairobiDateString()
  return dateString === today
}

/**
 * Get the current Nairobi time in HH:MM:SS format
 * @returns Time string
 */
export const getNairobiTime = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }

  return new Date().toLocaleTimeString("en-US", options)
}

/**
 * Get the current Nairobi datetime for API requests
 * @returns ISO string with Nairobi timezone offset
 */
export const getNairobiTimestamp = (): string => {
  const now = new Date()
  const timezoneOffset = -180 // Nairobi is UTC+3 (3 hours * 60 minutes = 180 minutes)

  // Create ISO string with Nairobi timezone
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60))
    .toString()
    .padStart(2, "0")
  const offsetMinutes = Math.abs(timezoneOffset % 60)
    .toString()
    .padStart(2, "0")
  const sign = timezoneOffset >= 0 ? "+" : "-"

  const date = new Date(now.getTime() - timezoneOffset * 60000)
  const isoWithoutZ = date.toISOString().slice(0, -1)

  return `${isoWithoutZ}${sign}${offsetHours}:${offsetMinutes}`
}

// Export a default object with all functions
const NairobiDateUtils = {
  getNairobiDateString,
  getNairobiDate,
  getNairobiISOString,
  getNairobiDayRange,
  parseDateString,
  formatNairobiDate,
  getYesterdayNairobi,
  getTomorrowNairobi,
  isTodayInNairobi,
  getNairobiTime,
  getNairobiTimestamp,
}

export default NairobiDateUtils
